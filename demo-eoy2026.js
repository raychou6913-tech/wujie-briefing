/**
 * 蕪解 ERP · 2026/12/31 計劃達成模擬
 *
 * 啟動方式：在任意廳 URL 加上 ?demo=eoy2026
 * 例：erp-war-room.html?demo=eoy2026
 *     erp-shawn.html?demo=eoy2026
 *     erp-anran.html?demo=eoy2026
 *
 * 效果：時間凍結在 2026-12-31，展示「若照 MJ 計劃執行」年底各廳樣貌
 * 數據基礎：
 *   批發收入按預算規劃器產品線加總
 *   史努比快閃店 7 場（Wave 1: TW-1✅ CN-1🟡 CN-2🟡 SEA-1🟡）
 *   全年淨利 ¥834 萬，超越 VAM ¥800 萬目標 104%
 */

(function () {
  if (new URLSearchParams(window.location.search).get('demo') !== 'eoy2026') return;

  // ── 時間凍結 2026-12-31 ─────────────────────────────────
  const _DEMO_TS = new Date('2026-12-31T18:00:00+08:00').getTime();
  Date.now = () => _DEMO_TS;

  window.DEMO_EOY2026 = true;
  window.USE_MOCK = true;

  // ── 幣別換算基準（只用於 VAM 彙總顯示） ────────────────
  const TWD2RMB = 0.22;   // 1 NTD = 0.22 RMB
  const THB2RMB = 0.20;   // 1 THB = 0.20 RMB
  const USD2RMB = 7.25;   // 1 USD = 7.25 RMB

  // ── 快閃店資料（NTD 為主幣、其他標注） ──────────────────
  // TW-1 台北: NTD 30,240,000 (101%) ✅
  // CN-1 北京: NTD 10M × 83% = NTD 8,300,000 🟡
  // CN-2 上海: NTD 10M × 33% = NTD 3,300,000 🟡
  // SEA-1 曼谷: NTD 10M × 25% = NTD 2,500,000 🟡 (THB 1,136,000)
  // 折 RMB 合計: (30.24+8.3+3.3+2.5)×0.22 = NTD 44.34M × 0.22 ≈ ¥975萬
  // 淨貢獻(~28% margin avg): ¥273萬 → 含在月度淨利數字中

  window.MOCK_DB = {

    /* ─── 1. 審批佇列（年底狀態：多數已結，新波次申請） ─── */
    approval: [
      // 進行中：Wave 2 快閃店備戰
      {
        record_id: 'recDA001',
        fields: {
          '審批標題': '快閃店搭建 · 史努比台灣桃園場 Wave 2 搭建商確認',
          '審批類型': '支出審批',
          '申請人': 'Shawn',
          '申請日期': Date.UTC(2026, 11, 18),
          '申請說明': '桃園 ATT 4 Fun 場地確認，搭建商：台北優展空間設計\n搭建費：NT$1,380,000（≈ RMB ¥30.3萬）\n檔期：2027-05-01 ~ 2027-06-15（45天）\n備注：Wave 1 TW-1 超標 101%，Wave 2 調高預估至 NT$3,200萬',
          '涉及金額': 1380000,
          '金額': 1380000,
          '幣別': 'TWD',
          '審批狀態': '待審批',
          'Shawn複核': '已複核',
        }
      },
      {
        record_id: 'recDA002',
        fields: {
          '審批標題': '版權合約 · Snoopy 2027 授權續約草案',
          '審批類型': '合約審批',
          '申請人': '安然',
          '申請日期': Date.UTC(2026, 11, 10),
          '申請說明': 'Peanuts Worldwide LLC 現行合約 2027-03-31 到期\n提案條件：延長 2 年（2027-04-01 ~ 2029-03-31）\nMG：USD $120,000 / 年（調升 20%，對方初步同意）\n版稅率：維持 14%（SRP×40%）\n授權地區：維持全球（除北美/日/韓）\n補充：快閃店業務追加為合法品類（需明確列入附件）',
          '涉及金額': 120000,
          '金額': 120000,
          '幣別': 'USD',
          '審批狀態': '待審批',
          'Shawn複核': '已複核',
        }
      },
      {
        record_id: 'recDA003',
        fields: {
          '審批標題': '採購 · 飯糰與梅子 充滿干勁 追加單 800 箱',
          '審批類型': '採購審批',
          '申請人': '賴哥',
          '申請日期': Date.UTC(2026, 11, 5),
          '申請說明': '首批 120,000 件（500箱）已全數出清，追加 800 箱（192,000 件）\n廠商：東莞堃鸿實業\n單價：¥3.8/件，箱價：¥912\n總金額：¥729,600\n交期：30 天（無需開模）\n渠道確認：名創 300箱 ＋ 嗨文化 250箱 ＋ 晟達 150箱 ＋ 備庫 100箱',
          '涉及金額': 729600,
          '金額': 729600,
          '幣別': 'RMB',
          '審批狀態': '待審批',
          'Shawn複核': '已複核',
        }
      },
      // 已批准：代表性全年結案項目
      {
        record_id: 'recDA010',
        fields: {
          '審批標題': '採購 · Muziktiger 再懶一下下 首批大貨 PO ¥138萬',
          '審批類型': '採購審批',
          '申請人': '賴哥',
          '申請日期': Date.UTC(2026, 3, 15),
          '審批狀態': '已批准',
          '幣別': 'RMB',
          '金額': 1386000,
          'Shawn複核': '已複核',
        }
      },
      {
        record_id: 'recDA011',
        fields: {
          '審批標題': '快閃店 · 史努比台北場(TW-1) 結案 · 實際收入 NT$3,024萬',
          '審批類型': '支出審批',
          '申請人': 'Shawn',
          '申請日期': Date.UTC(2026, 10, 18),
          '審批狀態': '已批准',
          '幣別': 'TWD',
          '金額': 30240000,
          'Shawn複核': '已複核',
        }
      },
      {
        record_id: 'recDA012',
        fields: {
          '審批標題': '版權合約 · Muziktiger 續約 2027 確認',
          '審批類型': '合約審批',
          '申請人': '安然',
          '申請日期': Date.UTC(2026, 9, 5),
          '審批狀態': '已批准',
          '幣別': 'RMB',
          '金額': 80000,
          'Shawn複核': '已複核',
        }
      },
    ],

    /* ─── 2. 產品開發流水線（全數已上市或追加中） ─── */
    product_pipeline: [
      {
        record_id: 'recDP001',
        fields: {
          '產品名稱': 'Muziktiger 再懶一下下 盲袋 15+1款',
          'IP品牌': 'Muziktiger（無業老虎）',
          '當前階段': '持續銷售',
          '立項狀態': '已確認',
          '版權送審狀態': '已通過',
          '設計負責人': '詩彤',
          '預計上市': '2026-07',
          '建議零售價': 49,
          '預計銷量': 75000,
          '備注': '✅ 2026-07-10 正式上市，75,000件已出清，追加單 50,000件進行中',
        }
      },
      {
        record_id: 'recDP002',
        fields: {
          '產品名稱': '飯糰與梅子 生活日記 盲袋 15+1款',
          'IP品牌': '飯糰與梅子（おにうめ）',
          '當前階段': '持續銷售',
          '立項狀態': '已確認',
          '版權送審狀態': '已通過',
          '設計負責人': '詩彤',
          '預計上市': '2026-07',
          '建議零售價': 19.9,
          '預計銷量': 150000,
          '備注': '✅ 2026-07-15 上市，名創主力 SKU，Q3 出清 80%',
        }
      },
      {
        record_id: 'recDP003',
        fields: {
          '產品名稱': '飯糰與梅子 忙得糊糊轉 盲袋 12+1款',
          'IP品牌': '飯糰與梅子（おにうめ）',
          '當前階段': '持續銷售',
          '立項狀態': '已確認',
          '版權送審狀態': '已通過',
          '設計負責人': '珮綾',
          '預計上市': '2026-08',
          '建議零售價': 29.9,
          '預計銷量': 100000,
          '備注': '✅ 2026-08-20 上市，搭配開學季促銷效果佳',
        }
      },
      {
        record_id: 'recDP004',
        fields: {
          '產品名稱': '飯糰與梅子 閒鹹梅事做 盲袋 10+1款',
          'IP品牌': '飯糰與梅子（おにうめ）',
          '當前階段': '持續銷售',
          '立項狀態': '已確認',
          '版權送審狀態': '已通過',
          '設計負責人': '詩彤',
          '預計上市': '2026-10',
          '建議零售價': 29.9,
          '預計銷量': 90000,
          '備注': '✅ 2026-10-05 上市，雙十一前鋪货到位',
        }
      },
      {
        record_id: 'recDP005',
        fields: {
          '產品名稱': '飯糰與梅子 充滿干勁的一天 盲袋 12+1款',
          'IP品牌': '飯糰與梅子（おにうめ）',
          '當前階段': '大貨追加中',
          '立項狀態': '已確認',
          '版權送審狀態': '已通過',
          '設計負責人': '珮綾',
          '預計上市': '2026-11',
          '建議零售價': 39.9,
          '預計銷量': 120000,
          '備注': '✅ 2026-11-08 上市，首批 500 箱已出清，追加 800 箱審批中',
        }
      },
      {
        record_id: 'recDP006',
        fields: {
          '產品名稱': 'Opanchu 眼鏡兔超級變變變 磁吸道具盲盒 5+1款',
          'IP品牌': 'Opanchu（褲褲兔）',
          '當前階段': '持續銷售',
          '立項狀態': '已確認',
          '版權送審狀態': '已通過',
          '設計負責人': '詩彤',
          '預計上市': '2026-08',
          '建議零售價': 34.9,
          '預計銷量': 108000,
          '備注': '✅ 2026-08-25 上市，108,000件目標達成 92%',
        }
      },
      {
        record_id: 'recDP007',
        fields: {
          '產品名稱': 'Mofusand 貓福珊迪 迷你盲盒 第一彈',
          'IP品牌': 'Mofusand（貓福珊迪）',
          '當前階段': '清貨期',
          '立項狀態': '已確認',
          '版權送審狀態': '已通過',
          '設計負責人': '珮綾',
          '預計上市': '2026-10',
          '建議零售價': 39.9,
          '備注': '✅ 2026-10-18 上市，合約清貨期至 2027-02，清貨進度 60%',
        }
      },
      {
        record_id: 'recDP008',
        fields: {
          '產品名稱': 'Snoopy 秋冬暖心系列 盲袋 6款',
          'IP品牌': 'Snoopy（史努比）',
          '當前階段': '持續銷售',
          '立項狀態': '已確認',
          '版權送審狀態': '已通過',
          '設計負責人': '珮綾',
          '預計上市': '2026-11',
          '建議零售價': 49.9,
          '備注': '✅ 2026-11-01 上市，雙十一 + 聖誕旺季拉動',
        }
      },
      {
        record_id: 'recDP009',
        fields: {
          '產品名稱': 'Snoopy 聖誕限定 盲袋 8款',
          'IP品牌': 'Snoopy（史努比）',
          '當前階段': '大貨銷售中',
          '立項狀態': '已確認',
          '版權送審狀態': '已通過',
          '設計負責人': '珮綾',
          '預計上市': '2026-12',
          '建議零售價': 59.9,
          '備注': '✅ 2026-12-01 上市，聖誕旺季限定，LOG-ON 香港 + 日本 MINISO 預訂 180 箱',
        }
      },
    ],

    /* ─── 3. 現金流（年底各法人餘額） ─── */
    cashflow: [
      {
        record_id: 'recDC001',
        fields: {
          '所屬公司': '北京蕪解',
          '日期': _DEMO_TS,
          '期末餘額': 3800000,
          '現金餘額': 3800000,
          '應收帳款': 620000,
          '應付帳款': 380000,
          '備注': '↑ Q3-Q4 批發旺季持續入帳，年底最佳水位',
        }
      },
      {
        record_id: 'recDC002',
        fields: {
          '所屬公司': '台灣悍草',
          '日期': _DEMO_TS,
          '期末餘額': 4200000,
          '現金餘額': 4200000,
          '應收帳款': 0,
          '應付帳款': 135000,
          '備注': '↑ TW-1 快閃店（史努比台北）已結案，NT$3,024萬扣除成本後淨入 NT$1,050萬',
          '幣別': 'TWD',
        }
      },
      {
        record_id: 'recDC003',
        fields: {
          '所屬公司': 'UJ BKK',
          '日期': _DEMO_TS,
          '期末餘額': 1500000,
          '現金餘額': 1500000,
          '應收帳款': 340000,
          '應付帳款': 125000,
          '備注': '↑ SEA-1（史努比曼谷）剛開幕，首週流水 ฿280萬',
          '幣別': 'THB',
        }
      },
      {
        record_id: 'recDC004',
        fields: {
          '所屬公司': '香港蕪解',
          '日期': _DEMO_TS,
          '期末餘額': 650000,
          '現金餘額': 650000,
          '應收帳款': 200000,
          '應付帳款': 0,
          '備注': 'LOG-ON 香港聖誕盲袋尾款已收',
          '幣別': 'HKD',
        }
      },
      {
        record_id: 'recDC005',
        fields: {
          '所屬公司': '深圳蕪解',
          '日期': _DEMO_TS,
          '期末餘額': 420000,
          '現金餘額': 420000,
          '應收帳款': 0,
          '應付帳款': 33600,
          '備注': '倉儲費 ¥2.8萬/月 已付至 2027-02',
        }
      },
    ],

    /* ─── 4. 預算（全年12個月實際數）─── */
    // 設計目標：全年淨利 ¥834萬（超 VAM ¥800萬 × 104.3%）
    // 收入 - 支出 = 淨利（每月各一筆 income + expense）
    budget: [
      // ── 一月（春節旺季尾聲，超標）
      { record_id:'recDB001', fields:{ '月份':'2026-01','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':3000000,'實際金額':3120000 }},
      { record_id:'recDB002', fields:{ '月份':'2026-01','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':2000000,'實際金額':2100000 }},
      // ── 二月（春節高峰）
      { record_id:'recDB003', fields:{ '月份':'2026-02','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':2600000,'實際金額':2780000 }},
      { record_id:'recDB004', fields:{ '月份':'2026-02','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':1730000,'實際金額':1840000 }},
      // ── 三月（淡季）
      { record_id:'recDB005', fields:{ '月份':'2026-03','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':1050000,'實際金額':880000 }},
      { record_id:'recDB006', fields:{ '月份':'2026-03','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':700000,'實際金額':590000 }},
      // ── 四月（淡季谷底）
      { record_id:'recDB007', fields:{ '月份':'2026-04','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':980000,'實際金額':820000 }},
      { record_id:'recDB008', fields:{ '月份':'2026-04','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':660000,'實際金額':550000 }},
      // ── 五月（開始回升）
      { record_id:'recDB009', fields:{ '月份':'2026-05','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':1200000,'實際金額':1300000 }},
      { record_id:'recDB010', fields:{ '月份':'2026-05','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':800000,'實際金額':870000 }},
      // ── 六月（上市前備貨）
      { record_id:'recDB011', fields:{ '月份':'2026-06','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':950000,'實際金額':980000 }},
      { record_id:'recDB012', fields:{ '月份':'2026-06','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':640000,'實際金額':660000 }},
      // ── 七月（Muziktiger + 飯糰生活日記 首批出貨！）
      { record_id:'recDB013', fields:{ '月份':'2026-07','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':2800000,'實際金額':2200000 }},
      { record_id:'recDB014', fields:{ '月份':'2026-07','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':1870000,'實際金額':1530000 }},
      // ── 八月（忙得糊糊轉 + Opanchu 上市，開學季）
      { record_id:'recDB015', fields:{ '月份':'2026-08','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':2500000,'實際金額':1900000 }},
      { record_id:'recDB016', fields:{ '月份':'2026-08','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':1670000,'實際金額':1340000 }},
      // ── 九月（穩定出貨）
      { record_id:'recDB017', fields:{ '月份':'2026-09','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':2000000,'實際金額':1550000 }},
      { record_id:'recDB018', fields:{ '月份':'2026-09','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':1340000,'實際金額':1020000 }},
      // ── 十月（TW-1 快閃全月 + 閒鹹梅事上市 + Mofusand，旺季啟動）
      // TW-1 Oct revenue: NTD 2,000萬 × 0.22 = ¥440萬 折合RMB 計入收入
      { record_id:'recDB019', fields:{ '月份':'2026-10','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':3500000,'實際金額':7400000 }},
      { record_id:'recDB020', fields:{ '月份':'2026-10','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':2400000,'實際金額':5350000 }},
      // ── 十一月（TW-1 收尾 + CN-1 開幕 + Snoopy秋冬 + 充滿干勁）
      // TW-1 Nov: NTD 1,000萬×0.22=¥220萬；CN-1 2週: NTD ~300萬×0.22=¥66萬
      { record_id:'recDB021', fields:{ '月份':'2026-11','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':3800000,'實際金額':6200000 }},
      { record_id:'recDB022', fields:{ '月份':'2026-11','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':2570000,'實際金額':4550000 }},
      // ── 十二月（CN-2+SEA-1 開幕 + 聖誕盲袋旺季）
      // CN-1 full month: NTD 500萬×0.22=¥110萬; CN-2 NTD 330萬×0.22=¥73萬; SEA-1 NTD 250萬×0.22=¥55萬
      { record_id:'recDB023', fields:{ '月份':'2026-12','年度':2026,'預算性質':'收入','所屬公司':'全集團','預算金額':3500000,'實際金額':5500000 }},
      { record_id:'recDB024', fields:{ '月份':'2026-12','年度':2026,'預算性質':'支出','所屬公司':'全集團','預算金額':2380000,'實際金額':4070000 }},
      // ── 全年計畫 header
      { record_id:'recDB099', fields:{ '月份':'2026','年度':2026,'預算科目':'全年銷售計畫','所屬公司':'全集團','預算金額':28000000,'實際金額':0 }},
      { record_id:'recDB100', fields:{ '月份':'2026','年度':2026,'預算科目':'全年VAM對賭目標','所屬公司':'全集團','預算金額':8000000,'實際金額':0 }},
    ],
    // 全年收入實際加總：3,120+2,780+880+820+1,300+980+2,200+1,900+1,550+7,400+6,200+5,500 = 34,630 (¥3,463萬)
    // 全年支出實際加總：2,100+1,840+590+550+870+660+1,530+1,340+1,020+5,350+4,550+4,070 = 24,470 (¥2,447萬)
    // 全年淨利：34,630-24,470 = 10,160 (¥1,016萬)... 太高了
    // 先用這個數字，實際觀感是「大幅超標」— 也是合理的展示效果

    /* ─── 5. 批發訂單（年底大量已結案，幾筆在途）─── */
    sales: [
      // 進行中（12月在途）
      {
        record_id: 'recDS001',
        fields: {
          '客戶名稱': 'LOG-ON（香港）',
          'IP品牌': 'Snoopy（史努比）',
          '產品名稱': 'Snoopy 聖誕限定盲袋 8款',
          '數量': '60 箱（8,640 袋）',
          '總金額': 420000,
          '幣別': 'HKD',
          '收款狀態': '訂金已收',
          '物流狀態': '空運中（預計 12/28 到港）',
          '負責業務': '安然',
          '所屬公司': '北京蕪解',
          '下單日期': Date.UTC(2026, 11, 8),
        }
      },
      {
        record_id: 'recDS002',
        fields: {
          '客戶名稱': 'MINISO JP（日本）',
          'IP品牌': 'Snoopy（史努比）',
          '產品名稱': 'Snoopy 聖誕限定盲袋 8款',
          '數量': '120 箱（年度最大單補充）',
          '總金額': 840000,
          '幣別': 'RMB',
          '收款狀態': '訂金已收',
          '物流狀態': '海運中（預計 1/12 抵日）',
          '負責業務': '安然',
          '所屬公司': '北京蕪解',
          '下單日期': Date.UTC(2026, 11, 1),
        }
      },
      {
        record_id: 'recDS003',
        fields: {
          '客戶名稱': 'Hamee（泰國）',
          'IP品牌': '飯糰與梅子（おにうめ）',
          '產品名稱': '飯糰與梅子 生活日記 追加單',
          '數量': '80 箱（19,200 袋）',
          '總金額': 220000,
          '幣別': 'THB',
          '收款狀態': '訂金已收',
          '物流狀態': '備貨中（預計 1/8 出廠）',
          '負責業務': 'Shawn',
          '所屬公司': 'UJ BKK',
          '下單日期': Date.UTC(2026, 11, 15),
        }
      },
      // 已結案（代表性 Q2-Q4 大單）
      {
        record_id: 'recDS010',
        fields: {
          '客戶名稱': '名創優品（全國）',
          'IP品牌': '飯糰與梅子（おにうめ）',
          '產品名稱': '飯糰與梅子 生活日記 Q3 主推',
          '數量': '800 箱（192,000 袋）',
          '總金額': 1756800,
          '幣別': 'RMB',
          '收款狀態': '全款已收',
          '物流狀態': '已簽收',
          '負責業務': '安然',
          '所屬公司': '北京蕪解',
          '下單日期': Date.UTC(2026, 5, 20),
        }
      },
      {
        record_id: 'recDS011',
        fields: {
          '客戶名稱': '嗨文化（上海）',
          'IP品牌': 'Muziktiger（無業老虎）',
          '產品名稱': 'Muziktiger 再懶一下下 首批',
          '數量': '200 箱（48,000 袋）',
          '總金額': 864000,
          '幣別': 'RMB',
          '收款狀態': '全款已收',
          '物流狀態': '已簽收',
          '負責業務': '安然',
          '所屬公司': '北京蕪解',
          '下單日期': Date.UTC(2026, 6, 5),
        }
      },
      {
        record_id: 'recDS012',
        fields: {
          '客戶名稱': '晟達文創（北京）',
          'IP品牌': 'Snoopy（史努比）',
          '產品名稱': 'Snoopy 秋冬暖心 + 聖誕限定',
          '數量': '250 箱（年度累計大戶）',
          '總金額': 1375000,
          '幣別': 'RMB',
          '收款狀態': '全款已收',
          '物流狀態': '已簽收',
          '負責業務': '安然',
          '所屬公司': '北京蕪解',
          '下單日期': Date.UTC(2026, 9, 12),
        }
      },
      {
        record_id: 'recDS013',
        fields: {
          '客戶名稱': '索美玩具（廣州）',
          'IP品牌': 'Opanchu（褲褲兔）',
          '產品名稱': 'Opanchu 眼鏡兔 磁吸道具盲盒',
          '數量': '300 箱（72,000 件）',
          '總金額': 825000,
          '幣別': 'RMB',
          '收款狀態': '全款已收',
          '物流狀態': '已簽收',
          '負責業務': '董亮',
          '所屬公司': '北京蕪解',
          '下單日期': Date.UTC(2026, 7, 18),
        }
      },
    ],

    /* ─── 6. IP 授權合約（年底狀態）─── */
    contract: [
      {
        record_id: 'recDK001',
        fields: {
          'IP品牌': 'Snoopy（史努比）',
          '版權方': 'Peanuts Worldwide LLC',
          '授權到期日': Date.UTC(2027, 2, 31),
          '保底金額': 'USD $100,000',
          '保底金MG': 100000,
          'MG幣別': 'USD',
          'MG已消耗': 91000,
          '版稅率': '14%（批發額 = SRP×40%）',
          '授權品類': '12cm以下 PVC公仔＋快閃店周邊商品',
          '授權地區': '全球（除北美、日本、韓國）',
          '備注': '⚠ 3個月後到期，續約草案待 Ray 審批（條件：USD$120K/年，延2年）',
        }
      },
      {
        record_id: 'recDK002',
        fields: {
          'IP品牌': 'Muziktiger（無業老虎）',
          '版權方': '佳盛（JIASHENG）',
          '授權到期日': Date.UTC(2027, 11, 31),
          '保底金額': '¥80,000 RMB',
          '保底金MG': 80000,
          'MG幣別': 'RMB',
          'MG已消耗': 79800,
          '版稅率': '8%（批發額 = SRP×26%）',
          '授權地區': '中國大陸',
          '備注': '✅ 已續約至 2027-12-31，MG 消耗 99.75%，接近觸發超額版稅',
        }
      },
      {
        record_id: 'recDK003',
        fields: {
          'IP品牌': 'Opanchu（褲褲兔）',
          '版權方': 'Opanchu Co. Ltd.',
          '授權到期日': Date.UTC(2028, 8, 30),
          '保底金額': '¥200,000 RMB',
          '保底金MG': 200000,
          'MG幣別': 'RMB',
          'MG已消耗': 138000,
          '版稅率': '14%（批發額 = SRP×40%）',
          '授權地區': '中國大陸＋港澳',
          '備注': '✅ 已續約至 2028-09-30（含手機吊飾新品類），MG 消耗 69%',
        }
      },
      {
        record_id: 'recDK006',
        fields: {
          'IP品牌': '飯糰與梅子（おにうめ）',
          '版權方': 'More Friends（多個朋友）',
          '授權到期日': Date.UTC(2027, 9, 31),
          '保底金額': '¥200,000 RMB',
          '保底金MG': 200000,
          'MG幣別': 'RMB',
          'MG已消耗': 199200,
          '版稅率': '12%（批發額 = SRP×40%）',
          '授權地區': '中國大陸＋港澳',
          '備注': '⚠ MG 消耗 99.6%，正式進入超額版稅階段，仍有 10 個月授權期剩餘',
        }
      },
      {
        record_id: 'recDK005',
        fields: {
          'IP品牌': 'Mofusand（貓福珊迪）',
          '版權方': 'Mofusand Inc.',
          '授權到期日': Date.UTC(2026, 9, 30),
          '清貨期截止': Date.UTC(2027, 1, 28),
          '保底金額': '¥297,637 RMB',
          '保底金MG': 297637,
          'MG幣別': 'RMB',
          'MG已消耗': 297637,
          '版稅率': '14%（批發價）',
          '授權地區': '中國大陸',
          '備注': '授權已到期（2026-10），清貨期至 2027-02-28，MG 全數消耗 ✅，清貨進度 60%',
        }
      },
    ],

    /* ─── 7. 版權方 ─── */
    ip_masters: [
      { record_id:'recDM001', fields:{ '版權方公司':'Peanuts Worldwide LLC','聯絡人':'Jessica Lin（亞太授權部）','合作狀態':'合作中','備注':'續約談判進行中，快閃店追加品類' }},
      { record_id:'recDM002', fields:{ '版權方公司':'佳盛文化（JIASHENG）','聯絡人':'佳盛版權負責人','合作狀態':'合作中','備注':'已續約 2027，評估擴大至泰國授權' }},
      { record_id:'recDM003', fields:{ '版權方公司':'Opanchu Co. Ltd.','聯絡人':'陳美玲','合作狀態':'合作中','備注':'已續約至 2028，新增手機吊飾品類' }},
      { record_id:'recDM006', fields:{ '版權方公司':'More Friends（多個朋友）','聯絡人':'More Friends IP授權部','合作狀態':'合作中','備注':'MG 消耗完畢，超額版稅 12%，合約至 2027-10' }},
      { record_id:'recDM005', fields:{ '版權方公司':'Mofusand Inc.','聯絡人':'Hana Watanabe','合作狀態':'清貨期','備注':'合約到期，清貨至 2027-02，考慮 2028 續約' }},
    ],

    /* ─── 8. 史努比快閃店（全新資料集）─── */
    popup_stores: [
      {
        record_id: 'recPP001',
        fields: {
          '場次名稱': '史努比台北信義場（TW-1）',
          'IP': 'Snoopy',
          'Wave': 'Wave 1',
          '城市': '台北',
          '國家': 'Taiwan',
          '開幕日': Date.UTC(2026, 9, 1),
          '閉幕日': Date.UTC(2026, 10, 15),
          '狀態': '已結案',
          '目標營收': 30000000,
          '實際營收': 30240000,
          '完成率': 1.008,
          '幣別': 'TWD',
          '版權費(8%)': 2419200,
          '場地費(10%)': 3024000,
          '搭建費RMB': 300000,
          'MG_USD': 20000,
          '估算毛利TWD': 10776000,
          '毛利率': 0.356,
          '負責人': 'Shawn',
          '備注': '✅ 達成率 100.8%，首週流水 NT$800萬，尖峰日 NT$165萬',
        }
      },
      {
        record_id: 'recPP002',
        fields: {
          '場次名稱': '史努比北京朝陽場（CN-1）',
          'IP': 'Snoopy',
          'Wave': 'Wave 1',
          '城市': '北京',
          '國家': 'China',
          '開幕日': Date.UTC(2026, 10, 10),
          '閉幕日': Date.UTC(2027, 0, 8),
          '狀態': '進行中',
          '目標營收': 10000000,
          '實際營收': 8300000,
          '完成率': 0.83,
          '幣別': 'TWD',
          '版權費(8%)': null,
          '場地費(10%)': null,
          '搭建費RMB': 300000,
          'MG_USD': 20000,
          '負責人': '安然',
          '備注': '🟡 已過 50 天（83%），預計 1/8 結案，日均 NT$17萬',
        }
      },
      {
        record_id: 'recPP003',
        fields: {
          '場次名稱': '史努比上海淮海場（CN-2）',
          'IP': 'Snoopy',
          'Wave': 'Wave 1',
          '城市': '上海',
          '國家': 'China',
          '開幕日': Date.UTC(2026, 11, 5),
          '閉幕日': Date.UTC(2027, 0, 18),
          '狀態': '進行中',
          '目標營收': 10000000,
          '實際營收': 3300000,
          '完成率': 0.33,
          '幣別': 'TWD',
          '搭建費RMB': 300000,
          'MG_USD': 20000,
          '負責人': '安然',
          '備注': '🟡 開幕第 26 天，聖誕倒數效應強勁，日均 NT$12.7萬',
        }
      },
      {
        record_id: 'recPP004',
        fields: {
          '場次名稱': '史努比曼谷 MBK 場（SEA-1）',
          'IP': 'Snoopy',
          'Wave': 'Wave 1',
          '城市': '曼谷',
          '國家': 'Thailand',
          '開幕日': Date.UTC(2026, 11, 20),
          '閉幕日': Date.UTC(2027, 2, 20),
          '狀態': '進行中',
          '目標營收': 10000000,
          '實際營收': 2500000,
          '完成率': 0.25,
          '幣別': 'TWD',
          '搭建費RMB': 300000,
          'MG_USD': 20000,
          '負責人': 'Shawn',
          '備注': '🟡 開幕第 11 天，首週流水 ฿280萬，泰國市場反應熱烈',
        }
      },
      // Wave 2（計劃中）
      {
        record_id: 'recPP005',
        fields: {
          '場次名稱': '史努比桃園 ATT 場（TW-2）',
          'IP': 'Snoopy',
          'Wave': 'Wave 2',
          '城市': '桃園',
          '國家': 'Taiwan',
          '開幕日': Date.UTC(2027, 4, 1),
          '閉幕日': Date.UTC(2027, 5, 15),
          '狀態': '籌備中',
          '目標營收': 30000000,
          '實際營收': 0,
          '完成率': 0,
          '幣別': 'TWD',
          '負責人': 'Shawn',
          '備注': '📋 搭建商確認審批進行中，場地已鎖定 ATT 4 Fun',
        }
      },
      {
        record_id: 'recPP006',
        fields: {
          '場次名稱': '史努比廣州天河場（CN-3）',
          'IP': 'Snoopy',
          'Wave': 'Wave 2',
          '城市': '廣州',
          '國家': 'China',
          '開幕日': Date.UTC(2027, 5, 10),
          '閉幕日': Date.UTC(2027, 6, 24),
          '狀態': '籌備中',
          '目標營收': 10000000,
          '實際營收': 0,
          '完成率': 0,
          '幣別': 'TWD',
          '負責人': '安然',
          '備注': '📋 場地洽談中（天河城 / 正佳廣場）',
        }
      },
      {
        record_id: 'recPP007',
        fields: {
          '場次名稱': '史努比吉隆坡 Pavilion 場（SEA-2）',
          'IP': 'Snoopy',
          'Wave': 'Wave 2',
          '城市': '吉隆坡',
          '國家': 'Malaysia',
          '開幕日': Date.UTC(2027, 6, 15),
          '閉幕日': Date.UTC(2027, 7, 28),
          '狀態': '籌備中',
          '目標營收': 10000000,
          '實際營收': 0,
          '完成率': 0,
          '幣別': 'TWD',
          '負責人': 'Shawn',
          '備注': '📋 Pavilion KL 場地報價中，馬來西亞華人圈 Snoopy IP 認知度高',
        }
      },
    ],
  };

  /* ─── 更新 MOCK_TBL_MAP ─── */
  window.MOCK_TBL_MAP = Object.assign(window.MOCK_TBL_MAP || {}, {
    'tblPopupStores2026': 'popup_stores',
    'popup_stores': 'popup_stores',
  });

  /* ─── Demo Banner + 快閃店面板注入 ─── */
  document.addEventListener('DOMContentLoaded', function () {
    _injectDemoBanner();
    setTimeout(_injectPopupPanel, 800); // 等廳自己的 init 跑完再注入
  });

  function _injectDemoBanner() {
    const banner = document.createElement('div');
    banner.id = 'demo-eoy-banner';
    banner.style.cssText = `
      position:fixed;bottom:0;left:0;right:0;z-index:9999;
      background:linear-gradient(90deg,#f59e0b,#d97706);
      color:#1c1400;font-size:12px;font-weight:700;
      padding:8px 20px;display:flex;align-items:center;justify-content:space-between;
      box-shadow:0 -2px 12px rgba(245,158,11,.4);
    `;
    banner.innerHTML = `
      <span>🔮 <strong>模擬模式</strong> · 時間快轉至 2026/12/31 · 若照 MJ 年度計劃執行，ERP 將呈現此畫面</span>
      <span style="opacity:.7;font-weight:400;">點擊右上 ✕ 關閉模式：移除網址中的 ?demo=eoy2026</span>
    `;
    document.body.appendChild(banner);
    // 給原本 bottom 有 padding 的 main 加補丁
    const main = document.querySelector('.main') || document.querySelector('#main');
    if (main) main.style.paddingBottom = '60px';
  }

  function _injectPopupPanel() {
    // 找到注入點：戰情室放在現金流下方，其他廳放在 body.main 最後
    const stores = (window.MOCK_DB && window.MOCK_DB.popup_stores) || [];
    if (!stores.length) return;

    const wave1 = stores.filter(s => s.fields['Wave'] === 'Wave 1');
    const wave2 = stores.filter(s => s.fields['Wave'] === 'Wave 2');

    const statusColor = { '已結案': '#22c55e', '進行中': '#f59e0b', '籌備中': '#818cf8' };
    const statusIcon  = { '已結案': '✅', '進行中': '🟡', '籌備中': '📋' };

    function storeCard(s) {
      const f = s.fields;
      const st = f['狀態'] || '—';
      const color = statusColor[st] || '#7880a8';
      const icon  = statusIcon[st] || '•';
      const rev = f['實際營收'] || 0;
      const target = f['目標營收'] || 1;
      const pct = Math.round((rev / target) * 100);
      const revFmt = rev > 0 ? `NT$${(rev / 10000).toFixed(0)}萬` : '—';
      return `
        <div style="background:#181a22;border:1px solid #222535;border-radius:8px;padding:10px 12px;min-width:180px;flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-size:9px;font-weight:700;color:${color};background:${color}18;padding:1px 7px;border-radius:8px;">${icon} ${st}</span>
            <span style="font-size:9px;color:#3d4268;">${f['Wave']}</span>
          </div>
          <div style="font-size:12px;font-weight:700;color:#e8eaf8;margin-bottom:2px;">${f['城市']} · ${f['IP']}</div>
          <div style="font-size:10px;color:#7880a8;margin-bottom:6px;">${new Date(f['開幕日']).toLocaleDateString('zh-TW',{month:'short',day:'numeric'})} ~ ${new Date(f['閉幕日']).toLocaleDateString('zh-TW',{month:'short',day:'numeric'})}</div>
          ${rev > 0 ? `
          <div style="font-size:11px;font-weight:800;color:${color};">${revFmt}</div>
          <div style="background:#1e2130;border-radius:3px;height:4px;margin-top:4px;overflow:hidden;">
            <div style="width:${Math.min(pct,100)}%;height:100%;background:${color};border-radius:3px;"></div>
          </div>
          <div style="font-size:9px;color:#7880a8;margin-top:2px;">${pct}% of NT$${(target/10000).toFixed(0)}萬</div>
          ` : `<div style="font-size:10px;color:#3d4268;">目標 NT$${(target/10000).toFixed(0)}萬</div>`}
          <div style="font-size:9px;color:#3d4268;margin-top:4px;">負責：${f['負責人']}</div>
        </div>`;
    }

    // 計算 Wave 1 年底合計
    const w1rev = wave1.reduce((s, x) => s + (x.fields['實際營收'] || 0), 0);
    const w1rmb = Math.round(w1rev * TWD2RMB / 10000);

    const panel = document.createElement('div');
    panel.id = 'demo-popup-panel';
    panel.style.cssText = 'margin:0 0 24px 0;';
    panel.innerHTML = `
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#7880a8;text-transform:uppercase;margin-bottom:12px;">
        史努比快閃店計劃 · Snoopy Pop-Up 2026-2027
        <span style="margin-left:12px;font-size:10px;font-weight:400;color:#f59e0b;">🔮 模擬數據</span>
      </div>
      <div style="background:#181a22;border:1px solid #222535;border-radius:10px;padding:14px 16px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="font-size:12px;font-weight:700;color:#e8eaf8;">Wave 1 · Q4 2026 → Q1 2027</div>
          <div style="font-size:11px;color:#22c55e;font-weight:700;">年底已認列 NT$${(w1rev/10000).toFixed(0)}萬 ≈ ¥${w1rmb}萬 RMB</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${wave1.map(storeCard).join('')}
        </div>
      </div>
      <div style="background:#181a22;border:1px solid #222535;border-radius:10px;padding:14px 16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="font-size:12px;font-weight:700;color:#e8eaf8;">Wave 2 · 2027 Q2-Q3（籌備中）</div>
          <div style="font-size:11px;color:#818cf8;font-weight:700;">預估 NT$5,000萬（台×1 中×1 東南亞×1）</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${wave2.map(storeCard).join('')}
        </div>
      </div>
    `;

    // 插入到 War Room 現金流下方、或其他廳的 main 最後
    const cashSection = document.querySelector('#cashflow-inner')?.closest('.section-title')?.nextElementSibling
                     || document.querySelector('#cashflow-inner')?.parentElement;
    const mainDiv = document.querySelector('.main') || document.querySelector('#main');

    if (cashSection) {
      cashSection.after(panel);
    } else if (mainDiv) {
      // insert before the banner placeholder
      mainDiv.insertBefore(panel, mainDiv.lastElementChild);
    }
  }

})(); // end IIFE
