#!/usr/bin/env node
// 建「跨境款項」表給躍明追蹤集團內部跨主體打款
// idempotent：表已存在跳過

const WORKER = 'https://feishu-proxy.raychou6913.workers.dev';
const AT = 'Sg7ObNELHaAdZzshGIFjWPVhpce';
const TABLE_NAME = '跨境款項';

const ENTITIES = ['北京蕪解', '深圳子公司', '台灣悍草', '香港 JV', 'UJ BKK'];
const CURRENCIES = ['CNY', 'HKD', 'TWD', 'USD', 'THB'];
const PURPOSES = ['貨款結算', 'IP 版權費', '服務費', '內部借款', '樣品費', '展場費代墊', '其他'];

const FIELDS = [
  { field_name: '標題', type: 1, ui_type: 'Text' },
  { field_name: '出方主體', type: 3, ui_type: 'SingleSelect', property: { options: ENTITIES.map(n => ({ name: n })) } },
  { field_name: '入方主體', type: 3, ui_type: 'SingleSelect', property: { options: ENTITIES.map(n => ({ name: n })) } },
  { field_name: '金額', type: 2, ui_type: 'Number', property: { formatter: '0' } },
  { field_name: '幣別', type: 3, ui_type: 'SingleSelect', property: { options: CURRENCIES.map(n => ({ name: n })) } },
  { field_name: '折合人民幣', type: 2, ui_type: 'Number', property: { formatter: '0' } },
  { field_name: '用途', type: 3, ui_type: 'SingleSelect', property: { options: PURPOSES.map(n => ({ name: n })) } },
  { field_name: '對應項目', type: 1, ui_type: 'Text' },
  { field_name: '出方記帳日', type: 5, ui_type: 'DateTime', property: { date_formatter: 'yyyy/MM/dd', auto_fill: false } },
  { field_name: '入方記帳日', type: 5, ui_type: 'DateTime', property: { date_formatter: 'yyyy/MM/dd', auto_fill: false } },
  { field_name: '備註', type: 1, ui_type: 'Text' },
  { field_name: 'inbox_state', type: 3, ui_type: 'SingleSelect', property: { options: [{ name: 'pending' }, { name: 'confirmed' }, { name: 'hold' }] } },
  { field_name: 'owner', type: 1, ui_type: 'Text' },
  { field_name: 'submitted_by', type: 1, ui_type: 'Text' },
  { field_name: 'created_at', type: 5, ui_type: 'DateTime', property: { date_formatter: 'yyyy/MM/dd HH:mm', auto_fill: false } },
  { field_name: 'updated_at', type: 5, ui_type: 'DateTime', property: { date_formatter: 'yyyy/MM/dd HH:mm', auto_fill: false } },
  { field_name: 'version', type: 2, ui_type: 'Number', property: { formatter: '0' } },
  { field_name: 'urgency', type: 3, ui_type: 'SingleSelect', property: { options: [{ name: 'high' }, { name: 'normal' }] } },
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
    if (names.has(def.field_name)) { console.log(`  skip  ${def.field_name}`); continue; }
    const r = await addField(token, tableId, def);
    if (r.code === 0) console.log(`  +add  ${def.field_name}`);
    else console.log(`  FAIL  ${def.field_name}: ${JSON.stringify(r)}`);
  }
  console.log(`\nTABLE_ID = ${tableId}`);
})();
