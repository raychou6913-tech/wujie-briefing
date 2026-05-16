#!/usr/bin/env node
// 寫 3 筆費用待審給楊子（owner=yangzi, inbox_state=pending）

const WORKER = 'https://feishu-proxy.raychou6913.workers.dev';
const AT = 'Sg7ObNELHaAdZzshGIFjWPVhpce';
const TBL = 'tblvGsQpXPHtkp1C';

const NOW = Date.now();
const ROWS = [
  {
    費用標題: '詩彤 出差費用報銷',
    申請人: '詩彤',
    費用類別: '差旅',
    歸屬主體: '台灣悍草',
    實際金額: 8560,
    幣別: 'TWD',
    '金額（萬元）': 0.856,
    發生日期: NOW - 86400000 * 8,
    備註: '客戶簡報出差（台北→高雄）· 高鐵 1,490 + 飯店 4,800 + 餐費 2,270',
    供應商: '',
    inbox_state: 'pending',
    owner: 'yangzi',
    submitted_by: 'shetong',
    created_at: NOW - 86400000 * 2,
    updated_at: NOW - 86400000 * 2,
    version: 1,
    urgency: 'high',
  },
  {
    費用標題: '高維 油資/車資報銷',
    申請人: '高維',
    費用類別: '差旅',
    歸屬主體: '北京蕪解',
    實際金額: 340,
    幣別: 'CNY',
    '金額（萬元）': 0.034,
    發生日期: NOW - 86400000 * 4,
    備註: '廠端提貨·送貨車資',
    inbox_state: 'pending',
    owner: 'yangzi',
    submitted_by: 'gaowei',
    created_at: NOW - 86400000 * 1,
    updated_at: NOW - 86400000 * 1,
    version: 1,
    urgency: 'normal',
  },
  {
    費用標題: '北京辦公室 4 月電費',
    申請人: '楊子',
    費用類別: '水電雜費',
    歸屬主體: '北京蕪解',
    實際金額: 1240,
    幣別: 'CNY',
    '金額（萬元）': 0.124,
    發生日期: NOW - 86400000 * 10,
    備註: '北京辦公室 4 月電費單據',
    inbox_state: 'pending',
    owner: 'yangzi',
    submitted_by: 'yangzi',
    created_at: NOW - 3600000 * 6,
    updated_at: NOW - 3600000 * 6,
    version: 1,
    urgency: 'normal',
  },
];

async function getToken() {
  const r = await fetch(`${WORKER}/auth/token`);
  return (await r.json()).tenant_access_token;
}

(async () => {
  const tk = await getToken();
  for (const row of ROWS) {
    const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${TBL}/records`, {
      method: 'POST', headers: { Authorization: `Bearer ${tk}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: row }),
    });
    const d = await r.json();
    if (d.code === 0) console.log(`+ ${row.費用標題} → ${d.data.record.record_id}`);
    else console.log(`FAIL ${row.費用標題}: ${JSON.stringify(d)}`);
  }
})();
