# 飛書「拓客記錄」表 schema 設計

> 待 MJ 在飛書建表（5/14-5/15 之間）

---

## 表格資訊

- **表名**：拓客記錄
- **Base AT**：`Sg7ObNELHaAdZzshGIFjWPVhpce`（ERP 主 Base）
- **建表 API**：`POST /open-apis/bitable/v1/apps/{AT}/tables`

## 欄位設計

| 欄位 | type | 選項 / 說明 |
|------|------|------------|
| 公司名稱 | Text (1) | Apollo 自動帶入 |
| 聯絡人 | Text (1) | 同上 |
| Email | Text (1) | 同上 |
| LinkedIn | URL (15) | 同上 |
| 公司地區 | SingleSelect (3) | 印尼 / 泰國 / 越南 / 馬來西亞 / 菲律賓 / 大陸 / 香港 / 台灣 / 韓國 / 日本 / 北美 / 歐洲 / 其他 |
| 公司類型 | SingleSelect (3) | 商場 / 玩具通路 / 文創選品 / KA 零售 / 經銷商 / 品牌方 / 其他 |
| ICP Tier | SingleSelect (3) | Tier 1 / Tier 2 / Tier 3 / 黑名單 |
| 使用 Template | SingleSelect (3) | V1 主題開發 / V2 新興 IP / V3 展會邀請 |
| Template Subject | Text (1) | 哪個 A/B subject |
| 發信日期 | DateTime (5) | |
| Open 狀態 | SingleSelect (3) | 未讀 / 已讀 / 已讀無回 / 已回 / 退信 |
| 回覆狀態 | SingleSelect (3) | 未回 / 簡短拒絕 / 詢問細節 / 安排會議 / 合作中 |
| 跟進階段 | SingleSelect (3) | Day 0 / Day 3 / Day 7 / Day 14 / Day 30 / Day 60 dormant |
| 負責人 | Text (1) | Ray / 安然 / 老董 / 德寶 |
| 備註 | Text (1) | 客製化資訊 |
| 展會約定 | SingleSelect (3) | 未邀請 / 已邀請台北 / 已邀請雅加達 / 確認到場 / 取消 |
| 對應項目 | Text (1) | 若成交，link 到飛書「項目排期」record_id |

## 為什麼這樣設計

- **ICP Tier 篩選**：跟 ICP_DEFINITION.md 同步
- **Template + Subject 追蹤**：A/B 測試需要
- **Open / Reply 狀態分開**：Apollo 自動帶 open，reply 要人工標
- **跟進階段**：對應 v1 template 裡的 Day 0/3/7/14/30/60 規則
- **展會約定**：8 月台北 / 雅加達展位流量管理
- **對應項目**：成交後接 ERP「項目排期」，閉環

## 預期記錄量

| 階段 | 月寫入 |
|------|--------|
| Phase 1 造槍期（5 月底前）| 100-500 筆名單（人工 + Apollo）|
| Phase 1 扣板機（6 月起）| 月新增 100-300 / 更新 500+ |
| Phase 2（9 月起）| 月新增 200-500 / 更新 1000+ |

要不要分 archive table（譬如「拓客記錄_dormant」存超過 60 天沒回的）等真實量上來再決定。

## 寫入 API

跟現有 ERP 寫飛書同 pattern：
```javascript
await fetch(`${PROXY}/open-apis/bitable/v1/apps/${APP}/tables/${TBL_OUTREACH}/records`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + tk, 'Content-Type': 'application/json' },
  body: JSON.stringify({ fields })
});
```

要等 Ray 給 Apollo API key 才能跑自動匯入，初期可以手動匯入測試。
