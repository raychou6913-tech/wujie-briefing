/* ──────────────────────────────────────────────────────────
   erp-sidebar.js — v4 sidebar 統一導航（22 個 ERP 廳共用）
   用法：每個廳 </body> 之前加 <script src="erp-sidebar.js"></script>
   會自動：
     1. 注入 sidebar CSS（含 body padding-left:88px）
     2. 注入 sidebar HTML 到 body 第一個子元素位置
     3. 讀 localStorage.erp_sess + 依角色 / 當前頁面 build nav
   依賴：頁面已套 v4 design tokens（--paper / --brand / --ink / --line 等）
   ──────────────────────────────────────────────────────── */
(function(){
  if(window.__erpSidebarLoaded) return;
  window.__erpSidebarLoaded = true;

  // 1) 注入 CSS
  const style = document.createElement('style');
  style.textContent = `
  /* sidebar 全局 layout offset */
  body{padding-left:88px;}
  @media(max-width:720px){ body{padding-left:0;padding-bottom:60px;} }

  .erp-sidebar{
    position:fixed;left:0;top:0;bottom:0;width:88px;
    background:var(--paper,#fafaf8);
    border-right:1px solid var(--line,#e8e8e3);
    transition:width .42s cubic-bezier(0.32,0.72,0,1);
    z-index:200;overflow:hidden;
    display:flex;flex-direction:column;
  }
  .erp-sidebar:hover{width:280px;}
  @media(max-width:720px){
    .erp-sidebar{width:0;}
    .erp-sidebar:hover{width:280px;}
  }
  .erp-sb-head{padding:18px 18px 14px;border-bottom:1px solid var(--line,#e8e8e3);min-height:64px;flex-shrink:0;}
  .erp-sb-logo{
    font-family:"Helvetica Neue","Arial Black",sans-serif;
    font-weight:900;font-size:16px;letter-spacing:-.04em;
    color:var(--ink,#0a0a0a);display:flex;align-items:center;gap:1px;
    line-height:1;white-space:nowrap;
  }
  .erp-sb-dot{
    width:5px;height:5px;border-radius:50%;
    background:var(--brand,#ff6b35);
    align-self:flex-end;margin-bottom:3px;margin-left:3px;flex-shrink:0;
  }
  .erp-sb-logo-sub{
    font-family:"Noto Serif TC",serif;
    font-size:9px;color:var(--ink-lo,#999);
    letter-spacing:.32em;margin-top:6px;
    opacity:0;transition:opacity .35s .12s cubic-bezier(0.32,0.72,0,1);
    white-space:nowrap;
  }
  .erp-sidebar:hover .erp-sb-logo-sub{opacity:1;}

  .erp-sb-content{flex:1;overflow-y:auto;padding:14px 0 60px;}
  .erp-sb-content::-webkit-scrollbar{width:0;}

  .erp-sb-group{margin-bottom:16px;}
  .erp-sb-group-title{
    padding:6px 28px 4px;
    font-family:"Helvetica Neue",sans-serif;
    font-size:9px;font-weight:700;
    color:var(--ink-faint,#ccc);letter-spacing:.18em;text-transform:uppercase;
    opacity:0;transition:opacity .3s .15s cubic-bezier(0.32,0.72,0,1);
    white-space:nowrap;
  }
  .erp-sidebar:hover .erp-sb-group-title{opacity:1;}

  .erp-sb-item{
    display:flex;align-items:center;gap:16px;
    padding:8px 28px;cursor:pointer;
    color:var(--ink-mid,#666);font-size:13px;font-weight:500;
    letter-spacing:-.005em;position:relative;
    transition:color .2s,background .2s;
    text-decoration:none;white-space:nowrap;
  }
  .erp-sb-item:hover{color:var(--ink,#0a0a0a);background:var(--paper-soft,#f2f2ef);}
  .erp-sb-item.active{color:var(--ink,#0a0a0a);font-weight:600;}
  .erp-sb-item.active::before{
    content:'';position:absolute;left:0;top:50%;
    width:3px;height:18px;background:var(--brand,#ff6b35);
    transform:translateY(-50%);border-radius:0 2px 2px 0;
  }
  .erp-sb-icon{
    width:20px;height:20px;
    display:flex;align-items:center;justify-content:center;
    font-size:14px;flex-shrink:0;opacity:.7;
  }
  .erp-sb-item.active .erp-sb-icon,.erp-sb-item:hover .erp-sb-icon{opacity:1;}
  .erp-sb-label{
    opacity:0;transform:translateX(-4px);
    transition:opacity .3s .1s cubic-bezier(0.32,0.72,0,1),
               transform .3s .1s cubic-bezier(0.32,0.72,0,1);
    flex:1;
  }
  .erp-sidebar:hover .erp-sb-label{opacity:1;transform:translateX(0);}

  .erp-sb-foot{
    padding:14px 20px;border-top:1px solid var(--line,#e8e8e3);
    display:flex;align-items:center;gap:12px;flex-shrink:0;
  }
  .erp-sb-avatar{
    width:30px;height:30px;border-radius:50%;
    background:var(--ink,#0a0a0a);color:var(--paper,#fafaf8);
    display:flex;align-items:center;justify-content:center;
    font-weight:700;font-size:11px;flex-shrink:0;
    font-family:"Helvetica Neue",sans-serif;
  }
  .erp-sb-foot-info{
    opacity:0;transition:opacity .3s .18s cubic-bezier(0.32,0.72,0,1);
    white-space:nowrap;display:flex;flex-direction:column;gap:2px;
  }
  .erp-sidebar:hover .erp-sb-foot-info{opacity:1;}
  .erp-sb-name{font-size:11px;font-weight:600;color:var(--ink,#0a0a0a);}
  .erp-sb-role-text{font-size:9px;color:var(--ink-lo,#999);}
  .erp-sb-logout{
    font-size:9px;color:var(--ink-lo,#999);text-decoration:none;
    margin-top:2px;letter-spacing:.04em;
    transition:color .2s cubic-bezier(0.32,0.72,0,1);
  }
  .erp-sb-logout:hover{color:var(--danger,#ef4444);}
  `;
  document.head.appendChild(style);

  // 2) 讀 session
  const sess = JSON.parse(localStorage.getItem('erp_sess')||'null');
  if(!sess || Date.now()-sess.ts > 7*86400000){
    localStorage.removeItem('erp_sess');
    location.href = 'login.html';
    return;
  }
  const {user, name, role, hall, color} = sess;

  // 3) 廳定義（roles 收緊：業務員只看跟銷售相關的廳，不再 ALL_ROLES 全開）
  const HALLS = [
    {href:'erp-war-room.html',         icon:'⚡', name:'戰情室',       roles:['ray','shawn','anran','yuming'],  sbGroup:'業務'},
    {href:'erp-shawn.html',            icon:'🌏', name:'營運看板',     roles:['shawn','ray'],                   sbGroup:'業務'},
    {href:'erp-anran.html',            icon:'🔐', name:'商務中心',     roles:['anran','ray','shawn'],            sbGroup:'業務'},
    {href:'erp-crm.html',              icon:'🎯', name:'業務中心',     roles:['laodong','debao','anran','ray','shawn'], sbGroup:'業務'},
    {href:'erp-finance.html',          icon:'💰', name:'財務中心',     roles:['yuming','ray','shawn'],           sbGroup:'財務'},
    {href:'erp-yangzi.html',           icon:'🗂', name:'HR 費用中心',  roles:['yangzi','leo','ray','shawn'],     sbGroup:'財務'},
    {href:'erp-pipeline.html',         icon:'🎨', name:'產品流水線',   roles:['ray','shawn','anran','bevis','peilin','shetong','laige','muzi','gaowei','laodong','debao','chunlei','jiaying'], sbGroup:'開發'},
    {href:'erp-procurement.html',      icon:'🏭', name:'採購台',       roles:['ray','shawn','anran','laige','muzi','gaowei'], sbGroup:'開發'},
    // erp-shetong / erp-peiling 廳已拿掉（內容是個人 todo 偽裝成公共頁）
    {href:'erp-gaowei.html',           icon:'🚢', name:'物流中心',     roles:['gaowei','shawn','ray','anran'],  sbGroup:'開發'},
    {href:'erp-library.html',          icon:'🖼️', name:'圖庫',         roles:['ray','shawn','anran','bevis','peilin','shetong','laige','muzi','chunlei','jiaying'], sbGroup:'開發'},
    {href:'erp-ecommerce.html',        icon:'🛒', name:'電商中心',     roles:['chunlei','jiaying','ray','shawn'], sbGroup:'快閃店'},
    {href:'erp-approval-tracker.html', icon:'📋', name:'版權送審追蹤', roles:['peilin','bevis','anran','ray','shawn','laige'], sbGroup:'IP'},
  ];

  // 當前頁面（從 URL pathname 抓）
  const currentPage = location.pathname.split('/').pop() || 'erp-lobby.html';
  const effectiveHall = hall || 'erp-lobby.html';

  // 4) 建 sidebar DOM
  const aside = document.createElement('aside');
  aside.className = 'erp-sidebar';
  aside.id = 'erp-sidebar';

  const escName = String(name||'').replace(/[<>&"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
  const escRole = String(role||'').replace(/[<>&"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
  const avatarChar = [...(name||'?')][0] || '?';

  aside.innerHTML = `
    <div class="erp-sb-head">
      <a href="erp-lobby.html" style="text-decoration:none;">
        <div class="erp-sb-logo">wujie<span class="erp-sb-dot"></span></div>
        <div class="erp-sb-logo-sub">蕪 解 創 意 · ERP</div>
      </a>
    </div>
    <div class="erp-sb-content" id="erp-sb-content"></div>
    <div class="erp-sb-foot">
      <div class="erp-sb-avatar" style="background:${color||'#0a0a0a'}">${avatarChar}</div>
      <div class="erp-sb-foot-info">
        <div class="erp-sb-name">${escName}</div>
        <div class="erp-sb-role-text">${escRole}</div>
        <a href="login.html" onclick="localStorage.removeItem('erp_sess');return true;" class="erp-sb-logout">登出</a>
      </div>
    </div>
  `;
  document.body.insertBefore(aside, document.body.firstChild);

  // 5) 填 sidebar content
  const content = document.getElementById('erp-sb-content');

  // Today 群（大廳就是個人工作台，拿掉「我的工作台」這個重複入口）
  const todayItems = [
    {href:'erp-lobby.html', icon:'○', label:'大廳'},
  ];
  // 新增項目：會發起新 IP / 新項目的角色（躍明是會計不發起，拿掉）
  if(['ray','shawn','anran','bevis','peilin'].includes(user)){
    todayItems.push({href:'erp-project-new.html', icon:'+', label:'新增項目'});
  }
  // 預算規劃器：管理層才用（業務員/設計/採購不負責預算）
  if(['ray','shawn','anran','yuming'].includes(user)){
    todayItems.push({href:'erp-budget-planner.html', icon:'▣', label:'預算規劃器'});
  }
  // 戰情室：管理層才看
  if(['ray','shawn','anran','yuming'].includes(user)){
    todayItems.push({href:'erp-war-room.html', icon:'◉', label:'戰情室'});
  }
  const todayGroup = mkGroup('Today', todayItems.filter(i => i.href !== currentPage));
  content.appendChild(todayGroup);

  // ── 我的動作群（每人個人化，點 → 大廳開 modal）──
  // data-action 屬性給 lobby 識別，sidebar 在非 lobby 頁點 = 跳回 lobby 並帶 hash trigger
  const MY_ACTIONS = {
    all:      [{icon:'＋', label:'錄費用', action:'expense'}],
    laodong:  [{icon:'＋', label:'新訂單', action:'new-order'}, {icon:'📊', label:'回報動銷', action:'sellthru'}, {icon:'📞', label:'拜訪記錄', action:'visit-log'}],
    debao:    [{icon:'＋', label:'新訂單', action:'new-order'}, {icon:'📊', label:'回報動銷', action:'sellthru'}, {icon:'📞', label:'拜訪記錄', action:'visit-log'}],
    anran:    [{icon:'✓', label:'核准批發訂單', action:'wholesale-approve'}, {icon:'📜', label:'合約待批', action:'contract-approve'}, {icon:'💸', label:'跨境款項', action:'xborder-confirm'}, {icon:'🔐', label:'IP 維護提醒', action:'ip-reminders'}],
    yuming:   [{icon:'📋', label:'我的待入帳', action:'my-pending'}, {icon:'📊', label:'月結任務', action:'monthend'}],
    yangzi:   [{icon:'✓', label:'我的待審', action:'my-approval'}, {icon:'💰', label:'薪資任務', action:'payroll-task'}, {icon:'📋', label:'OPEX 預算', action:'opex-budget'}],
    leo:      [{icon:'✓', label:'我的待審', action:'my-approval'}, {icon:'💰', label:'薪資任務', action:'payroll-task'}, {icon:'📋', label:'OPEX 預算', action:'opex-budget'}, {icon:'🏦', label:'銀行對帳', action:'bank-recon'}],
    bevis:    [{icon:'🎨', label:'設計核准', action:'design-approve'}, {icon:'✨', label:'bedo 輸出待確認', action:'bedo-approve'}],
    peilin:   [{icon:'🖋', label:'送審追蹤', action:'my-approval-tracker'}, {icon:'🖼', label:'主題企劃', action:'theme-plan'}],
    shetong:  [{icon:'📤', label:'我的設計任務', action:'my-design-task'}],
    laige:    [{icon:'🔍', label:'我的詢比價', action:'my-quote'}, {icon:'📦', label:'我的 PO', action:'my-po'}, {icon:'🏭', label:'打樣追蹤', action:'sampling-track'}],
    muzi:     [{icon:'📦', label:'備貨核對', action:'stock-check'}, {icon:'📝', label:'付款申請', action:'payment-request'}],
    gaowei:   [{icon:'🚚', label:'物流批次', action:'logistics-batch'}, {icon:'📋', label:'運費登錄', action:'freight-log'}],
    chunlei:  [{icon:'📱', label:'直播排期', action:'live-schedule'}, {icon:'📦', label:'備貨確認', action:'live-stock'}],
    jiaying:  [{icon:'🛒', label:'淘寶上架', action:'taobao-listing'}, {icon:'📊', label:'數據月報', action:'monthly-data'}],
    shawn:    [{icon:'🔥', label:'待催辦', action:'shawn-chase'}],
    ray:      [{icon:'✓', label:'我的待批核', action:'ray-approval'}],
  };
  // 待處理數量 helper（badge 用）
  const ACTION_COUNT_SOURCES = {
    'my-approval':{key:'yangzi_inbox_v1',filter:i=>i.status==='pending'},
    'my-pending':{key:'yuming_pending_v1',filter:()=>true,demo:4},
    'contract-approve':{key:'anran_contract_inbox_v1',filter:i=>!i.status,demoLen:3},
    'xborder-confirm':{key:'anran_xborder_inbox_v1',filter:i=>!i.status,demoLen:3},
    'ip-reminders':{key:'anran_ip_reminders_v1',filter:i=>!i.cleared,demoLen:3},
    'my-po':{key:'laige_po_v1',filter:i=>!i.archived,demoLen:3},
    'stock-check':{key:'muzi_stock_check_v1',filter:i=>!i.confirmed,demoLen:2},
    'shawn-chase':{key:'shawn_chase_v1',filter:i=>!i.done,demoLen:3},
    'ray-approval':{key:'ray_approval_v1',filter:i=>!i.done,demoLen:3},
    'design-approve':{key:'bevis_design_approve_v1',filter:i=>!i.done,demoLen:3},
    'my-approval-tracker':{key:'peilin_approval_track_v1',filter:i=>!i.done,demoLen:3},
    'my-design-task':{key:'shetong_design_task_v1',filter:i=>!i.done,demoLen:3},
    'logistics-batch':{key:'gaowei_logistics_v1',filter:i=>!i.done,demoLen:3},
    'wholesale-approve':{key:'shawn_wholesale_v1',filter:i=>!i.done,demoLen:3},
    'bedo-approve':{key:'bevis_bedo_v1',filter:i=>!i.done,demoLen:2},
    'theme-plan':{key:'peilin_theme_v1',filter:i=>!i.done,demoLen:3},
    'live-schedule':{key:'chunlei_live_v1',filter:i=>!i.done,demoLen:2},
    'live-stock':{key:'chunlei_live_v1',filter:i=>!i.done,demoLen:2},
    'taobao-listing':{key:'jiaying_taobao_v1',filter:i=>!i.done,demoLen:2},
    'monthend':{key:'generic_monthend_v1',filter:i=>!i.done,demoLen:3},
    'bank-recon':{key:'generic_bank-recon_v1',filter:i=>!i.done,demoLen:3},
    'my-quote':{key:'generic_my-quote_v1',filter:i=>!i.done,demoLen:2},
    'sampling-track':{key:'generic_sampling-track_v1',filter:i=>!i.done,demoLen:3},
  };
  function getActionCount(action){
    const src = ACTION_COUNT_SOURCES[action];
    if(!src) return null;
    const raw = localStorage.getItem(src.key);
    if(!raw) return src.demo != null ? src.demo : (src.demoLen != null ? src.demoLen : 0);
    try { return JSON.parse(raw).filter(src.filter).length; } catch(e){ return 0; }
  }

  const userActions = MY_ACTIONS[user] || [];
  const allActions = userActions.concat(MY_ACTIONS.all);
  if(allActions.length){
    const actionItems = allActions.map(a => ({
      href: 'erp-lobby.html#action-' + a.action,
      icon: a.icon,
      label: a.label,
      dataAction: a.action,
      badge: getActionCount(a.action),
    }));
    content.appendChild(mkGroup('我的動作', actionItems));
  }

  // 角色廳群
  const SB_GROUP_ORDER = ['業務','財務','開發','快閃店','IP'];
  SB_GROUP_ORDER.forEach(grp => {
    const halls = HALLS.filter(h =>
      h.sbGroup === grp &&
      h.roles.includes(user) &&
      h.href !== currentPage
    );
    if(!halls.length) return;
    const items = halls.map(h => ({href:h.href, icon:h.icon, label:h.name}));
    content.appendChild(mkGroup(grp, items));
  });

  // System 群（管理層）
  const sysItems = [];
  if(['ray','shawn','anran','yuming'].includes(user)){
    sysItems.push({href:'erp-entity-structure.html', icon:'🏛', label:'集團架構'});
    sysItems.push({href:'erp-transfer-pricing.html', icon:'🔄', label:'TP 設定'});
  }
  if(['ray','shawn'].includes(user)){
    sysItems.push({href:'erp-admin.html', icon:'⚙', label:'系統管理'});
  }
  const sysFiltered = sysItems.filter(i => i.href !== currentPage);
  if(sysFiltered.length){
    content.appendChild(mkGroup('System', sysFiltered));
  }

  function mkGroup(title, items){
    const g = document.createElement('div');
    g.className = 'erp-sb-group';
    const t = document.createElement('div');
    t.className = 'erp-sb-group-title';
    t.textContent = title;
    g.appendChild(t);
    items.forEach(i => {
      const a = document.createElement('a');
      a.href = i.href;
      a.className = 'erp-sb-item' + (i.href === currentPage ? ' active' : '');
      if(i.dataAction) a.dataset.action = i.dataAction;
      const badge = (i.badge && i.badge > 0)
        ? `<span style="margin-left:auto;background:var(--brand,#ff6b35);color:#fff;font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;font-family:'Helvetica Neue',sans-serif;">${i.badge}</span>`
        : '';
      a.innerHTML = `<span class="erp-sb-icon">${i.icon}</span><span class="erp-sb-label">${i.label}</span>${badge}`;
      g.appendChild(a);
    });
    return g;
  }
})();
