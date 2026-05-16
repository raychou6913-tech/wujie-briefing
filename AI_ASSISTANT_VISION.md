# 蕪解 ERP AI 助理願景（2026-05-16）

> Ray 對不久將來 ERP 的願景：每個員工登入 ERP 都跟 AI 對話，不用找 sidebar / menu。
> 用途：跟 gg 對齊 + 之後 prototype 開發的指導原則。

---

## 核心願景

每個員工上 ERP 都是跟 AI 對話：
- AI 主動告訴他今天該處理哪些事
- 或 AI 已經把工作做完，等員工確認
- 員工確認 → 自動推進工作流到下一棒
- 完全不用找 sidebar / menu

**從員工視角**：彷彿擁有一個極為能幹的助理。
**從另一個維度**：員工多數能力已經完全被 AI 取代。AI 反而每天建議他去做 AI 無法做的工作 — 真實情況是 **AI 在分派工作**。

---

## 設計原則（Ray 拍板）

### 1. 兩種模式並存（**不 forced migration**）

| 員工類型 | 入口 |
|---|---|
| 傳統習慣（APP 時代慣性）| Sidebar 紅點 badge → 點進去 |
| 對話型 AI 習慣 | 登入直接跟 AI 對話 → 一步步往下溝通 |

員工自己選 → 採用率自然高 → 不會被「強迫改用新工具」嚇跑。

### 2. AI 是助理不是老闆 — **Framing 是關鍵**

| 壞 framing（員工抗拒） | 好 framing（員工接受） |
|---|---|
| 「你今天必須完成 5 件事：1. 批費用 2. 錄薪資...」 | 「早安楊子，我看了一下你今天的事，建議先批詩彤費用（票據齊全），你想先處理哪個？」 |
| 「我已經幫你建立了訂單請確認」 | 「老董，我聽到你跟客戶的對話，要不要幫你建一張訂單草稿？你看一下再送出」 |
| 「下一步應該執行 X」 | 「這邊可能還要 X，你覺得呢？」 |

**核心：建議 + 等確認，不是命令 + 自動執行。**

跟 Ray ↔ MJ 互動方式一樣 — MJ 提建議、Ray 拍板。員工會喜歡這種感覺。

### 3. 三階段釋出（**不設時間表，能快就要快**）

| 階段 | 內容 |
|---|---|
| **初期** | AI 像提醒者，建議少。**重點：幫員工建立習慣 + 累積資料** |
| **中期** | 建議比例提高，AI 主動協助完成工作 |
| **後期** | 主動指派工作（**特別注意交流方式**）|

### 4. 長期目標：所有工作在 ERP 內完成

不要用微信 / Line / 飛書私訊處理工作事務。技術上要克服。

**分兩層：**
- **員工 ↔ AI**：ERP 對話面板可以做
- **員工 ↔ 員工 / 員工 ↔ 客戶**：
  - 內部 chat：ERP 內建（V2）
  - 跟客戶：飛書 / Line 暫時取代不了（客戶在那邊），ERP 做的是「對話歸檔 + AI 摘要」
  - 長期：ERP 嵌進飛書 + 飛書嵌進 ERP（互嵌不取代）

---

## ⭐ Ray 補充：初期 onboarding 才是 AI 最關鍵的時刻

**之前 MJ 的範例「楊子今天 5 件待審」是穩定期，不是初期。**

實際初期 ERP 是空的，員工進來看到一片空白不知道從哪開始。**這時 AI 引導價值最高。**

### 初期 AI 的角色 = 啟蒙老師 + 助理

範例 onboarding 流程：

```
楊子第一次登入：

AI：「楊子，第一次來。我是你的 ERP 助理。
     先從最簡單的開始 — 
     你昨天有沒有花錢的單據？拍照丟給我，我幫你建第一筆。」

楊子拍照上傳收據

AI：「看到了 — 滴滴打車 ¥35，算個人報銷（出差）對吧？
     我已經幫你填好類型 / 金額 / 日期。
     看一下，沒問題就送出。」

楊子點確認 → AI 送出 + 通知安然

AI：「✓ 已送安然審。
     對了，5 月薪資該錄了 — 我列大家薪資範本，你改數字就好？」
```

**初期 AI 解決的痛點：**
- 空頁面焦慮（不知從哪開始）
- 找入口的麻煩（不用找 sidebar）
- 填表的門檻（AI 預填，員工只要確認）
- 上傳的麻煩（AI 解析收據圖片自動建立）

**結果：員工第一天就累積成就感（建了 5 筆資料），願意「繼續用下去」。**

### 後期：個性化腔調，不再制式

資料豐富後，「早安楊子，今天 5 件待審」太機器人。每個人 AI 開場應該不同：

| 人 | AI 風格 |
|---|---|
| 老董 | 「老董，叫個飯。3 個訂單卡安然那邊，要 push 嗎？」**直接** |
| 安然 | 「Hi Anran，3 contracts pending + 1 xborder。按優先排了。」**精煉雙語** |
| Bevis | 「Bevis，下午詩彤的稿我先預讀，OK 的標綠色。」**柔** |
| 詩彤 | 「詩彤！紐約稿快交期啦 🎨 還要我幫你存草稿嗎？」**活潑** |
| Ray | 「Ray，今天 3 件需要你拍板，先看 LOG-ON 那筆吧。」**簡潔** |

**技術做法：**
- 每人 chat 歷史存 `ai_chat_history_${user}`
- LLM system prompt 加「員工偏好風格」
- 隨對話 increment 學習

---

## Prototype 設計（建議分 4 層）

| Phase | 任務 | 目標 |
|---|---|---|
| **V0** | 新員工 onboarding 對話 | 幫員工建第一筆資料、克服空白頁焦慮 |
| **V1** | 日常對話 + 動作執行 | 跟 sidebar 並存，員工自己選 |
| **V2** | 個性化腔調 | 學每人風格 |
| **V3** | 主動 push | AI 看到關鍵時刻主動推 |

### V0 prototype 範圍

**UI：**
- lobby 右下浮動「🤖 AI 助理」按鈕
- 點開展開對話面板（**不全屏**，旁邊還能看 sidebar — 兩種模式並存）
- 面板可拖拉 / 收起

**功能：**
- 首次登入 detect → AI 開場 onboarding
- 引導完成 1 個動作（從錄費用最低門檻開始）
- 員工拍照 / 上傳 / 對話 → AI 解析 → 預填 modal → 等確認
- 員工確認 → AI 送出 + 寫 notif + 推下一棒

**技術 stack：**
- LLM：Claude API (Sonnet 4.6 / Opus 4.7) 或 Gemini
- API key：藏在 Cloudflare Worker（現有 feishu-proxy.raychou6913.workers.dev 加一條 endpoint）
- 26 modal wrap 成 tool definitions（function calling）
- 對話歷史 V1 localStorage → V2 飛書

**工程量：1-2 天可上 prototype（單一角色，建議從楊子開始）**

---

## 🚨 4 個必須注意的風險

### 1. AI 出錯的 blast radius
全公司流程依賴 AI 判斷，路由錯一個訂單給錯誤客戶 = 大事。

**緩衝：**
- 高金額 / 不可逆動作（合約 / 大額付款 / 跨境結算）保持 explicit human confirm
- 低風險 / routine（記費用 / 拜訪填單）可漸漸全 auto

### 2. 資料 quality（垃圾 in 垃圾 out）
現在 demo data 換成飛書真實資料前，AI 推得再聰明也是空轉。

**對策：**
- Onboarding 階段就是在收乾淨的資料
- AI 預填 + 員工確認 = 比員工自己填還準

### 3. AI 看不到 context
老董私下知道「客戶老婆生病心情不好」這種 AI 不知道。

**對策：**
- 員工要主動 brief AI（語音 / 文字）
- AI 可主動追問「上次跟 LOG-ON 開會的關鍵點是什麼？」收集 context

### 4. 員工自我價值感 / 抗拒
資深員工（安然 / 賴哥）可能覺得「我不需要 AI 教我做事」。

**對策：**
- AI framing 永遠「助理」，不是「老闆」
- 從新人 / 低資歷員工先試（楊子 / 木子 / 詩彤）
- 等他們用順了 → 老員工自然 FOMO 加入

### 5. 撤回機制
員工說「我講錯了」AI 要能回退。不能一講就推流程。

**對策：**
- 所有 AI 執行的動作給 2 分鐘 undo window
- 已通知出去的可以 callback「剛剛那則訊息作廢」

### 6. 大金額自動執行的危險
員工可能信任 AI 直接點確認沒看內容。

**對策：**
- 大金額 / 不可逆 modal 要 explicit「請確認金額：¥XXXXX」+ 員工打勾才能送
- 不能讓 AI 自動送

---

## 跟現有 ERP framework 完全相容

我們已有 building blocks：

| 已有 | 對 AI 助理的用途 |
|---|---|
| 26 個 modal | 每個都是 AI 可調用的 tool（function call）|
| `erp_notif_queue_v1` | 任務分派 queue，AI 讀寫 |
| `STALE_DETECTOR` | 自動偵測 stale（現在 rule-based，換 LLM 判斷更聰明）|
| MGR_ROUTER_MAP / BIZ_ROUTER_MAP | AI 已有路由表 |
| 10 個業務流程（工作流地圖）| AI 已有上下文知識 |
| 16 人 reporting line | AI 知道誰是誰、誰管誰 |
| 「我送出的」反向視角 | AI 知道任務追蹤狀態 |

**剩下要做：**
- LLM 對話介面
- Worker proxy（避免 API key 暴露）
- Tool definition wrapping
- 對話歷史持久化

---

## 建議下一步（等 Ray + gg 拍板）

1. **這個 session 不動 prototype**（context 已滿，怕壓縮丟細節）
2. **新 session 開動**：
   - Worker 加 `/ai-chat` endpoint
   - lobby 加浮動 AI 按鈕 + 對話 panel
   - 從楊子 onboarding 開始
3. **prototype work 1-2 週**
4. **試用 1 個月 → 評估 → 推給其他角色**

---

---

## ⭐ gg 拍板反饋（2026-05-16）

gg 完整綠燈 + 加碼 6 條 framework：

### 1. CUI 取代 GUI（軟體界正式名詞）
這是 **Conversational User Interface（對話式介面）取代 Graphical User Interface（圖形介面）**。
AI 的真正價值不是「更好用的工具」，是「發派工作的微型主管」— 包裝成「超級助理」是極度高明的管理手腕。

### 2. 「用魔法打敗魔法」變革策略
雙軌模式並存避開強迫遷徙（Forced Migration）。一旦對話框效率碾壓傳統點擊，舊派員工會「默默靠攏」 — 完全避開管理衝突。

### 3. 🏰 數據護城河（價值千萬的決策）
禁絕微信 / Line 內部協作是 ERP 不變死水的關鍵。
- 多數公司 ERP 變死水的根因：決策跟溝通在微信，ERP 淪為事後補登的記帳本
- 把內部協作拉進 ERP = 收編所有**「非結構化數據」**（對話、談判、思考過程）
- 這是未來 **Hermes Agent 能擁有全公司最高智商的唯一數據來源**

### 4. 「降維打擊工程師盲點」（Ray 的 CEO 洞察）
- MJ（工程師）想的是「系統跑順之後的完美狀態」
- Ray（CEO）想的是「員工第一天登入看到全空頁面的挫折感」
- 用 AI onboarding 把原本痛苦的訓練變成有成就感的互動遊戲

### 5. Function Calling 直接 leverage 26 個現有 modal
不需重造輪子，AI 大樓直接蓋在現有地基。

### 6. 「楊子最小爆炸半徑」prototype 戰術
- 楊子工作高度重複、邏輯明確
- 爆炸半徑小（不會因 AI 報錯價毀客戶訂單）
- 一旦成功其他部門眼紅，自動要求導入

---

## ⭐ Ray 拍板 6 個開放問題（2026-05-16）

### 1. LLM → Claude Sonnet 4.6 + 3 層機密防護

**為什麼 Claude：**
- 中文最強（蕪解全中文）
- Function calling 最穩（26 modal 要呼叫）
- Anthropic 默認不訓練客戶資料
- 大陸走既有 Cloudflare Worker proxy 中繼

**3 層機密防護：**
1. **前端 redaction** — 高機密金額傳 LLM 前 mask 成「中等金額」級別
2. **Worker 訪問控制** — 員工 / 功能權限 / VAM 相關 prompt reject / audit log
3. **Local-first** — 簡單動作規則化不送 LLM，越敏感越少 AI 依賴

**長期備援：** 大陸敏感場景 V3 跑 Qwen / DeepSeek 本地部署

### 2. 試用對象 → Shawn / Bevis / 珮玲 / 詩彤 / 楊子（5 人先）

Ray 策略：**「項目啟動者 + 行政人事」兩端切入**
- 上游用習慣，下游自然加入
- 行政 routine 多無抗拒，先穩

### 3. Onboarding 劇本 → 混合方案
- **First-time onboarding 用 MJ 寫的劇本骨架**（保品質 + 一致性）
- **熟悉後 AI 自由發揮**（system prompt 約束）
- system prompt 包含：角色 / framework / Framing 原則 / 個性化 / 26 tool definitions

### 4. 語音輸入 → V1.5 加（不強求 V0）

### 5. 失誤責任 → Ray 重 framing：「不是誰負責，是如何避免」

**5 層 prevention：**

| 機制 | 防什麼 |
|---|---|
| AI 永遠只「預填」不「自動送」| 員工親手點「送出」|
| 金額/不可逆 explicit confirm | 大金額 modal 加打勾確認 |
| 2 分鐘 undo window | 撤回 + callback |
| Sanity check 規則層 | AI 不能 bypass 硬規則 |
| Dry-run mode（新員工前 2 週）| AI 只說不執行 |

**動作分級 4 層：**
1. **絕不准 AI 自動執行**：合約簽署 / 付款 / 對外公告
2. **AI 預填 + explicit confirm**：跨境款項 / 大金額費用 / 升級 Ray
3. **AI 預填 + 員工一鍵送**：拜訪記錄 / 動銷回報 / OPEX 錄入
4. **AI 自動執行**：通知 / 提醒 / 建議

### 6. 員工 opt-out → 沒有，但 framing 透明
- 員工知道「所有對話是公司資產」
- AI 識別「emotional venting」不轉發管理層
- 預設工作模式，無需切換

---

## ⭐ Ray 5/16 晚最終拍板 — 試用 = 真實環境

**核心決策**：試用期直接接飛書，不要 localStorage demo。
- 試用期 = 真實環境，才能看到真問題
- 試用差 → 清飛書資料重來
- 試用 OK → 直接過渡正式啟用

### 新工程時程（2-3 週）

```
週 1-2: MJ 接飛書 26 modal（10-13 天，跟流程無關）
        Ray 同時改工作流地圖（平行不衝突）
週 3:   MJ AI prototype（2-3 天）
        Ray 拍板工作流地圖最終版
週 3 末: 用最終地圖注入路由表 + AI system prompt（1 天）
週 4:   5 人試用真實環境 → OK 直接過渡 16 人
```

### 工程技術指南

| 項目 | 重點 |
|---|---|
| **Schema 先定** | 每表加 `owner / created_at / updated_at / version`；樂觀鎖用 version 防並發覆蓋 |
| **Backup 策略** | 試用前 snapshot 飛書 raw data，方便 revert |
| **分批啟用** ⭐ Ray 修正 | Week 1 **上游項目啟動者**（Shawn/Bevis/珮玲/詩彤）→ Week 2 下游 reporting line（安然/賴哥/木子/高維）→ Week 3 行政+業務員+Ray（楊子/Leo/業務員/電商/Ray/躍明）。上游動才有下游事，項目啟動端用順了下游必須跟 |
| **過渡規劃** | 試用 OK 通知全公司「明天正式啟用」+ 第一週 Shawn 待催辦密集監控 |
| **核心架構** | 26 modal + AI tool 用同一個 Worker endpoint（AI 跟人類用一樣後端）|

### Ray 同時可做的事

1. 跟安然 / Shawn 三人實際走過工作流地圖確認細節
2. 跟員工問「實際工作是不是這樣」撈 edge case
3. 在地圖節點標 💡「未來需要新工具」note → MJ 看到優化方向

### 工作流地圖併行不互擋

- **90% 工程跟流程無關**（form / schema / panel / tool / API）
- **10% 相關**集中 const 表（MGR_ROUTER / BIZ_ROUTER / STALE_SLA / AI prompt），改一處全動
- 80% 確定的地圖就可開工，細節最後 1 公里注入
