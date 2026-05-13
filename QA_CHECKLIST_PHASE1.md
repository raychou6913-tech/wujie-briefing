# Phase 1 全系統 QA Checklist（16 個帳號）

> 對應第 6 輪 #23。Ray 用 16 個帳號逐一登入測試。
> 每項目對應的「期望行為」+「常見問題」我都列出來，Ray 看到不一致就回報。

---

## 共通 checklist（每個帳號都要驗）

打開 https://raychou6913-tech.github.io/wujie-briefing/login.html

### 1. 登入流程
- [ ] 輸入帳密 → 自動導向 `today.html`
- [ ] 未登入時打開 today/erp-* → 自動導回 login
- [ ] 登入 session 7 天有效

### 2. Today 頁面
- [ ] 「⌂ 大廳」「→ 進工作台」「登出」三個按鈕都看得到
- [ ] 「→ 進工作台」按鈕**自動指向角色對應廳**（見下表）
- [ ] hero 顯示「早安/午安/晚安, [你的名字]」
- [ ] 「等你做的事」如果有 todo 就 render，沒有就「✨ 沒有等你的待辦」
- [ ] todo 卡片可點，導向戰情室
- [ ] 「你的數字」「別人在等你」「你在等別人」3 個 section 都有資料或空狀態

### 3. 各角色對應的工作台

| 帳號 | 自動導向 | 主要功能驗證 |
|------|---------|------------|
| ray | erp-war-room.html | VAM hero 顯示真實數字（目前 ¥0 萬 正常）/ 法人資金流向圖 / 各廳入口 |
| anran | erp-anran.html | KPI 卡 / 合約 / 客戶 / 費用申請（FAB）|
| shawn | erp-shawn.html | 三城覆蓋率 / 預算覆蓋 / 業績達成 |
| yaoge | erp-war-room.html | 同 ray |
| laige | erp-procurement.html | 採購單列表 / **驗收登錄按鈕** / 費用申請 FAB |
| muzi | erp-procurement.html | 同 laige |
| bevis | erp-pipeline.html | 產品開發 7 階段（公仔）/ 5 階段（非公仔）|
| shetong | erp-shetong.html | 設計師工作台 / 費用申請（含請假）|
| peiling | erp-peiling.html | 設計師工作台 |
| gaowei | erp-gaowei.html | 物流 / TP 設定連結 / 費用申請 FAB |
| laodong | erp-crm.html | 「目標未拿下客戶」含 Miniso / 費用申請 FAB |
| debao | erp-crm.html | 同 laodong（看自己的客戶）|
| yangzi | erp-yangzi.html | OPEX 維護 / 費用申請（含 HR）|
| leo | erp-leo.html | 銀行帳戶餘額 / 付款佇列 |
| yueming | erp-finance.html | 匯率表 / 跨境匯款 / TP 設定連結 |

### 4. 費用申請強制 link 項目（每個有 FAB 的廳都驗）
- [ ] 點 💰 FAB 開 modal
- [ ] 第一欄看到「對應項目 *」必填下拉
- [ ] 下拉自動載入飛書「項目排期」active 項目（按 IP 分組）
- [ ] 沒選項目按送出 → alert「請選擇對應項目」
- [ ] 選了 + 填完按送出 → 飛書「審批記錄」會多一筆，帶「對應項目」+「對應項目ID」

### 5. 新項目註冊（任何登入者都能用）
- [ ] 從 lobby「+ 新增項目」進入 erp-project-new.html
- [ ] Step 1 IP 下拉載入 5 個簽約 IP（從飛書 IP 庫拉）
- [ ] 選 IP 後顯示「📋 從合約自動帶入」資訊
- [ ] 「+ 探索中 IP」可自填名稱
- [ ] Step 2 幣別 onChange 自動帶匯率
- [ ] 「套用今日預設」按鈕可重置匯率
- [ ] 預計收入/支出 → RMB 換算自動算出
- [ ] Step 3 摘要 review 正確
- [ ] 送出後狀態 = 「待 Ray 確認」（飛書「項目排期」可查）

### 6. 戰情室（Ray / Shawn / 安然 / 躍明 看得到）
- [ ] VAM hero 顯示飛書算的真實淨利
- [ ] 待批核佇列載入飛書 approval（待審批狀態）
- [ ] Ray 點「✓ 批准」會寫飛書
- [ ] **從 today 點 todo 進來會 scroll + 高亮對應 row**
- [ ] 法人資金流向圖（HK JV / 4 子體）顯示正常
- [ ] 各廳快速入口含 TP 設定 + IP Vault 兩個新卡

### 7. 預算規劃器（從戰情室快速入口進入）
- [ ] **頂部「📊 飛書事件流」strip 顯示真實 count**
- [ ] 每個產品 row 顯示階段徽章（V1/V2/V3）
- [ ] V1 階段渠道配貨鎖定，顯示「等客戶確認後再進入 V2」
- [ ] 點「✓ 客戶已確認 → 進入 V2」會解鎖
- [ ] 新增產品 modal 加 SRP 欄位
- [ ] 「儲存」按鈕 → 寫進 localStorage erp_budget_prods_v1

### 8. IP Vault / Onboarding（可從戰情室進入）
- [ ] erp-ip-vault.html 顯示 5 個真實 IP（從飛書 IP 庫拉）
- [ ] erp-ip-onboarding.html 顯示 5 個 IP × 10 項 checklist
- [ ] 打勾後本機暫存進度條更新

---

## 已知會看到「真實的空狀態」（不是 bug）

- 戰情室 VAM hero 顯示 **¥0 萬 / 0%** — 因為剛清完 demo data，飛書「預算管理」實際金額還沒入帳
- today 大部分角色看到「✨ 沒有等你的事」— 剛清完 demo，沒人送過審批
- 採購單列表「無進行中採購」— 剛清完
- CRM 「上市後銷售反饋」表格為空

**這些是「乾淨 baseline」的真實狀態**，等 Ray 跟 Shawn 開始用：
1. 建項目 → 飛書「項目排期」開始有資料
2. 送費用申請 → 「審批記錄」開始累積
3. Ray 在戰情室批 → 數字流動起來

ERP 「活」起來預估 1-2 週（看跑多少筆真實業務）。

---

## 回報模板

如果發現問題，告訴 MJ 用這個格式：

```
帳號：[ray / anran / ...]
頁面：[today / erp-war-room / ...]
問題：
- 期望：[期望看到什麼]
- 實際：[實際看到什麼]
截圖：[貼或描述]
```

我會逐項排查、commit fix。
