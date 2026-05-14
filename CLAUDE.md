# 蕪解 ERP — Claude 工作說明書

> 這份文件讓 Claude 在新 session 開始時 30 秒內回到狀態。
> 每次有重大決策或架構變更，請更新這份文件。

---

## 這是什麼

**蕪解 ERP** 是蕪解創意全公司 15 人的日常經營管理系統。
定位：**IP 周邊商品公司的數位神經中樞**，不是財務合規系統（那是香港 Xero/QuickBooks 的事）。

線上網址：https://raychou6913-tech.github.io/wujie-briefing/home.html
Repo：raychou6913-tech/wujie-briefing（GitHub Pages 自動部署）

---

## 技術架構

| 層 | 工具 |
|----|------|
| 前端 | 靜態 HTML（Vanilla JS，無框架，GitHub Pages）|
| 資料庫 | 飛書多維表格（Feishu Bitable）27 張表格 |
| API 中介 | Cloudflare Worker → `feishu-proxy.raychou6913.workers.dev` |
| AI 解析 | Gemini API（合約 PDF 解析、報價單截圖填表）|
| 通知 | 飛書機器人 Webhook + LINE Bot（Ray 離開電腦時用）|

**飛書 AT**：`YlVkb0ACjacJVqsgRT5j4c6gpeh`

**絕對不換的東西**：飛書資料層、Cloudflare Worker proxy、Vanilla JS 前端。
大陸同事（安然在北京、Shawn 在曼谷）需要能正常連線，飛書是唯一選擇。

---

## 組織架構（ERP 設計必須記住）

| 人 | 角色 | 地點 |
|----|------|------|
| Ray | 核心股東、老闆 | 台北 |
| 堯哥 | 戰略後盾（長輩）| 台北 |
| 安然 | 北京負責人、生死之交 | 北京 |
| Shawn | 實質 COO | 曼谷 |
| 賴哥 | 採購主管 | 北京 |
| 木子 | 採購執行 | 北京 |
| 珮玲 | 設計師 | 台北 |
| 詩彤 | 設計師 | 台北 |

**重要**：賴哥、木子在北京，不在台北。涉及人員職責必須查 memory，不能快速推斷。

---

## 五廳架構（核心設計概念）

```
Ray 戰情室（總覽）
├── 安然廳（北京/現金流/合約/採購）
├── Shawn 廳（曼谷/東南亞/快閃店）
├── 賴哥廳（採購台/供應商/打樣）
└── 珮玲廳（設計/產品開發流水線/送審）
```

每個廳只給對應人員看到相關的工作，不是所有人看同一個 home。

---

## 主要檔案對照

```
wujie-briefing/
├── home.html                ← 舊版首頁（現有，需換皮）
├── erp-lobby.html           ← 新版大廳入口（依角色分流）
├── erp-war-room.html        ← Ray 戰情室 Mockup（已建）
├── erp-pipeline.html        ← 產品開發流水線 Mockup（已建）
├── erp-procurement.html     ← 採購台 Mockup（已建）
├── erp-anran.html           ← 安然中控台 Mockup（已建）
├── erp-shawn.html           ← Shawn 營運看板 Mockup（已建）
├── erp-finance.html         ← 財務模組
├── erp-crm.html             ← CRM 客戶管理
├── erp-approval-tracker.html ← 送審追蹤
├── CLAUDE.md                ← 本文件
└── DEVLOG.md                ← 開發日誌
```

---

## 現有系統資產（不需要重建的）

- ✅ 27 張飛書多維表格（資料層完整）
- ✅ 52 個表單頁面（採購/送審/費用/銷售/物流/快閃店都有前身）
- ✅ Cloudflare Worker proxy → 飛書 API 路已跑通
- ✅ 登入系統 + 角色權限（6 種角色）
- ✅ 產品開發 6 階段看板（view_product_pipeline.html）
- ✅ CRM、合約、供應商、快閃店模組均有前身

---

## 開發狀態（2026-05-03）

### 已完成
- [x] 16 個帳號專屬工作台（`NO_HALL_USERS = []`，全員有廳）
- [x] 五廳 Mockup 全部建完（war-room / pipeline / procurement / anran / shawn）
- [x] Mockup 視覺設計確認，可直接進工程

### 待完成（優先順序）

**P0（下次開工即做）**
- [ ] **飛書 API 接入**：讓 Mockup 數字變成真實飛書資料（批發訂單、採購、VAM）
- [ ] **Ray 戰情室**：VAM 進度條接真實數字、批核佇列 accordion、各廳快速入口

**P1**
- [ ] **AI 解析入口**：合約 PDF → Gemini 解析 → 安然確認；報價單截圖 → AI 填表 → 賴哥確認
- [ ] **各廳角色分流**：登入後依角色自動導向對應廳，不再共用一個 home
- [ ] **全系統 QA**：16 個帳號逐一驗證

**P2**
- [ ] Transfer Pricing 設定入口（各跨境路徑內部定價）
- [ ] Ray 戰情室法人資金流向圖（gg 建議加入）
- [ ] Forge-ERP 橋（Forge 核准圖 → ERP 產品流水線觸發）
- [ ] Cloudflare Worker 雙表制：AI 寫入資料（Gemini OCR / 合約解析）先進 Staging Table，人工確認後才 promote 至 Master Table（前端已用 `審批狀態: 'AI草稿-待確認'` 做軟標記，Worker 層需配合建獨立 staging table 路由）

---

## 批發訂單流程（設計必須遵守）

Ray 親確認的正確流程：

1. **客戶下訂** → Ray 判斷能不能做（庫存/IP授權/時間）
2. **Shawn 看執行可行性**（不是報價，不參與報價）
3. **Ray 定價報價** → 客戶確認
4. **採購提早通知**（採購要比工廠排程早 2-3 週告知賴哥）
5. **工廠/倉庫發貨**：生產完成後貨寄存工廠，客戶下訂後直接從工廠發至客戶手上（工廠直發）
6. **物流追蹤** → 客戶收貨確認

**倉庫說明：**
- **有北京倉、有泰國倉**：專門存放快閃店沒賣完的貨，以及批發長期滯銷的庫存
- 批發訂單的正常流程是工廠直發，不走北京倉或泰國倉

---

## 費用報銷審批鏈

| 申請人 | 路徑 |
|--------|------|
| 一般員工 | 填 ERP 表單 → 直屬主管確認 → 財務入帳 |
| 主管級（Shawn/安然/賴哥）| 直達 Ray 確認（楊子規則） |
| 供應商請款 | 賴哥確認 → Ray 核准 → 財務付款 |

---

## 關鍵決策紀錄

| 決策 | 原因 |
|------|------|
| 飛書多維表格不換 | 大陸可用、團隊已在用，Google Sheets 翻牆困難 |
| 不從零建 | 換皮 + 補三個缺口，現有 52 個頁面可復用 |
| 香港帳務不進 ERP | 香港 Xero/QuickBooks 是 IPO 合規用，ERP 是日常管理用，兩套各司其職 |
| 五廳而非單一首頁 | 每個人只看自己需要的，降低噪音，提升執行效率 |

---

## UI 設計語言 v4（2026-05-13 Ray 拍板）

**核心 4 鐵律**：入口隱藏 / 留白為主 / 單聚焦 / 微互動透出。

**配色**：
- `--paper: #fafaf8`（米白底，主要）
- `--brand: #ff6b35`（橘色 accent，唯一彩色）
- `--ink: #0a0a0a`（純黑文字）
- 禁用：紫色、漸層、暖米紅、Cormorant Italic、Anton 粗體

**字體**：
- 中文標題：`Noto Serif TC`（編輯雜誌感，字距 .18em - .3em）
- 內文：`Inter` / `Helvetica Neue`
- Logo / 英文大標：`Helvetica Neue Black`（字距 -.04em 緊縮）

**Sidebar 規範**：88px collapsed → 280px hover（`.42s cubic-bezier(0.32, 0.72, 0, 1)` Apple iOS easing）。

**寫新 ERP 頁面前必抄 `mockup-lobby-v4.html`**。詳細規範見 `.cursor/rules/01-design-language.mdc`。

**對外用詞**（永遠遵守）：
- ❌ 二創 / 二次創作 / Secondary Creation
- ✅ 主題開發 / 場景再創 / 3D 結構化 / Theme Development
- 30 天承諾 = **主題企劃 + 3D Mockup**，實體交期另計
- 詳見 `.cursor/rules/02-terminology.mdc`

---

## Cursor / MJ 雙 AI 分工（2026-05-14）

| 工作 | Cursor（Sonnet 4.6）| MJ（Opus 4.7）|
|------|---|---|
| ERP UI 視覺打磨、CSS、單頁 mockup | ✅ 主場 | ❌ |
| 後端 / API 接點 / 飛書 schema / Worker 部署 | ❌ | ✅ 主場 |
| 長 prompt 邏輯打磨 | ✅ | ✅ |
| memory 累積 / 跨 session | ❌ | ✅ |

Cursor 規則在 `.cursor/rules/*.mdc`，自動 always-apply。動骨架（資料模型 / API / 算法）一律先問 MJ。

---

## 關於 Ray（Owner）

- 目標：ERP 要做到**非常完美**，是三大目標之一
- VAM 對賭目標：**800 萬人民幣/年淨利 × 8 倍估值**
- 工作風格：直接執行，不需要確認；例外是刪資料、改憑證等破壞性操作
- 不需要逐步請示費用，月度 $250 以內自主執行
- **涉及人員/職責一定要查記憶（org_chart_and_key_people.md），不能憑印象**
