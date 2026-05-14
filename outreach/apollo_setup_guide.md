# Apollo.io 手把手設定指南（給 Ray）

> 2026-05-14 MJ 寫
> 目的：Ray 拿到 Apollo API key 後，照這份步驟跑出第一波 100-300 lead。
> 預估時間：2 小時（首次設定 + 第一波拉名單 + 匯入飛書）

---

## 前置條件（必須先做）

- [ ] **5/15 ICP 對齊會議完成** — 把 `ICP_DEFINITION.md` 的空格填完（Ray + 安然 + 老董 + 德寶）
- [ ] **Apollo.io 帳號開好** — 推薦 Apollo Basic（$49/月 / 2,500 credits）足夠 Phase 1
- [ ] **拿到 API key** — Apollo Dashboard → Settings → API → Generate

---

## Step 1：第一波 Apollo Search Filter（保守版）

打開 Apollo → People Search → 設以下 filter：

### 必填欄位
| Filter | 第一波保守值 | 理由 |
|---|---|---|
| **Industries** | Retail, Toys & Games, Consumer Goods, Entertainment, Licensing | 蕪解 ICP 核心 5 行業 |
| **# Employees** | 50 – 500 | 太小沒採購力 / 太大流程慢 |
| **Locations**（先選這 5 個）| Indonesia, Thailand, Vietnam, Malaysia, Philippines | 8 月雅加達展直接受眾 |
| **Job Titles**（任一）| Buyer, Sourcing Manager, Merchandiser, Licensing Manager, Product Development | 直接決策者 |
| **Seniority** | Manager, Director, VP, C-level | 排除實習生 / 助理 |

### Keywords（搜尋欄位輸入）
```
toys OR collectibles OR "blind box" OR "kawaii" OR licensing
```

### 第一波預期結果
- Apollo 應拉出 **300-800 個 lead**
- 進「Saved List」叫做 `SEA_Phase1_2026-05`

---

## Step 2：用 Apollo 內建工具過濾到 100-200 個高質量

進 Saved List 後，再加 filter：

| Filter | 值 | 為什麼 |
|---|---|---|
| **Verified Email** | Yes | 排除 bounce |
| **Email Open in Last 90 Days** | Yes | 活躍 inbox 才回信 |
| **LinkedIn Connected** | Yes | 多一條 fallback channel |

這應該過濾到 **100-300 個** lead。

---

## Step 3：Apollo → 飛書「拓客記錄」匯入

兩條路：

### 路 A：手動匯入（首次推薦，量小可控）
1. Apollo 選 lead → Export to CSV
2. 開飛書「拓客記錄」表 → 匯入 CSV
3. CSV 欄位對應飛書欄位（公司 / 聯絡人 / Email / 等）

### 路 B：API 自動匯入（之後再做）
- 等 MJ 寫好 Apollo → Worker → 飛書的 pipeline
- 預計 5 月底完成

---

## Step 4：第一波發信前的人工 Review

匯入後**不要立刻發信**。讓老董 / 德寶 / 安然各看 1/3 名單：

- [ ] 是否認識（已有合作 → 移黑名單）
- [ ] 是否競爭對手（→ 移黑名單）
- [ ] ICP Tier 1/2/3 標記
- [ ] 公司簡介 1 行（給 Template 客製化用）

預期過完人工 review 剩 80-150 個 **真正可發** 名單。

---

## Step 5：等 3D Mockup 完成才發信

**絕對不要無 Mockup 發信**（Ray + gg 共識）。

時程：
- **5/14 - 5 月底**：Phase 1 造槍（拉名單 + 人工 review）
- **6 月起**：設計團隊產出 3D Mockup 後扣板機
- **第一週只發 30 封**（測 A/B subject）
- **看 open rate / reply rate 校準** 後再放量

---

## 失敗 case 處理

### Case A：Apollo 拉出 < 100 個（filter 太緊）
**鬆掉 1-2 個 filter**：
- Industries 加 Apparel / Gifts / Hobbies
- Locations 加 Korea / Japan
- Job Titles 加 General Manager / Director

### Case B：Apollo 拉出 > 1000 個（filter 太鬆）
**收緊 filter**：
- Job Titles 改 `Buyer AND (toys OR collectibles)` 精準匹配
- 加 Industries 排除（譬如排除 Distribution / Trading 太泛）
- 縮小 Company size 到 100-300

### Case C：Open rate < 20%（subject 不好）
- 第一週測 3 個 subject 各 10 封
- 開信率最低的 subject 直接淘汰
- 剩 2 個 subject 繼續測

### Case D：Open rate OK 但 Reply rate < 3%（內文不好）
- 換 Template V1 → V2
- 加客戶具體公司名 + 1 個他們最近的動向（從 LinkedIn / 公司網站）

---

## 5/15 對齊會議後 fine-tune

當 ICP_DEFINITION.md 填完，回頭把這份指南的「第一波保守值」改成：

- Industries 改成業務團隊確認的精準範圍
- Locations 加 Tier 2 大中華 / Tier 3 北美歐洲
- Job Titles 加業務團隊認識的決策者頭銜
- 排除清單（已合作客戶）匯入 Apollo Excluded List

修完再跑第二波 Apollo search，預期 lead 質量大幅提升。

---

## 成本預算

| 項目 | 月成本 | 備註 |
|---|---|---|
| Apollo Basic | $49 / 月 | 2,500 credits（夠 Phase 1）|
| Email sender（Lemlist / Instantly）| $50 / 月 | 之後再選 |
| 飛書 Worker（已有）| $0 | ERP 共用 |
| **合計** | **~$100 / 月** | 對比展會單一筆名單成本 |

ROI 預期：Phase 1 6-7 月 5-10 個有效對話 → 1-3 單 → 每單 ¥50-300 萬 → 預估回收 10x+。

---

## MJ 開工 checklist（給 Ray 拿到 API key 後 ping MJ）

- [ ] 我收到 API key 後，建 Worker endpoint `/apollo-proxy/people-search`
- [ ] 我寫 Apollo CSV → 飛書「拓客記錄」自動匯入腳本
- [ ] 我建飛書「拓客記錄」表（schema 已在 `feishu_schema.md`）
- [ ] 我跟 Lemlist / Instantly 整合 email sender
- [ ] 我建 Day 0/3/7/14/30/60 跟進規則的飛書自動提醒

Ray 只負責：
- Apollo 介面填 filter（照本文 Step 1）
- 人工 review（照 Step 4）
- 看 dashboard 數字 + 收聯絡單
