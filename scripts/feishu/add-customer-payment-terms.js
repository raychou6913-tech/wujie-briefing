#!/usr/bin/env node
// 加「付款條件」標準化欄位到 客戶名單表（5 種模式對齊工作流地圖 #1 批發訂單）
// 既有「帳期」欄位選項混亂（即期/30天/Net30/...）— 不動，另加新欄位

const WORKER = 'https://feishu-proxy.raychou6913.workers.dev';
const AT = 'Sg7ObNELHaAdZzshGIFjWPVhpce';
const CUSTOMER_TBL = 'tbl9HpW9Wc6kDOwu';

const FIELD_DEF = {
  field_name: '付款條件',
  type: 3,
  ui_type: 'SingleSelect',
  property: {
    options: [
      { name: '全款預付' },         // 收 100% → 出貨（新客戶 / 高風險）
      { name: '訂金+尾款' },        // 30% → 出貨 → 70%（一般合作）
      { name: '帳期 30 天' },        // 出貨 → 30 天後付（既有 KA）
      { name: '帳期 60-90 天' },     // 出貨 → N 天後付（大型 KA / 流通通路）
      { name: '寄售' },              // 出貨不結帳 → 賣掉才結（特殊通路）
    ],
  },
};

async function getToken() {
  const r = await fetch(`${WORKER}/auth/token`);
  return (await r.json()).tenant_access_token;
}

async function listFields(token) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${CUSTOMER_TBL}/fields?page_size=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return (await r.json()).data?.items || [];
}

async function addField(token, def) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${CUSTOMER_TBL}/fields`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(def),
  });
  return r.json();
}

(async () => {
  const token = await getToken();
  const existing = await listFields(token);
  const names = new Set(existing.map(f => f.field_name));
  if (names.has(FIELD_DEF.field_name)) {
    console.log(`skip  ${FIELD_DEF.field_name}（已存在）`);
    return;
  }
  const r = await addField(token, FIELD_DEF);
  if (r.code === 0) console.log(`+add  ${FIELD_DEF.field_name} (5 種選項)`);
  else console.log(`FAIL  ${JSON.stringify(r)}`);
})();
