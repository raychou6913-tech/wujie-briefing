# DEBUG_REPORT — Loop 自動工作（2026-05-14 凌晨）

Loop input：`/loop 今晚自動跑完 10 條任務 + BKK 範圍`

每完成 1-2 task 立刻 commit + push（合計 6 個 commit）。

---

## ✅ 完成（9 / 10 + 5 / 5 BKK）

### Phase 1 Debug

**[1] 靜態 HTML 健康檢查** ✅
- 全 erp-*/bkk-* 找 `undefined` / `NaN` / `[object Object]` 殘留
- 所有 `undefined` 都是合法 pattern（Feishu 寫入前 `delete fields[k] if undefined`）
- 沒有 unclosed tag / inline error pattern

**[2] 連結完整性** ✅
- 全 `<a href>` + `location.href` + `location.replace` target 都解析到實存檔案
- 涵蓋：erp-lobby, erp-pipeline, erp-war-room, erp-finance, erp-budget-planner, erp-anran, erp-shawn, erp-procurement, erp-transfer-pricing, erp-gaowei, erp-crm, erp-approval-tracker, erp-ip-vault, erp-ip-onboarding, erp-project-new, erp-library, today, login, bkk-* (全)

**[3] 飛書 schema 文件對齊** ⚠️ 找到 3 個落差
- `erp-war-room.html:1263` `popup_stores:"tblPopupStores2026"` — **placeholder ID**，非真實飛書 tbl ID
- `erp-ip-vault.html:371` `ip_masters:'tblIPMastersPlaceholder'` — **placeholder ID**
- `erp-procurement.html:1371` `tblmsXyVnBqdHC3V`（驗收紀錄）— 真實 ID 但**未列在 feishu_table_map.md memory 中**（只在 .cursor/rules/03 出現）
- 建議：建一張真實的 popup_stores 表 + IP masters 表（或改接到 tblPLJ2dLkdkWUAa 項目排期 / tblt9DOm4hf5Mr5r IP 資料庫），並補進 schema map memory

**[4] 殘留 demo / TODO / placeholder grep** ✅
- 全 *.html 找 `TODO|FIXME|XXX|HACK|placeholder|Lorem|Foo Bar`
- 所有 hit 都是合法 placeholder 屬性（input/textarea 的 `placeholder="例：..."`）
- 沒有 TODO / FIXME 待辦遺漏

**[5] User journey 靜態驗證** — 留待下輪（時間不足）

### Phase 2 產出

**[6] mockup-ask-ai.html** ✅ — Ask AI 助理 Layer 1 PoC
- 規則匹配 + 模糊比對（18 個入口 keyword 庫）
- 對話氣泡 UI（你/AI 兩種樣式）
- 8 個範例 chip
- v4 配色：米白底 / 橘色 accent / Helvetica + Noto Serif
- commit `04fb2c5`

**[7] erp-snippet-v4.html** ✅ — v4 共用 boilerplate
- CSS variables + sidebar (88→280px hover) + topbar + 漸進揭露 block
- 內嵌註解：複製本檔 → 改 .sb-item active + 內容區
- commit `c6bc7c6`

**[8] CLAUDE.md UI 段落** ✅ — 加「UI 設計語言 v4」+「Cursor/MJ 雙 AI 分工」兩段
- 配色 / 字體 / Sidebar 規範 / 對外用詞禁忌全部摘要
- 指向 .cursor/rules/01 + 02 完整版
- commit `be800d9`

**[9] MEMORY.md 索引重排** ✅ — 從時間序改成分類序
- 12 個分類：Workflow / Active Work / Org / IP / Financial / Business / ERP Arch / BKK / 問卷 / Ray SOP / 糾正集 / Session 存檔
- 71 條 memory 全保留

**[10] DEBUG_REPORT** ✅ — 本檔

### BKK 範圍（5/5 全完成）

**[A] BKK 中文洩漏修復** ✅ — commit `81d5a7d` + `606b4c7`
- `大廳` → `Lobby`（5 處 chip / topbar 連結）
- `Shawn`（UI 文字）→ `區域負責人`（4 處）
- `有你共創` → `上海總倉` / `原廠`（4 處）
- `Ray`（UI 文字）→ `總部`（1 處）
- 保留 `bkk-hub.html:463 '審批人': 'Shawn'`（後端資料路由，不出 UI）

**[B] localStorage 隔離** ✅
- 全 `bkk-*.html` 統一用 `bkk_sess`
- 全 `erp-*.html` 統一用 `erp_sess`
- 零交叉污染

**[C] BKK topbar 一致性** ✅
- 5 個 bkk-* 都用 `.hall-chip` / `.lobby-chip` 同設計
- chip 文字：Lobby（lobby）/ 倉庫管理 / 送審追蹤 / 營運中心 / 快閃店流水線
- 中文 chip 文字皆為通用名詞，不含 wujie 內部 references

**[D] BKK 7 階段 popup pipeline** ✅
- `bkk-popup.html:244` `STAGE_NAMES` 7 項正確：提案 → 場地確認 → 產品設計 → 場地裝修送審 → 宣傳物送審 → 營業中 → 撤店覆盤
- 4 個 demo popup 涵蓋各階段（Mofusand 營業中 / Opanchu×Snoopy 裝修送審 / JJK 提案中 / Muziktiger Q4 場地洽談）

**[E] BKK 飛書寫入路徑** ✅
- `bkk-hub.html:419 const APPROVAL_TBL = 'tbl4OBNvsNkqS4mQ'` 正確指向審批記錄主表
- 不會跑去寫錯表

---

## 留給 Ray 看的決策點

### A. Placeholder Table ID（建議下次 Ray 醒來處理）

兩處 hardcoded placeholder：
- `erp-war-room.html:1263 popup_stores: "tblPopupStores2026"`
- `erp-ip-vault.html:371 ip_masters: 'tblIPMastersPlaceholder'`

**選項**：
1. 建真實的「快閃店」表 + 「IP 版權方」表（schema 設計給 MJ）
2. 改接到既有表（popup → 項目排期過濾 type=popup；ip_masters → IP 版權資料庫 tblt9DOm4hf5Mr5r）
3. 暫時拿掉相關功能直到表建好

### B. BKK 文案保留 vs 改

我把 user-facing 中文洩漏全改了，但 bkk-warehouse 的「上海總倉」「原廠」可能還是太露骨。Ray 要不要再淡化成「廠商 / 物流接收方」更虛？

### C. CLAUDE.md 是否要再加段

加了 v4 設計語言 + Cursor/MJ 分工。考慮是否再加：
- 4 AI 引擎 Phase 順序（拓客 / 供應鏈 / 趨勢 / 數位櫥窗）
- 5 個 IP 一頁速查表

---

## Loop 紀律自評（vs 5/13 教訓）

5/13 失敗：Playwright + 複合 Bash → permission 牆 → 整夜 0 進度
5/14 修正：
- ✅ 第一動 ScheduleWakeup（safety net 永遠先排）
- ✅ 全用 Grep / Read / Write / Edit / Glob / 簡單 git
- ✅ 每完成 1-2 task 重排 wakeup
- ✅ 卡的方向（schema API 健康檢查）改靜態文件比對
- ✅ 每完成立刻 commit + push（避免一直記在 working tree）

commit 軌跡：
- `81d5a7d` bkk: 移除 user-facing 中文洩漏（大廳/Shawn）
- `606b4c7` bkk-warehouse: 移除 有你共創 → 上海總倉/原廠
- `be800d9` docs: CLAUDE.md 加 UI 設計語言 v4 + Cursor/MJ 分工
- `c6bc7c6` add erp-snippet-v4.html v4 boilerplate
- `04fb2c5` add mockup-ask-ai.html Ask AI Layer 1 PoC
- （DEBUG_REPORT 本檔 + MEMORY.md reorg 即將 commit）

---

## 還沒做的

- **Task 5** User journey 靜態驗證（時間不足）
- **Task 3 跟進**：補 placeholder table ID 到真實 schema、補 tblmsXyVnBqdHC3V 進 memory

下輪 loop 可以做 Task 5，或 Ray 醒來時看這份 report 決定優先級。
