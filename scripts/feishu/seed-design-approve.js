#!/usr/bin/env node
// 在 設計送審 表寫入 3 筆測試資料（owner=bevis, 審核狀態=已提交）
// 試用前清掉就好。

const WORKER = 'https://feishu-proxy.raychou6913.workers.dev';
const AT = 'Sg7ObNELHaAdZzshGIFjWPVhpce';
const TBL = 'tblSgCcB2aFcsPaw';

const NOW = Date.now();
const ROWS = [
  {
    標題: 'Chiikawa 桌曆 2026 — 4 視圖',
    設計名稱: 'Chiikawa 2026 桌曆',
    'IP品牌': 'Chiikawa',
    '設計師/供應商': '詩彤',
    送審階段: '四視圖',
    送審輪次: 1,
    審核狀態: '已提交',
    修改備註: '初稿，等 Bevis 看色調。',
    owner: 'bevis',
    submitted_by: 'shitong',
    created_at: NOW - 86400000 * 2,
    updated_at: NOW - 86400000 * 2,
    version: 1,
    urgency: 'normal',
  },
  {
    標題: 'Snoopy 馬克杯外包設計第 2 輪',
    設計名稱: 'Snoopy 馬克杯 v2',
    'IP品牌': 'Snoopy',
    '設計師/供應商': '外包 · 小李',
    送審階段: '彩稿/配色',
    送審輪次: 2,
    審核狀態: '已提交',
    修改備註: '依上輪意見調整色調，等 Bevis 第二輪確認。',
    owner: 'bevis',
    submitted_by: 'shitong',
    created_at: NOW - 86400000 * 1,
    updated_at: NOW - 86400000 * 1,
    version: 1,
    urgency: 'high',
  },
  {
    標題: 'Mofusand 文創包裝 — 包裝設計',
    設計名稱: 'Mofusand 文創包裝',
    'IP品牌': 'Mofusand',
    '設計師/供應商': '詩彤',
    送審階段: '包裝設計',
    送審輪次: 1,
    審核狀態: '已提交',
    修改備註: '版型已定，等核准進打樣。',
    owner: 'bevis',
    submitted_by: 'shitong',
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

async function createRecord(token, fields) {
  const r = await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${TBL}/records`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  return r.json();
}

(async () => {
  const token = await getToken();
  for (const row of ROWS) {
    const result = await createRecord(token, row);
    if (result.code === 0) {
      console.log(`+ ${row.設計名稱} → ${result.data.record.record_id}`);
    } else {
      console.log(`FAIL ${row.設計名稱}: ${JSON.stringify(result)}`);
    }
  }
})();
