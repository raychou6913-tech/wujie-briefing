# 飛書 Base Schema 完整快照（2026-05-09 重整後）

**Master Base AT:** `Sg7ObNELHaAdZzshGIFjWPVhpce`  
**Worker Proxy:** `https://feishu-proxy.raychou6913.workers.dev`  
**表格數:** 32

---

## 目錄

- [項目排期](#項目排期) · `tblPLJ2dLkdkWUAa`
- [現金流追蹤](#現金流追蹤) · `tblN0AwYtb2IvOcq`
- [預算管理](#預算管理) · `tblmlUoyZ6Bip6S3`
- [銷售進度](#銷售進度) · `tblndRlEjmOgh5lk`
- [設計送審](#設計送審) · `tblSgCcB2aFcsPaw`
- [採購詢比價](#採購詢比價) · `tblnebGJduwUrBoz`
- [庫存物流](#庫存物流) · `tblR6pW8BsGhSmAe`
- [合約管理](#合約管理) · `tblWn4PwOVRgt7c1`
- [審批記錄](#審批記錄) · `tbl4OBNvsNkqS4mQ`
- [產品明細](#產品明細) · `tblc9Vs1zbHmtLpr`
- [IP版權資料庫](#IP版權資料庫) · `tblt9DOm4hf5Mr5r`
- [採購供應商](#採購供應商) · `tblwsHBor9fN7jXz`
- [客戶名單](#客戶名單) · `tbl9HpW9Wc6kDOwu`
- [設計外包](#設計外包) · `tblxRlK0ykNifcaE`
- [物流貨代報關](#物流貨代報關) · `tblbBJ31JSQ6Soj1`
- [登入記錄](#登入記錄) · `tblzMnFpbIWE90XX`
- [每日銷售快報](#每日銷售快報) · `tblq9KZowawQ647J`
- [場地資訊](#場地資訊) · `tblE3cNSvvjhfPoy`
- [寄售管理](#寄售管理) · `tblJBz0k1BkdhdEz`
- [使用紀錄](#使用紀錄) · `tblhDeLvRQn82mQM`
- [公告板](#公告板) · `tblTN9dSCixUkxBb`
- [使用回報](#使用回報) · `tblHadqJd7zjqZai`
- [會議記錄](#會議記錄) · `tblnxPaPOym2hcZ7`
- [快閃店場地資料庫](#快閃店場地資料庫) · `tblIxWRC63J4lYcn`
- [市場情報日報](#市場情報日報) · `tblHQEQlsg4Y4IAh`
- [費用實報](#費用實報) · `tblvGsQpXPHtkp1C`
- [跟進紀錄](#跟進紀錄) · `tblwBXbz6CIckp6e`
- [角色設定](#角色設定) · `tblRA30fK5KaPmhv`
- [產品開發流程](#產品開發流程) · `tblTqAZIdt2ViAma`
- [IP_Studio_Assets](#IP_Studio_Assets) · `tblvJN5felUa2h2F`
- [IP_Studio_Themes](#IP_Studio_Themes) · `tbl4v8VBwg3Qfvau`
- [合約_AI草稿](#合約_AI草稿) · `tblApO2OHiXhXAd5`

---

## 項目排期

**Table ID:** `tblPLJ2dLkdkWUAa` · **欄位數:** 43

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 文本 | Text | — |
| 2 | 单选 | SingleSelect | — |
| 3 | 日期 | DateTime | format: yyyy/MM/dd |
| 4 | 附件 | Attachment | — |
| 5 | 項目名稱 | Text | — |
| 6 | 類別 | SingleSelect | 商品批發 / 快閃店 / 其他 / IP商品授權 |
| 7 | 負責人 | Text | — |
| 8 | 所在地 | SingleSelect | 台北 / 北京 / 曼谷 / 跨地區 |
| 9 | 開始日期 | DateTime | format: yyyy/MM/dd |
| 10 | 截止日期 | DateTime | format: yyyy/MM/dd |
| 11 | 狀態 | SingleSelect | 計劃中 / 進行中 / 已延遲 / 已完成 / 已取消 / 執行中 / 籌備中 |
| 12 | 完成進度% | Number | — |
| 13 | 備註 | Text | — |
| 14 | IP品牌 | SingleSelect | Snoopy / Mofusand / Chiikawa / Labubu / Fuggler / EVE點點 / 其他 / Miffy / 饭团和梅子 / 大力水手 Popeye【測試】 / 【測試】大力水手 Popeye / 加菲貓 / LINE FRIENDS / 小熊維尼 / BT21 / Kuromi |
| 15 | 業務類型 | SingleSelect | 批發 / 快閃店 / 代工 / 設計服務 / 授權 / 其他 / 快閃店零售 / 商品開發 |
| 16 | 預計收入 | Number | — |
| 17 | 預計支出 | Number | — |
| 18 | 預計淨利 | Number | — |
| 19 | 幣別 | SingleSelect | TWD / CNY / THB / USD |
| 20 | 實際收入 | Number | — |
| 21 | 實際支出 | Number | — |
| 22 | 產品類別 | MultiSelect | 公仔 / 絨毛玩偶 / 3C配件 / 文具周邊 / 服飾配件 / 家品 / 食品 / 其他 / 文具 / 生活雜貨 / 公仔盲盒 / 绒毛挂件 / 冰箱贴 |
| 23 | 規格尺寸說明 | Text | — |
| 24 | 版權對接人 | Text | — |
| 25 | 版權方 | Text | — |
| 26 | 簽約狀態 | SingleSelect | 洽談中 / 已簽署 / 待續約/待轉讓 / 已到期 / 已終止 / 執行中 / 已簽約 / 生效中 |
| 27 | 授權地區範圍 | Text | — |
| 28 | 保底金額 | Number | — |
| 29 | 權利金_零售% | Number | — |
| 30 | 權利金_批發% | Number | — |
| 31 | 授權開始日 | DateTime | format: yyyy/MM/dd |
| 32 | 授權結束日 | DateTime | format: yyyy/MM/dd |
| 33 | 當前關卡 | SingleSelect | IP決策中 / 預算規劃 / 概念提案 / 跨部門確認 / 設計送審 / 採購詢價 / 預算確認 / 打樣/開模 / 市場收單 / 大貨生產 / 出貨物流 / 銷售推廣 / 已完成 / 已暫停 |
| 34 | 快閃店主題 | Text | — |
| 35 | IP快閃店現狀 | Text | — |
| 36 | 投資結構 | SingleSelect | 獨資 / 合資 / 代運營 |
| 37 | 商品組成方式 | MultiSelect | 全自主開發 / 授權商提供 / 合資開發 / 外採現貨 / 混合 |
| 38 | IP商品開發方 | Text | — |
| 39 | 贊助收入預估 | Number | — |
| 40 | 合資方 | Text | — |
| 41 | 出資比例說明 | Text | — |
| 42 | 代運營費結構 | Text | — |
| 43 | 合約名稱 | Text | — |

---

## 現金流追蹤

**Table ID:** `tblN0AwYtb2IvOcq` · **欄位數:** 16

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 標題 | Text | — |
| 2 | 辦公室 | SingleSelect | 台北 / 北京 / 曼谷 |
| 3 | 日期 | DateTime | format: yyyy/MM/dd |
| 4 | 幣別 | SingleSelect | TWD / CNY / THB / USD |
| 5 | 期初餘額 | Number | — |
| 6 | 本期收入 | Number | — |
| 7 | 本期支出 | Number | — |
| 8 | 期末餘額 | Number | — |
| 9 | 收入明細 | Text | — |
| 10 | 支出明細 | Text | — |
| 11 | 預計下月支出 | Number | — |
| 12 | 可用天數估算 | Number | — |
| 13 | 填報人 | Text | — |
| 14 | 所屬公司 | SingleSelect | 北京蕪解 / 台灣悍草 / UJ BKK / 香港JV / 深圳子公司 / 香港蕪解 / 深圳蕪解 |
| 15 | 應收帳款 | Number | — |
| 16 | 應付帳款 | Number | — |

---

## 預算管理

**Table ID:** `tblmlUoyZ6Bip6S3` · **欄位數:** 27

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 標題 | Text | — |
| 2 | 預算名稱 | Text | — |
| 3 | 類別 | SingleSelect | 採購 / 行銷 / 運營 / 人事 / 差旅 / 其他 / 展場 / 開發費用 / 生產製造 / 物流 / 版權費用 / 倉儲 / 批發收入 / 零售收入 |
| 4 | 團隊辦公地 | SingleSelect | 台北 / 北京 / 曼谷 / 香港 / 深圳 |
| 5 | 幣別 | SingleSelect | TWD / CNY / THB / USD |
| 6 | 年度 | Number | — |
| 7 | 季度 | SingleSelect | Q1 / Q2 / Q3 / Q4 / 全年 |
| 8 | 預算金額 | Number | — |
| 9 | 已使用金額 | Number | — |
| 10 | 剩餘預算 | Number | — |
| 11 | 執行率% | Number | — |
| 12 | 備註 | Text | — |
| 13 | 預算性質 | SingleSelect | 收入 / 支出 / 資本支出 / 費用 / 固定成本 / 一次性 / 版稅支出 |
| 14 | 批次 | SingleSelect | 第一批 / 追加批-1 / 追加批-2 / 追加批-3 / 開發期（一次性） |
| 15 | 單價 | Number | — |
| 16 | 數量 | Number | — |
| 17 | 月份 | Number | — |
| 18 | 預算科目 | SingleSelect | 收入目標 / 毛利目標 / 淨利目標 / 費用預算 / 採購預算 / 人工成本 / 版稅支出 / 採購成本 |
| 19 | 負責人 | Text | — |
| 20 | 實際金額 | Number | — |
| 21 | 達成率% | Number | — |
| 22 | 歸屬主體 | SingleSelect | 香港JV / 深圳子公司 / 北京蕪解 / 台灣悍草 / UJ BKK |
| 23 | 計價幣別 | SingleSelect | RMB / HKD / USD / TWD / THB |
| 24 | 合作模式 | SingleSelect | 供應鏈發包 / 批發包銷 / 快閃店代運營 / 共同投資 / 台灣代運營 |
| 25 | 審批狀態 | SingleSelect | 草稿 / 待審批 / 已核准 / 已駁回 |
| 26 | 審批人 | Text | — |
| 27 | 審批日期 | DateTime | format: yyyy/MM/dd |

---

## 銷售進度

**Table ID:** `tblndRlEjmOgh5lk` · **欄位數:** 28

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 標題 | Text | — |
| 2 | 客戶名稱 | Text | — |
| 3 | 產品/項目 | Text | — |
| 4 | IP品牌 | SingleSelect | Snoopy / Mofusand / Chiikawa / Labubu / Fuggler / 其他 / Miffy / 加菲貓 / LINE FRIENDS / 小熊維尼 / 吉依卡哇 / Muziktiger / 飯糰與梅子 / Opanchu |
| 5 | 所在地 | SingleSelect | 台北 / 北京 / 曼谷 / 歐洲 / 北美 / 其他 / 台灣 / 泰國 / 中國大陸 |
| 6 | 數量 | Number | — |
| 7 | 單價 | Number | — |
| 8 | 總金額 | Number | — |
| 9 | 幣別 | SingleSelect | TWD / CNY / THB / USD / EUR |
| 10 | 帳期 | SingleSelect | 預付 / Net30 / Net60 / Net90 / 其他 / 60天 / 即期 / 30天 / 月結30天 / 月結45天 / T/T 30天 / 月結60天 |
| 11 | 訂單狀態 | SingleSelect | 洽談中 / 已下單 / 備貨中 / 已出貨 / 已收款 / 已取消 / 訂單確認 / 已確認 / 生產中 / 詢價中 / 已完成 / 履行中 / 待出貨 / 待確認 / 確認中 |
| 12 | 預計交貨日 | DateTime | format: yyyy/MM/dd |
| 13 | 負責業務 | Text | — |
| 14 | 備註 | Text | — |
| 15 | 批發折扣 | Text | — |
| 16 | 客戶銀行帳戶 | Text | — |
| 17 | 收款狀態 | SingleSelect | 未收款 / 訂金已收 / 全款已收 / 尾款未到 |
| 18 | 訂金金額 | Number | — |
| 19 | 訂金收款日期 | DateTime | format: yyyy/MM/dd |
| 20 | 尾款金額 | Number | — |
| 21 | 尾款收款日期 | DateTime | format: yyyy/MM/dd |
| 22 | 物流單號 | Text | — |
| 23 | 出貨日期 | DateTime | format: yyyy/MM/dd |
| 24 | 庫存狀態 | SingleSelect | 現貨充足 / 需採購 / 已通知採購 |
| 25 | 採購通知已送出 | SingleSelect | 否 / 是 |
| 26 | 歸屬主體 | SingleSelect | 香港JV / 深圳子公司 / 北京蕪解 / 台灣悍草 / UJ BKK |
| 27 | 計價幣別 | SingleSelect | RMB / HKD / USD / TWD / THB |
| 28 | 合作模式 | SingleSelect | 供應鏈發包 / 批發包銷 / 快閃店代運營 / 共同投資 / 台灣代運營 |

---

## 設計送審

**Table ID:** `tblSgCcB2aFcsPaw` · **欄位數:** 21

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 標題 | Text | — |
| 2 | 設計名稱 | Text | — |
| 3 | 項目關聯 | Text | — |
| 4 | IP品牌 | SingleSelect | Snoopy / Mofusand / Chiikawa / Labubu / Fuggler / 其他 / 加菲貓 / LINE FRIENDS / Kuromi |
| 5 | 設計類型 | SingleSelect | 包裝設計 / 商品設計 / 行銷物料 / 展場設計 / 其他 |
| 6 | 設計師/供應商 | Text | — |
| 7 | 提交日期 | DateTime | format: yyyy/MM/dd |
| 8 | 審核方 | Text | — |
| 9 | 審核狀態 | SingleSelect | 待提交 / 已提交 / 修改中 / 已通過 / 已拒絕 / 待審核 |
| 10 | 預計通過日 | DateTime | format: yyyy/MM/dd |
| 11 | 版本號 | Text | — |
| 12 | 修改備註 | Text | — |
| 13 | 送審階段 | SingleSelect | 2D設計 / 四視圖 / 3D建模 / 打樣送審 / 包裝設計 / 包裝送審 / 展架設計 / 展架送審 / 大貨樣送審 / 線稿/草圖 / 彩稿/配色 / 打樣確認 / 成品確認 / 行銷物料 |
| 14 | 是否外包 | SingleSelect | 是 / 否 / 外包（已拍板） |
| 15 | 填報人 | Text | — |
| 16 | 設計圖附件 | Attachment | — |
| 17 | 送審輪次 | Number | — |
| 18 | 送審類型 | SingleSelect | 方向確認 / 2D四視圖 / 3D電腦模型 / 素模打樣 / 上色打樣 / 大貨樣 |
| 19 | 版權方回覆日期 | DateTime | format: yyyy/MM/dd |
| 20 | 版權方回覆意見 | Text | — |
| 21 | 修改完成日期 | DateTime | format: yyyy/MM/dd |

---

## 採購詢比價

**Table ID:** `tblnebGJduwUrBoz` · **欄位數:** 28

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 標題 | Text | — |
| 2 | 採購品項 | Text | — |
| 3 | 項目關聯 | Text | — |
| 4 | 規格說明 | Text | — |
| 5 | 採購數量 | Number | — |
| 6 | 供應商A | Text | — |
| 7 | A報價 | Number | — |
| 8 | 供應商B | Text | — |
| 9 | B報價 | Number | — |
| 10 | 供應商C | Text | — |
| 11 | C報價 | Number | — |
| 12 | 議定價格 | Number | — |
| 13 | 幣別 | SingleSelect | TWD / CNY / THB / USD / RMB / 人民幣 |
| 14 | 採購狀態 | SingleSelect | 詢價中 / 比價中 / 議價中 / 已確認 / 已下單 / 已收貨 / 已取消 / 比價完成 / 到貨中 / 已到貨 / 已選定供應商 / 待確認 / 已完成 / 生產中 / 確認中 / 詢比價中 |
| 15 | 負責人 | Text | — |
| 16 | 預計到貨日 | DateTime | format: yyyy/MM/dd |
| 17 | 備註 | Text | — |
| 18 | 採購類型 | SingleSelect | 大貨 / 模具 / 打樣 / 工廠生產 / 快閃商品 |
| 19 | MOQ | Number | — |
| 20 | 交期_工作天 | Number | — |
| 21 | 付款條件 | Text | — |
| 22 | 打樣費 | Number | — |
| 23 | 打樣寄出日期 | DateTime | format: yyyy/MM/dd |
| 24 | 寄樣快遞單號 | Text | — |
| 25 | AI解析來源 | SingleSelect | 手動填入 / AI解析 / 手動 |
| 26 | 歸屬主體 | SingleSelect | 香港JV / 深圳子公司 / 北京蕪解 / 台灣悍草 / UJ BKK |
| 27 | 計價幣別 | SingleSelect | RMB / HKD / USD / TWD / THB / 人民幣 |
| 28 | 合作模式 | SingleSelect | 供應鏈發包 / 批發包銷 / 快閃店代運營 / 共同投資 / 台灣代運營 / ODM / OEM |

---

## 庫存物流

**Table ID:** `tblR6pW8BsGhSmAe` · **欄位數:** 15

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 標題 | Text | — |
| 2 | 品項名稱 | Text | — |
| 3 | IP品牌 | SingleSelect | Snoopy / Mofusand / Chiikawa / Labubu / Fuggler / 其他 / Miffy |
| 4 | SKU編號 | Text | — |
| 5 | 所在倉庫 | SingleSelect | 台北倉 / 北京倉 / 曼谷倉 / 在途 / 客戶倉 |
| 6 | 現有庫存 | Number | — |
| 7 | 安全庫存 | Number | — |
| 8 | 單位 | SingleSelect | 件 / 箱 / 套 / 個 |
| 9 | 出貨對象 | Text | — |
| 10 | 物流單號 | Text | — |
| 11 | 物流狀態 | SingleSelect | 待提貨 / 提貨中 / 已出倉 / 海關中 / 已到貨 / 異常 / 備貨中 / 在庫 |
| 12 | 報關狀態 | SingleSelect | 未報關 / 報關中 / 已放行 / 扣押中 / 不需報關 / 已完成 / 清關中 / 待報關 / 已清關 |
| 13 | 預計到達日 | DateTime | format: yyyy/MM/dd |
| 14 | 負責人 | Text | — |
| 15 | 備註 | Text | — |

---

## 合約管理

**Table ID:** `tblWn4PwOVRgt7c1` · **欄位數:** 39

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 標題 | Text | — |
| 2 | 合約名稱 | Text | — |
| 3 | 合約類型 | SingleSelect | IP授權合約 / 採購合約 / 銷售合約 / 合資合約 / 保密合約 / 其他 |
| 4 | 甲方 | Text | — |
| 5 | 乙方 | Text | — |
| 6 | 簽約日期 | DateTime | format: yyyy/MM/dd |
| 7 | 到期日期 | DateTime | format: yyyy/MM/dd |
| 8 | 合約金額 | Number | — |
| 9 | 幣別 | SingleSelect | TWD / CNY / THB / USD |
| 10 | 合約狀態 | SingleSelect | 草稿 / 審核中 / 生效中 / 續約洽談中 / 已續約 / 即將到期 / 已到期 / 已終止 |
| 11 | 重點摘要 | Text | — |
| 12 | 注意事項 | Text | — |
| 13 | 存放位置 | Text | — |
| 14 | 負責人 | Text | — |
| 15 | 對方公司 | Text | — |
| 16 | 我方簽署人 | SingleSelect | Ray / 安然 / Shawn / 躍明 / 賴哥 / Bevis |
| 17 | 對方聯絡人 | Text | — |
| 18 | 簽署日期 | DateTime | format: yyyy/MM/dd |
| 19 | 主要條款摘要 | Text | — |
| 20 | 特殊條款 | Text | — |
| 21 | IP品牌 | Text | — |
| 22 | 版權方 | Text | — |
| 23 | 授權品類 | Text | — |
| 24 | 授權地區 | Text | — |
| 25 | MG_總保底 | Number | — |
| 26 | 授權金_零售% | Number | — |
| 27 | 授權金_批發% | Number | — |
| 28 | 批發折數 | Number | — |
| 29 | 一次性授權費 | Number | — |
| 30 | 版權代理商 | Text | — |
| 31 | 合約文件 | Attachment | — |
| 32 | 歸屬主體 | SingleSelect | 香港JV / 深圳子公司 / 北京蕪解 / 台灣悍草 / UJ BKK |
| 33 | 計價幣別 | SingleSelect | RMB / HKD / USD / TWD / THB / 人民幣 / 美元 |
| 34 | 合作模式 | SingleSelect | 供應鏈發包 / 批發包銷 / 快閃店代運營 / 共同投資 / 台灣代運營 |
| 35 | MG_累積已攤提 | Number | — |
| 36 | MG_未攤提餘額 | Number | — |
| 37 | MG_攤提進度% | Number | — |
| 38 | AI解析狀態 | SingleSelect | 未解析 / 解析中 / 草稿待確認 / 已確認 / 已駁回 |
| 39 | AI解析時間 | DateTime | format: yyyy/MM/dd HH:mm |

---

## 審批記錄

**Table ID:** `tbl4OBNvsNkqS4mQ` · **欄位數:** 16

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 標題 | Text | — |
| 2 | 審批標題 | Text | — |
| 3 | 審批類型 | SingleSelect | 採購審批 / 支出審批 / 合約審批 / 折扣審批 / 其他 / 費用申請 / 新增供應商申請 / 新增項目申請 |
| 4 | 申請人 | Text | — |
| 5 | 申請日期 | DateTime | format: yyyy/MM/dd |
| 6 | 申請說明 | Text | — |
| 7 | 金額 | Number | — |
| 8 | 幣別 | SingleSelect | TWD / CNY / THB / USD / RMB |
| 9 | 審批人 | SingleSelect | Ray / Shawn / 安然 / 安然、躍明 |
| 10 | 審批狀態 | SingleSelect | 待審批 / 審批中 / 已通過 / 已拒絕 / 需補件 |
| 11 | 審批意見 | Text | — |
| 12 | 審批日期 | DateTime | format: yyyy/MM/dd |
| 13 | Email已發送 | Text | — |
| 14 | Email通知時間 | Text | — |
| 15 | Shawn複核 | SingleSelect | 待複核 / 已複核 / 通過 |
| 16 | 預算科目 | Text | — |

---

## 產品明細

**Table ID:** `tblc9Vs1zbHmtLpr` · **欄位數:** 19

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 產品名稱 | Text | — |
| 2 | 項目關聯 | Text | — |
| 3 | IP品牌 | SingleSelect | Snoopy / Mofusand / Chiikawa / Labubu / Fuggler / EVE點點 / 其他 / 加菲貓 / LINE FRIENDS / Kuromi |
| 4 | 產品類別 | SingleSelect | 公仔 / 絨毛玩偶 / 3C配件 / 文具周邊 / 服飾配件 / 家品 / 食品 / 其他 / 生活雜貨 |
| 5 | 主題/款式 | Text | — |
| 6 | 規格尺寸 | Text | — |
| 7 | 材質 | Text | — |
| 8 | SKU編號 | Text | — |
| 9 | 目標批發價 | Number | — |
| 10 | 目標零售價 | Number | — |
| 11 | 幣別 | SingleSelect | TWD / CNY / THB / USD |
| 12 | 目標生產量 | Number | — |
| 13 | 開發狀態 | SingleSelect | 概念討論 / 設計中 / 送審中 / 打樣中 / 修改中 / 已確認 / 生產中 / 已完成 / 已取消 / 設計送審中 |
| 14 | 銷售狀態 | SingleSelect | 未開售 / 預售中 / 銷售中 / 已售罄 / 已停售 / 預接單 |
| 15 | 預計上市日 | DateTime | format: yyyy/MM/dd |
| 16 | 實際上市日 | DateTime | format: yyyy/MM/dd |
| 17 | 已銷售數量 | Number | — |
| 18 | 庫存數量 | Number | — |
| 19 | 備註 | Text | — |

---

## IP版權資料庫

**Table ID:** `tblt9DOm4hf5Mr5r` · **欄位數:** 19

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | IP名稱 | Text | — |
| 3 | 版權方 | Text | — |
| 4 | 版權代理商 | Text | — |
| 5 | 版權方聯絡人 | Text | — |
| 6 | 聯絡方式 | Text | — |
| 7 | 代理商聯絡人 | Text | — |
| 8 | 授權地區 | Text | — |
| 9 | 授權品類 | Text | — |
| 10 | 合約狀態 | SingleSelect | 洽談中 / 已簽約 / 已到期 / 已終止 / 已簽署 / 執行中 / 授權中 |
| 11 | 主對接人 | SingleSelect | Ray / 安然 / Shawn |
| 12 | 備註 | Text | — |
| 13 | IP類型 | SingleSelect | 自有IP / 授權IP |
| 14 | 風格描述 | Text | — |
| 15 | 主色調 | Text | — |
| 16 | 風格關鍵詞 | Text | — |
| 17 | 角色性格 | Text | — |
| 18 | 設計規範 | Text | — |
| 19 | 基底咒語 | Text | — |

---

## 採購供應商

**Table ID:** `tblwsHBor9fN7jXz` · **欄位數:** 14

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 供應商名稱 | Text | — |
| 3 | 所在地區 | SingleSelect | 台灣 / 中國大陸 / 泰國 / 其他 / 廣東 |
| 4 | 合作評分 | SingleSelect | ⭐ / ⭐⭐ / ⭐⭐⭐ / ⭐⭐⭐⭐ / ⭐⭐⭐⭐⭐ / ⭐⭐⭐⭐ 良 / ⭐⭐⭐⭐⭐ 優 |
| 5 | 聯絡人 | Text | — |
| 6 | 聯絡方式 | Text | — |
| 7 | 主要品類 | Text | — |
| 8 | 最低起訂量 | Number | — |
| 9 | 交期天數 | Number | — |
| 10 | 過去報價記錄 | Text | — |
| 11 | 主要對接人 | SingleSelect | Ray / 賴哥 / 木子 / Shawn / 高維 |
| 12 | 備註 | Text | — |
| 13 | 審核狀態 | Text | — |
| 14 | 申請人 | Text | — |

---

## 客戶名單

**Table ID:** `tbl9HpW9Wc6kDOwu` · **欄位數:** 18

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 客戶名稱 | Text | — |
| 3 | 客戶類型 | SingleSelect | KA大客戶 / 流通渠道 / 電商平台 / 零售門店 / 批發商 / 其他 / 百貨/商場 / 流通渠道商 / 海外經銷商 / 展覽/快閃 |
| 4 | 所在地區 | SingleSelect | 台灣 / 中國大陸 / 香港 / 澳門 / 泰國 / 東南亞 / 其他 / 歐洲 / 北美 / 澳洲/紐西蘭 / 中東 / 印度 / 北京 / 上海 / 廣州/深圳 |
| 5 | 聯絡人 | Text | — |
| 6 | 聯絡方式 | Text | — |
| 7 | 帳期 | SingleSelect | 即期 / 30天 / 60天 / 90天 / 其他 / Net45 / Net30 / 預付 / Net60 |
| 8 | 合作狀態 | SingleSelect | 洽談中 / 合作中 / 暫停 / 已流失 / 潛在客戶 / 目標開發中 / 活躍合作中 |
| 9 | 品類偏好 | Text | — |
| 10 | 主要對接業務 | SingleSelect | 安然 / 董亮 / Shawn / Ray |
| 11 | 備註 | Text | — |
| 12 | 銷售階段 | SingleSelect | 開發中 / 已接觸 / 跟進中 / 寄樣中 / 報價中 / 成交 / 收款中 / 長期客戶 / 暫停/失效 |
| 13 | 下次跟進日期 | DateTime | format: yyyy/MM/dd |
| 14 | 最後聯絡日期 | DateTime | format: yyyy/MM/dd |
| 15 | 預估金額 | Number | — |
| 16 | 預估幣別 | SingleSelect | CNY / TWD |
| 17 | 信用評級 | SingleSelect | 優 / 良 / 待觀察 |
| 18 | 常購IP品牌 | Text | — |

---

## 設計外包

**Table ID:** `tblxRlK0ykNifcaE` · **欄位數:** 12

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 名稱 | Text | — |
| 3 | 所在地區 | SingleSelect | 台灣 / 中國大陸 / 泰國 / 其他 |
| 4 | 合作評分 | SingleSelect | ⭐ / ⭐⭐ / ⭐⭐⭐ / ⭐⭐⭐⭐ / ⭐⭐⭐⭐⭐ / ⭐⭐⭐⭐ 良 |
| 5 | 聯絡方式 | Text | — |
| 6 | 作品集連結 | Text | — |
| 7 | 主要專長 | Text | — |
| 8 | 報價參考 | Text | — |
| 9 | 幣別 | SingleSelect | TWD / CNY / USD / THB |
| 10 | 過去合作記錄 | Text | — |
| 11 | 主要對接人 | SingleSelect | Bevis / Shawn / Ray |
| 12 | 備註 | Text | — |

---

## 物流貨代報關

**Table ID:** `tblbBJ31JSQ6Soj1` · **欄位數:** 11

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 廠商名稱 | Text | — |
| 3 | 服務類型 | SingleSelect | 海運 / 空運 / 快遞 / 陸運 / 報關行 / 倉儲 / 綜合（物流+報關） |
| 4 | 服務地區 | Text | — |
| 5 | 聯絡人 | Text | — |
| 6 | 聯絡方式 | Text | — |
| 7 | 運輸方式 | Text | — |
| 8 | 報價參考 | Text | — |
| 9 | 合作評分 | SingleSelect | ⭐ / ⭐⭐ / ⭐⭐⭐ / ⭐⭐⭐⭐ / ⭐⭐⭐⭐⭐ / ⭐⭐⭐⭐⭐ 優 |
| 10 | 主要對接人 | SingleSelect | 高維 / Shawn / Ray |
| 11 | 備註 | Text | — |

---

## 登入記錄

**Table ID:** `tblzMnFpbIWE90XX` · **欄位數:** 1

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |

---

## 每日銷售快報

**Table ID:** `tblq9KZowawQ647J` · **欄位數:** 13

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 日期 | DateTime | format: yyyy/MM/dd |
| 3 | 項目關聯 | Text | — |
| 4 | 填報人 | Text | — |
| 5 | 日流水總額 | Number | — |
| 6 | 幣別 | SingleSelect | TWD / CNY / THB / USD |
| 7 | 客流人數 | Number | — |
| 8 | 現金 | Number | — |
| 9 | 刷卡 | Number | — |
| 10 | 行動支付 | Number | — |
| 11 | 其他支付 | Number | — |
| 12 | 寄售銷售額 | Number | — |
| 13 | 備註 | Text | — |

---

## 場地資訊

**Table ID:** `tblE3cNSvvjhfPoy` · **欄位數:** 21

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 場地名稱 | Text | — |
| 3 | 城市 | SingleSelect | 台北 / 台中 / 高雄 / 台南 / 北京 / 上海 / 廣州 / 曼谷 / 其他 |
| 4 | 面積㎡ | Number | — |
| 5 | 活動開始日 | DateTime | format: yyyy/MM/dd |
| 6 | 活動結束日 | DateTime | format: yyyy/MM/dd |
| 7 | 搭建進場日 | DateTime | format: yyyy/MM/dd |
| 8 | 撤場日 | DateTime | format: yyyy/MM/dd |
| 9 | 場地聯絡人 | Text | — |
| 10 | 聯絡方式 | Text | — |
| 11 | 租金模式 | SingleSelect | 固定租金 / 抽成 / 固定+抽成 / 贊助換場 / 租金加抽成 / 保底抽成取高 |
| 12 | 固定租金 | Number | — |
| 13 | 幣別 | SingleSelect | TWD / CNY / THB / USD |
| 14 | 抽成比例% | Number | — |
| 15 | 租金備注 | Text | — |
| 16 | 贊助金額 | Number | — |
| 17 | 贊助用途 | Text | — |
| 18 | 合約狀態 | SingleSelect | 洽談中 / 已簽約 / 進行中 / 已結束 / 已簽署 |
| 19 | 負責人 | Text | — |
| 20 | 備註 | Text | — |
| 21 | 項目關聯 | Text | — |

---

## 寄售管理

**Table ID:** `tblJBz0k1BkdhdEz` · **欄位數:** 16

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 商品名稱 | Text | — |
| 3 | 寄售方類型 | SingleSelect | 品牌方 / 獨立設計師 / 合作夥伴 / 其他 / 授權商 |
| 4 | 寄售方 | Text | — |
| 5 | 寄售數量 | Number | — |
| 6 | 建議售價 | Number | — |
| 7 | 幣別 | SingleSelect | TWD / CNY / THB / USD |
| 8 | 分潤比例% | Number | — |
| 9 | 結算日期 | DateTime | format: yyyy/MM/dd |
| 10 | 當日銷售額 | Number | — |
| 11 | 當日銷售件數 | Number | — |
| 12 | 當日應付分潤 | Number | — |
| 13 | 結算狀態 | SingleSelect | 待結算 / 已結算 / 有爭議 / 未結算 |
| 14 | 負責人 | Text | — |
| 15 | 備註 | Text | — |
| 16 | 項目關聯 | Text | — |

---

## 使用紀錄

**Table ID:** `tblhDeLvRQn82mQM` · **欄位數:** 5

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 姓名 | Text | — |
| 3 | 部門 | Text | — |
| 4 | 日期 | Text | — |
| 5 | 時間 | Text | — |

---

## 公告板

**Table ID:** `tblTN9dSCixUkxBb` · **欄位數:** 9

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 標題 | Text | — |
| 3 | 內容 | Text | — |
| 4 | 類型 | SingleSelect | 重要公告 / 一般通知 / 作業提醒 / 分享連結 |
| 5 | 發布日期 | Text | — |
| 6 | 發布人 | Text | — |
| 7 | 連結 | Url | — |
| 8 | 已讀人員 | Text | — |
| 9 | 有效 | SingleSelect | 是 / 否 |

---

## 使用回報

**Table ID:** `tblHadqJd7zjqZai` · **欄位數:** 10

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 填報人 | Text | — |
| 3 | 部門 | Text | — |
| 4 | 日期 | Text | — |
| 5 | 時間 | Text | — |
| 6 | 整體滿意度 | Number | — |
| 7 | 使用的表單 | Text | — |
| 8 | 遇到的問題 | Text | — |
| 9 | 改善建議 | Text | — |
| 10 | 心情 | Text | — |

---

## 會議記錄

**Table ID:** `tblnxPaPOym2hcZ7` · **欄位數:** 11

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 會議標題 | Text | — |
| 3 | 日期 | DateTime | format: yyyy/MM/dd |
| 4 | 地點/形式 | SingleSelect | 台北辦公室 / 北京辦公室 / 曼谷辦公室 / 線上視訊 / 其他 |
| 5 | 出席人員 | Text | — |
| 6 | 議題摘要 | Text | — |
| 7 | 決議事項 | Text | — |
| 8 | 行動項目 | Text | — |
| 9 | 跟進負責人 | SingleSelect | Ray / 安然 / Shawn / Bevis / 賴哥 / 木子 / 高維 / 董亮 / 德寶 |
| 10 | 下次會議日期 | DateTime | format: yyyy/MM/dd |
| 11 | 填報人 | Text | — |

---

## 快閃店場地資料庫

**Table ID:** `tblIxWRC63J4lYcn` · **欄位數:** 14

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 商場名稱 | Text | — |
| 3 | 城市 | SingleSelect | 台北 / 北京 / 曼谷 / 上海 / 廣州 / 香港 / 吉隆坡 / 其他 |
| 4 | 商圈 | Text | — |
| 5 | 具體樓層/位置 | Text | — |
| 6 | 面積㎡ | Number | — |
| 7 | 客流等級 | SingleSelect | 極高 / 高 / 中 / 低 |
| 8 | 租金模式 | SingleSelect | 固定月租 / 純抽成 / 固定+抽成 / 其他 |
| 9 | 合作條件 | Text | — |
| 10 | 聯繫人 | Text | — |
| 11 | 聯繫方式 | Text | — |
| 12 | 合作評分 | SingleSelect | ★★★★★ / ★★★★ / ★★★ / ★★ / ★ |
| 13 | 備註 | Text | — |
| 14 | 填報人 | Text | — |

---

## 市場情報日報

**Table ID:** `tblHQEQlsg4Y4IAh` · **欄位數:** 7

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 日期 | Text | — |
| 2 | 欄目 | SingleSelect | 產業趨勢 / IP重要動態 / 產品創意 / 展會資訊 |
| 3 | 標題 | Text | — |
| 4 | 摘要 | Text | — |
| 5 | 來源連結 | Url | — |
| 6 | 圖片連結 | Url | — |
| 7 | 重要程度 | SingleSelect | 🔴 高 / 🟡 中 / 🟢 低 |

---

## 費用實報

**Table ID:** `tblvGsQpXPHtkp1C` · **欄位數:** 20

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 關聯項目 | Text | — |
| 2 | 費用類別 | SingleSelect | 生產製造 / 開發費用 / 版權費用 / 物流 / 運營 / 行銷 / 其他 / 薪資發放 / 辦公室租金 / 水電雜費 / 差旅 / 展場 / 採購 |
| 3 | 批次 | SingleSelect |  第一批 / 追加批-1 / 追加批-2 / 追加批-3 |
| 4 | 實際金額 | Number | — |
| 5 | 幣別 | SingleSelect | TWD / CNY / THB / USD / HKD |
| 6 | 發生日期 | DateTime | format: yyyy/MM/dd |
| 7 | 填報人 | Text | — |
| 8 | 備註 | Text | — |
| 9 | 供應商 | Text | — |
| 10 | 付款方式 | Text | — |
| 11 | 帳期（天） | Number | — |
| 12 | 歸屬主體 | SingleSelect | 香港JV / 深圳子公司 / 北京蕪解 / 台灣悍草 / UJ BKK |
| 13 | 計價幣別 | SingleSelect | RMB / HKD / USD / TWD / THB |
| 14 | 合作模式 | SingleSelect | 供應鏈發包 / 批發包銷 / 快閃店代運營 / 共同投資 / 台灣代運營 |
| 15 | 科目 | Text | — |
| 16 | 費用標題 | Text | — |
| 17 | 申請人 | Text | — |
| 18 | 狀態 | Text | — |
| 19 | 入帳日期 | Text | — |
| 20 | 金額（萬元） | Number | — |

---

## 跟進紀錄

**Table ID:** `tblwBXbz6CIckp6e` · **欄位數:** 9

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 文字 | Text | — |
| 2 | 客戶名稱 | Text | — |
| 3 | 跟進日期 | DateTime | format: yyyy/MM/dd |
| 4 | 記錄人 | SingleSelect | Ray / 安然 / Shawn / Den / Meaw / 董亮 / 德寶 / Bevis |
| 5 | 溝通類型 | SingleSelect | 電話 / 郵件 / 微信/Line / 視訊 / 當面拜訪 / 寄樣 / 報價 / 其他 |
| 6 | 溝通內容 | Text | — |
| 7 | 下次行動 | Text | — |
| 8 | 銷售階段更新 | SingleSelect | 開發中 / 已接觸 / 跟進中 / 寄樣中 / 報價中 / 成交 / 收款中 / 長期客戶 / 暫停/失效 |
| 9 | 下次跟進日期 | DateTime | format: yyyy/MM/dd |

---

## 角色設定

**Table ID:** `tblRA30fK5KaPmhv` · **欄位數:** 6

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 姓名 | Text | — |
| 3 | 角色 | SingleSelect | 超級管理員 / 總部管理中心 / 一般員工 |
| 4 | Email | Text | — |
| 5 | 部門 | Text | — |
| 6 | 備註 | Text | — |

---

## 產品開發流程

**Table ID:** `tblTqAZIdt2ViAma` · **欄位數:** 39

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 產品名稱 | Text | — |
| 2 | IP品牌 | Text | — |
| 3 | 關聯項目 | Text | — |
| 4 | 當前階段 | SingleSelect | 創意提案 / 內部立項確認 / 版權送審 / 採購詢價 / 打樣驗收 / 大貨確認 / 已完成 / 打樣確認 / 立項確認 / 大貨生產 / 打樣送審 / 3D建模 / 產品設計送審 / 概念視覺 |
| 5 | 提案說明 | Text | — |
| 6 | 提案圖 | Attachment | — |
| 7 | 提案人 | SingleSelect | Ray / 安然 / Shawn / Bevis / 詩彤 / 賴哥 / 木子 / 高維 / 董亮 / 德寶 |
| 8 | 建議零售價 | Number | — |
| 9 | 預計銷量 | Number | — |
| 10 | 預估成本_件 | Number | — |
| 11 | 幣別 | SingleSelect | TWD / CNY / THB / USD |
| 12 | 立項狀態 | SingleSelect | 待確認 / 已核准 / 已駁回 / 已立項 / 提案中 |
| 13 | 立項確認人 | SingleSelect | Ray / Shawn |
| 14 | 立項備註 | Text | — |
| 15 | 版權送審狀態 | SingleSelect | 未送審 / 待審核 / 修改中 / 已通過 / 已拒絕 |
| 16 | 版權回饋說明 | Text | — |
| 17 | 版權回饋圖 | Attachment | — |
| 18 | 送審輪次 | Number | — |
| 19 | 採購詢價狀態 | SingleSelect | 未開始 / 詢價中 / 比價完成 / 已確認供應商 |
| 20 | 選定供應商 | Text | — |
| 21 | 議定單價 | Number | — |
| 22 | 打樣狀態 | SingleSelect | 未開始 / 打樣中 / 待驗收 / 驗收通過 / 需重打 |
| 23 | 打樣圖 | Attachment | — |
| 24 | 打樣確認_管理 | SingleSelect | 待確認 / 已通過 / 退回 |
| 25 | 打樣確認_設計 | SingleSelect | 待確認 / 已通過 / 退回 |
| 26 | 大貨確認_管理 | SingleSelect | 待確認 / 已確認 |
| 27 | 大貨確認_採購 | SingleSelect | 待確認 / 已確認 |
| 28 | 大貨確認_設計 | SingleSelect | 待確認 / 已確認 |
| 29 | 大貨確認_銷售 | SingleSelect | 待確認 / 已確認 |
| 30 | 預計量產數 | Number | — |
| 31 | 最終單價 | Number | — |
| 32 | 產品類型 | SingleSelect | 公仔 / 非公仔 |
| 33 | 3D建模狀態 | SingleSelect | 未啟動 / 進行中 / 已完成 / 送審中 / 未開始 |
| 34 | 外包建模師 | Text | — |
| 35 | 包裝設計狀態 | SingleSelect | 未啟動 / 進行中 / 已完成 / 送審中 / 未開始 |
| 36 | 展架設計狀態 | SingleSelect | 未啟動 / 進行中 / 已完成 / 送審中 |
| 37 | 模具費 | Number | — |
| 38 | 模具開發週期_天 | Number | — |
| 39 | 大貨生產週期_天 | Number | — |

---

## IP_Studio_Assets

**Table ID:** `tblvJN5felUa2h2F` · **欄位數:** 8

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | IP名稱 | Text | — |
| 2 | 資產類型 | SingleSelect | 角色設定 / 正視圖 / 側視圖 / 背視圖 / 四視圖 / 3/4視圖 / 表情包 / 場景圖 / 產品效果圖 / 包裝設計 / 展架設計 / 社媒素材 / 主題概念 / 授權圖庫（版權方提供） |
| 3 | 狀態 | SingleSelect | 待生成 / 審核中 / 已核准 / 需修改 |
| 4 | 咒語 | Text | — |
| 5 | 圖片URL | Text | — |
| 6 | 版本 | Number | — |
| 7 | 備註 | Text | — |
| 8 | 審核人 | Text | — |

---

## IP_Studio_Themes

**Table ID:** `tbl4v8VBwg3Qfvau` · **欄位數:** 10

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | IP名稱 | Text | — |
| 2 | 主題名稱 | Text | — |
| 3 | 副標題 | Text | — |
| 4 | 主題描述 | Text | — |
| 5 | 情緒板關鍵詞 | Text | — |
| 6 | 目標品類 | Text | — |
| 7 | 目標市場 | Text | — |
| 8 | 季節 | Text | — |
| 9 | 狀態 | SingleSelect | AI草稿 / 討論中 / 已選用 / 已棄用 |
| 10 | 備註 | Text | — |

---

## 合約_AI草稿

**Table ID:** `tblApO2OHiXhXAd5` · **欄位數:** 9

| # | 欄位 | 類型 | 選項 / 備註 |
|---|---|---|---|
| 1 | 多行文本 | Text | — |
| 2 | 主合約ID | Text | — |
| 3 | 來源檔名 | Text | — |
| 4 | 解析時間 | DateTime | format: yyyy/MM/dd HH:mm |
| 5 | 解析信心度 | Number | — |
| 6 | 草稿內容 | Text | — |
| 7 | 草稿狀態 | SingleSelect | 待確認 / 已promote / 已駁回 |
| 8 | 確認人 | Text | — |
| 9 | 確認日期 | DateTime | format: yyyy/MM/dd |
