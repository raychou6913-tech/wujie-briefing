#!/usr/bin/env node
// Idempotently add ERP inbox common fields to specified Feishu Bitable tables.
//
// Usage:
//   node scripts/feishu/add-inbox-fields.js                  # default targets
//   node scripts/feishu/add-inbox-fields.js tblXXX tblYYY    # custom tables
//
// 跑兩次安全：已存在的欄位會 skip。

const WORKER = 'https://feishu-proxy.raychou6913.workers.dev';
const AT = 'Sg7ObNELHaAdZzshGIFjWPVhpce';

const COMMON_FIELDS = [
  { field_name: 'owner', type: 1, ui_type: 'Text' },
  { field_name: 'submitted_by', type: 1, ui_type: 'Text' },
  { field_name: 'created_at', type: 5, ui_type: 'DateTime', property: { date_formatter: 'yyyy/MM/dd HH:mm', auto_fill: false } },
  { field_name: 'updated_at', type: 5, ui_type: 'DateTime', property: { date_formatter: 'yyyy/MM/dd HH:mm', auto_fill: false } },
  { field_name: 'version', type: 2, ui_type: 'Number', property: { formatter: '0' } },
  {
    field_name: 'urgency',
    type: 3,
    ui_type: 'SingleSelect',
    property: { options: [{ name: 'high' }, { name: 'normal' }] },
  },
];

// 沒有現成 SingleSelect 狀態欄位的表，加 inbox_state（用於 yangzi/leo/yuming 等費用流）
const INBOX_STATE_FIELD = {
  field_name: 'inbox_state',
  type: 3,
  ui_type: 'SingleSelect',
  property: { options: [{ name: 'pending' }, { name: 'approved' }, { name: 'rejected' }, { name: 'paid' }] },
};

// 旗標：要不要也加 inbox_state（預設 false，依 table 列表決定）
const TABLES_NEED_INBOX_STATE = new Set(['tblvGsQpXPHtkp1C']); // 費用實報

const DEFAULT_TABLES = [
  'tblSgCcB2aFcsPaw', // 設計送審 — Bevis / 珮玲 / 詩彤
];

async function getToken() {
  const r = await fetch(`${WORKER}/auth/token`);
  const d = await r.json();
  if (!d.tenant_access_token) throw new Error('failed to get token: ' + JSON.stringify(d));
  return d.tenant_access_token;
}

async function listFields(token, tableId) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${tableId}/fields?page_size=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const d = await r.json();
  if (d.code !== 0) throw new Error(`list fields failed [${tableId}]: ${JSON.stringify(d)}`);
  return d.data.items;
}

async function addField(token, tableId, def) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${tableId}/fields`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(def),
  });
  return r.json();
}

async function tableName(token, tableId) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables?page_size=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const d = await r.json();
  const hit = d?.data?.items?.find((t) => t.table_id === tableId);
  return hit?.name || '(unknown)';
}

(async () => {
  const targets = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_TABLES;
  const token = await getToken();
  console.log(`Base AT: ${AT}`);
  console.log(`Targets: ${targets.join(', ')}\n`);

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const tbl of targets) {
    const name = await tableName(token, tbl);
    console.log(`[${tbl}] ${name}`);
    const existing = await listFields(token, tbl);
    const names = new Set(existing.map((f) => f.field_name));
    const fieldsToAdd = TABLES_NEED_INBOX_STATE.has(tbl) ? [...COMMON_FIELDS, INBOX_STATE_FIELD] : COMMON_FIELDS;

    for (const def of fieldsToAdd) {
      if (names.has(def.field_name)) {
        console.log(`  skip  ${def.field_name}`);
        skipped++;
        continue;
      }
      const result = await addField(token, tbl, def);
      if (result.code === 0) {
        console.log(`  +add  ${def.field_name} (${def.ui_type})`);
        added++;
      } else {
        console.log(`  FAIL  ${def.field_name} → ${JSON.stringify(result)}`);
        failed++;
      }
    }
    console.log('');
  }

  console.log(`Summary: +${added} added, ${skipped} skipped, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
