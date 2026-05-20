#!/usr/bin/env node
// 建「新提案」表給 erp-ideas（公司提案中央池子 MVP）
// idempotent：表已存在就跳過

const WORKER = 'https://feishu-proxy.raychou6913.workers.dev';
const AT = 'Sg7ObNELHaAdZzshGIFjWPVhpce';
const TABLE_NAME = '新提案';

const FIELDS = [
  { field_name: '標題', type: 1, ui_type: 'Text' },
  { field_name: '描述', type: 1, ui_type: 'Text' },
  { field_name: '附件', type: 17, ui_type: 'Attachment' },
  { field_name: '提案人', type: 1, ui_type: 'Text' },
  { field_name: '上傳時間', type: 5, ui_type: 'DateTime', property: { date_formatter: 'yyyy/MM/dd HH:mm', auto_fill: false } },
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
    body: JSON.stringify({ table: { name } }),
  });
  return r.json();
}

async function listFields(token, tableId) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${tableId}/fields?page_size=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return (await r.json()).data?.items || [];
}

async function addField(token, tableId, def) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${tableId}/fields`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(def),
  });
  return r.json();
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
})();
