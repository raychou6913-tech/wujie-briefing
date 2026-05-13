# 第 5/6 輪剩餘 P2 設計文件

> 這份文件描述剩 5 條待辦的具體做法，分「能立刻動」「等條件」「要 Ray 部署」三類。
> 寫設計文件是因為這幾條涉及 Cloudflare Worker / Gemini API / Forge 跨系統，
> 不是 ERP 內部頁面改動，需要 Ray 開權限或 review。

---

## #21 AI 解析入口（Gemini 整合）

### 現況
- ✅ contract-upload.html 已接飛書 staging table（`tblApO2OHiXhXAd5`）
- ✅ staging 草稿狀態流：「待 AI 解析」→「AI 已解析待確認」→「已promote」
- ❌ 真正的 Gemini 解析還沒接

### 完整做法

**Worker 端**（Cloudflare Worker `feishu-proxy` 加新 endpoint）：
```
POST /ai/parse-contract
body: { recordId, pdfFiles: [...] }
→ Worker 內部呼叫 Gemini Vision API
→ 解析回 { mg, royaltyRate, settlement, region, period, allowedCategories }
→ 寫回 staging table 「草稿內容」+ 狀態升「AI 已解析待確認」
```

**前端**：
- `contract-upload.html` 上傳後立即呼叫 `/ai/parse-contract`
- 顯示「⏳ AI 正在解析」status
- 完成後 staging table 狀態變化

**IP Vault 端**（新建 review 頁面）：
- 列 staging 中「AI 已解析待確認」record
- 安然點「✓ 確認」→ promote 到 IP 主檔 + 狀態改「已promote」
- 安然點「✗ 駁回」→ 狀態改「已駁回」+ 寫退回原因

### 阻塞點
1. **Gemini API key** — 要 Ray 提供
2. **Worker 部署權限** — `feishu-proxy` 需要加新 endpoint，要 Ray 用 `wrangler deploy`

### 簡化 PoC（不需 Gemini）
在 IP Vault 加「填寫條款」modal，手動補 MG / 版稅率，等於人工版 AI 解析。
**這部分 1 小時可做完**，等 Ray 說要做我立刻動。

---

## #10 預算 V2/V3 接事件流

### 終態（Ray 親口確認，見 `budget_v1_v2_v3_progression.md`）
- V2 來源：CRM 客戶訂單 + 採購報價單 + 財務費用申請 — 全自動回灌
- V3 來源：銷售出貨 + 收款入帳 — 全自動回灌

### 現況
- ✅ 所有費用申請已強制 link 項目（#26 完成）
- ✅ 每筆 approval record 帶「對應項目」+「對應項目ID」
- ❌ budget-planner 還沒讀「對應項目」做 V2 自動升級

### 簡化版立刻能做（30 分鐘）

在 `erp-budget-planner.html` 加：
1. 每個 V1 產品卡片載入時，從飛書「審批記錄」抓「對應項目ID = this.id」的 count
2. 卡片右上角顯示「📌 已有 3 筆審批申請」（如有）
3. 提示「→ 推進到 V2 實際版」（提供事實依據）

### 完整版（要 Worker + 事件 webhook）
1. CRM 表單送出時，呼叫 Worker `/event/order-confirmed`
2. Worker 找到對應 budget item，自動升 stage = 'v2'
3. 出貨單 + 收款 → 同樣事件 → 升 'v3'

### 阻塞點
- Worker 端需要寫 event handler
- CRM 表單還沒實際做（目前用 erp-crm 的快速記錄拜訪，沒結構化的「客戶訂單」record）

---

## #26 Forge-ERP 橋

### 設計
- Forge（wujie-studio）跑 AI 創意核准後 → 通知 ERP 觸發產品開發流水線
- 流向：Forge `tblHPNUTdcFa7tqs`（ip_db）有新 record → Worker webhook → ERP `tblTqAZIdt2ViAma`（產品開發流程）建對應 record

### 阻塞點
- Forge 那邊需要設定 webhook 觸發點
- Worker 要加 endpoint 接 Forge event

### 簡化版可立刻做（30 分鐘）
在 `erp-pipeline.html` 加「⟳ 從 Forge 拉取」按鈕，手動觸發從 Forge Base 撈最新 ip_db record 列出來讓 Ray 選哪些 promote 到 ERP pipeline。

---

## #27 Cloudflare Worker 雙表制

### 目的
AI 寫入的資料（Gemini OCR、報價單解析）先進 staging table，
人工確認後才 promote 到 master table。

### 現況
- ✅ 「合約_AI草稿」staging table 已建
- ✅ contract-upload 已寫進 staging
- ❌ Worker 沒有「自動分流 AI 寫入 → staging / 人工寫入 → master」邏輯

### 完整做法
Worker `feishu-proxy` 加邏輯：
- 偵測 request header `X-Source: ai` → 強制路由到 staging table
- 偵測 `X-Source: human` → 路由到 master table
- 或：根據 endpoint 區分（`/staging/...` vs `/master/...`）

### 阻塞點
- Worker 程式碼改動，要 Ray `wrangler deploy`
- 前端要在所有 AI 寫入處加 `X-Source: ai` header

### 簡化版（已部分實現）
目前 contract-upload 直接寫 staging table，不經過 master。
這就是事實上的「雙表制」— 只是沒有 Worker 層強制。
等真有 AI 自動寫入時再升級到 Worker 強制。

---

## #23 全系統 QA

### 做法
跑 Playwright 截圖每個關鍵頁面 + 列 console error。

### 自動腳本
- `screenshot.mjs` 已存在
- 跑 `node screenshot.mjs` 截每頁
- 截圖落到 `.screenshots/` 目錄
- 我來逐張審查 + 列 issue

### 人工 QA（Ray 要做）
16 個帳號逐一登入測試：
1. login 是否成功 + redirect 到 today
2. today 頁 render 正確（todo / waiting / numbers）
3. 「→ 進工作台」按鈕導向對的廳
4. 廳裡按鈕都點得到
5. 費用申請強制 link 項目 work
6. 新項目註冊 3 段流程能完成 + 寫進飛書
7. 戰情室 VAM 數字正確

### QA Checklist
另寫 `QA_CHECKLIST_PHASE1.md`（下個區塊）。

---

## 我建議的優先級

| 條 | 我能做 | 工作量 | 阻塞 |
|---|--------|--------|------|
| #21 簡化版（人工 promote）| ✓ | 1 小時 | 無 |
| #10 簡化版（顯示審批 count）| ✓ | 30 分鐘 | 無 |
| #26 簡化版（手動拉 Forge）| ✓ | 30 分鐘 | 無 |
| #21 完整版（Gemini）| ✗ | 4 小時 | Gemini key + Worker |
| #10 完整版（事件流）| ✗ | 4 小時 | Worker + CRM 表單 |
| #26 完整版（webhook）| ✗ | 3 小時 | Forge 設定 + Worker |
| #27 完整版（雙表強制）| ✗ | 2 小時 | Worker deploy |
| #23 自動截圖 | ✓ | 30 分鐘 | 無 |
| #23 16 帳號 QA | Ray 做 | 半天 | 無 |

**Ray 給我綠燈，我就立刻動 4 條簡化版（共 2.5 小時）**
- #21 人工 promote modal
- #10 budget-planner 顯示審批 count
- #26 Forge 手動拉取按鈕
- #23 自動截圖跑一輪

完整版的 4 條等 Ray 開 Gemini key / Worker 部署權限後再說。
