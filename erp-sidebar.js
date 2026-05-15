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
    {href:'erp-shetong.html',          icon:'🎨', name:'設計任務板',   roles:['shetong','bevis','peilin','ray'],sbGroup:'開發'},
    {href:'erp-peiling.html',          icon:'🖋', name:'送審工作板',   roles:['peilin','bevis','shetong','ray'],sbGroup:'開發'},
    {href:'erp-gaowei.html',           icon:'🚢', name:'物流中心',     roles:['gaowei','shawn','ray','anran'],  sbGroup:'開發'},
    {href:'erp-library.html',          icon:'🖼️', name:'圖庫管理',     roles:['ray','shawn','anran','bevis','peilin','shetong','laige','muzi','chunlei','jiaying'], sbGroup:'開發'},
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
      a.innerHTML = `<span class="erp-sb-icon">${i.icon}</span><span class="erp-sb-label">${i.label}</span>`;
      g.appendChild(a);
    });
    return g;
  }
})();
