#!/usr/bin/env node
// 建「工作流地圖狀態」表給 erp-workflow-map.html 雲端同步用
// idempotent：表已存在就跳過

const WORKER = 'https://feishu-proxy.raychou6913.workers.dev';
const AT = 'Sg7ObNELHaAdZzshGIFjWPVhpce';
const TABLE_NAME = '工作流地圖狀態';

const FIELDS = [
  { field_name: '鍵', type: 1, ui_type: 'Text' },           // primary key e.g. "edits_wholesale_v1"
  { field_name: '值', type: 1, ui_type: 'Text' },           // JSON string
  { field_name: '編輯人', type: 1, ui_type: 'Text' },
  { field_name: '更新時間', type: 5, ui_type: 'DateTime', property: { date_formatter: 'yyyy/MM/dd HH:mm', auto_fill: false } },
];

async function getToken() {
  const r = await fetch(`${WORKER}/auth/token`);
  return (await r.json()).tenant_access_token;
}

async function listTables(token) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables?page_size=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return (await r.json()).data?.items || [];
}

async function createTable(token, name) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ table: { name } }),  // 只給 name，default_view_name 會自動產生
  });
  return r.json();
}

async function addField(token, tableId, def) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${tableId}/fields`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(def),
  });
  return r.json();
}

async function listFields(token, tableId) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${tableId}/fields?page_size=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return (await r.json()).data?.items || [];
}

(async () => {
  const token = await getToken();
  const tables = await listTables(token);
  let table = tables.find(t => t.name === TABLE_NAME);
  let tableId;
  if (table) {
    tableId = table.table_id;
    console.log(`exists: ${TABLE_NAME} → ${tableId}`);
  } else {
    const r = await createTable(token, TABLE_NAME);
    if (r.code !== 0) { console.error('create fail:', r); process.exit(1); }
    tableId = r.data.table_id;
    console.log(`+created: ${TABLE_NAME} → ${tableId}`);
  }
  const existing = await listFields(token, tableId);
  const names = new Set(existing.map(f => f.field_name));
  for (const def of FIELDS) {
    if (names.has(def.field_name)) {
      console.log(`  skip  ${def.field_name}`);
      continue;
    }
    const r = await addField(token, tableId, def);
    if (r.code === 0) console.log(`  +add  ${def.field_name}`);
    else console.log(`  FAIL  ${def.field_name}: ${JSON.stringify(r)}`);
  }
  console.log(`\nTABLE_ID = ${tableId}`);
  console.log('→ 更新 Worker WORKFLOW_STATE_TBL 常數');
})();
