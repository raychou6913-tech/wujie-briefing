/* ──────────────────────────────────────────────────────────
   bkk-sidebar.js — UJ BKK 專用 v4 sidebar（與 erp-sidebar.js 隔離）
   讀 bkk_sess（與主 ERP 的 erp_sess 不同 key）
   用法：每個 bkk-*.html </body> 之前加 <script src="bkk-sidebar.js"></script>
   ──────────────────────────────────────────────────────── */
(function(){
  if(window.__bkkSidebarLoaded) return;
  window.__bkkSidebarLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
  body{padding-left:88px;}
  @media(max-width:720px){ body{padding-left:0;padding-bottom:60px;} }

  .bkk-sidebar{
    position:fixed;left:0;top:0;bottom:0;width:88px;
    background:var(--paper,#fafaf8);
    border-right:1px solid var(--line,#e8e8e3);
    transition:width .42s cubic-bezier(0.32,0.72,0,1);
    z-index:200;overflow:hidden;
    display:flex;flex-direction:column;
  }
  .bkk-sidebar:hover{width:280px;}
  @media(max-width:720px){
    .bkk-sidebar{width:0;}
    .bkk-sidebar:hover{width:280px;}
  }
  .bkk-sb-head{padding:18px 18px 14px;border-bottom:1px solid var(--line,#e8e8e3);min-height:64px;flex-shrink:0;}
  .bkk-sb-logo{
    font-family:"Helvetica Neue","Arial Black",sans-serif;
    font-weight:900;font-size:15px;letter-spacing:-.04em;
    color:var(--ink,#0a0a0a);display:flex;align-items:center;gap:2px;
    line-height:1;white-space:nowrap;
  }
  .bkk-sb-dot{
    width:5px;height:5px;border-radius:50%;
    background:var(--brand,#ff6b35);
    align-self:flex-end;margin-bottom:3px;margin-left:3px;flex-shrink:0;
  }
  .bkk-sb-logo-sub{
    font-family:"Noto Serif TC",serif;
    font-size:9px;color:var(--ink-lo,#999);
    letter-spacing:.32em;margin-top:6px;
    opacity:0;transition:opacity .35s .12s cubic-bezier(0.32,0.72,0,1);
    white-space:nowrap;
  }
  .bkk-sidebar:hover .bkk-sb-logo-sub{opacity:1;}

  .bkk-sb-content{flex:1;overflow-y:auto;padding:14px 0 60px;}
  .bkk-sb-content::-webkit-scrollbar{width:0;}

  .bkk-sb-group{margin-bottom:16px;}
  .bkk-sb-group-title{
    padding:6px 28px 4px;
    font-family:"Helvetica Neue",sans-serif;
    font-size:9px;font-weight:700;
    color:var(--ink-faint,#ccc);letter-spacing:.18em;text-transform:uppercase;
    opacity:0;transition:opacity .3s .15s cubic-bezier(0.32,0.72,0,1);
    white-space:nowrap;
  }
  .bkk-sidebar:hover .bkk-sb-group-title{opacity:1;}

  .bkk-sb-item{
    display:flex;align-items:center;gap:16px;
    padding:8px 28px;cursor:pointer;
    color:var(--ink-mid,#666);font-size:13px;font-weight:500;
    letter-spacing:-.005em;position:relative;
    transition:color .2s,background .2s;
    text-decoration:none;white-space:nowrap;
  }
  .bkk-sb-item:hover{color:var(--ink,#0a0a0a);background:var(--paper-soft,#f2f2ef);}
  .bkk-sb-item.active{color:var(--ink,#0a0a0a);font-weight:600;}
  .bkk-sb-item.active::before{
    content:'';position:absolute;left:0;top:50%;
    width:3px;height:18px;background:var(--brand,#ff6b35);
    transform:translateY(-50%);border-radius:0 2px 2px 0;
  }
  .bkk-sb-icon{
    width:20px;height:20px;
    display:flex;align-items:center;justify-content:center;
    font-size:14px;flex-shrink:0;opacity:.7;
  }
  .bkk-sb-item.active .bkk-sb-icon,.bkk-sb-item:hover .bkk-sb-icon{opacity:1;}
  .bkk-sb-label{
    opacity:0;transform:translateX(-4px);
    transition:opacity .3s .1s cubic-bezier(0.32,0.72,0,1),
               transform .3s .1s cubic-bezier(0.32,0.72,0,1);
    flex:1;
  }
  .bkk-sidebar:hover .bkk-sb-label{opacity:1;transform:translateX(0);}

  .bkk-sb-foot{
    padding:14px 20px;border-top:1px solid var(--line,#e8e8e3);
    display:flex;align-items:center;gap:12px;flex-shrink:0;
  }
  .bkk-sb-avatar{
    width:30px;height:30px;border-radius:50%;
    background:var(--ink,#0a0a0a);color:var(--paper,#fafaf8);
    display:flex;align-items:center;justify-content:center;
    font-weight:700;font-size:11px;flex-shrink:0;
    font-family:"Helvetica Neue",sans-serif;
  }
  .bkk-sb-foot-info{
    opacity:0;transition:opacity .3s .18s cubic-bezier(0.32,0.72,0,1);
    white-space:nowrap;display:flex;flex-direction:column;gap:2px;
  }
  .bkk-sidebar:hover .bkk-sb-foot-info{opacity:1;}
  .bkk-sb-name{font-size:11px;font-weight:600;color:var(--ink,#0a0a0a);}
  .bkk-sb-role-text{font-size:9px;color:var(--ink-lo,#999);}
  .bkk-sb-logout{
    font-size:9px;color:var(--ink-lo,#999);text-decoration:none;
    margin-top:2px;letter-spacing:.04em;
    transition:color .2s cubic-bezier(0.32,0.72,0,1);
  }
  .bkk-sb-logout:hover{color:var(--danger,#ef4444);}
  `;
  document.head.appendChild(style);

  const sess = JSON.parse(localStorage.getItem('bkk_sess')||'null');
  if(!sess || Date.now()-sess.ts > 7*86400000){
    localStorage.removeItem('bkk_sess');
    location.href = 'bkk-login.html';
    return;
  }
  const {user, name, role, color} = sess;

  // BKK nav（5 個工作頁）
  const ITEMS = [
    {group:'Today',     href:'bkk-lobby.html',     icon:'○', label:'大廳'},
    {group:'營運',      href:'bkk-hub.html',       icon:'⊕', label:'營運中心'},
    {group:'營運',      href:'bkk-popup.html',     icon:'⚡', label:'快閃店流水線'},
    {group:'營運',      href:'bkk-warehouse.html', icon:'📦', label:'倉庫'},
    {group:'營運',      href:'bkk-approval.html',  icon:'📋', label:'送審追蹤'},
  ];

  const currentPage = location.pathname.split('/').pop() || 'bkk-lobby.html';

  const aside = document.createElement('aside');
  aside.className = 'bkk-sidebar';
  aside.id = 'bkk-sidebar';

  const escName = String(name||'').replace(/[<>&"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
  const escRole = String(role||'').replace(/[<>&"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
  const avatarChar = [...(name||'?')][0] || '?';

  aside.innerHTML = `
    <div class="bkk-sb-head">
      <a href="bkk-lobby.html" style="text-decoration:none;">
        <div class="bkk-sb-logo">UJ&nbsp;BKK<span class="bkk-sb-dot"></span></div>
        <div class="bkk-sb-logo-sub">B A N G K O K · O P S</div>
      </a>
    </div>
    <div class="bkk-sb-content" id="bkk-sb-content"></div>
    <div class="bkk-sb-foot">
      <div class="bkk-sb-avatar" style="background:${color||'#0a0a0a'}">${avatarChar}</div>
      <div class="bkk-sb-foot-info">
        <div class="bkk-sb-name">${escName}</div>
        <div class="bkk-sb-role-text">${escRole}</div>
        <a href="bkk-login.html" onclick="localStorage.removeItem('bkk_sess');return true;" class="bkk-sb-logout">登出</a>
      </div>
    </div>
  `;
  document.body.insertBefore(aside, document.body.firstChild);

  const content = document.getElementById('bkk-sb-content');
  const groups = {};
  ITEMS.forEach(it => {
    if(it.href === currentPage) return;
    if(!groups[it.group]) groups[it.group] = [];
    groups[it.group].push(it);
  });
  Object.keys(groups).forEach(g => {
    const div = document.createElement('div');
    div.className = 'bkk-sb-group';
    const t = document.createElement('div');
    t.className = 'bkk-sb-group-title';
    t.textContent = g;
    div.appendChild(t);
    groups[g].forEach(i => {
      const a = document.createElement('a');
      a.href = i.href;
      a.className = 'bkk-sb-item' + (i.href === currentPage ? ' active' : '');
      a.innerHTML = `<span class="bkk-sb-icon">${i.icon}</span><span class="bkk-sb-label">${i.label}</span>`;
      div.appendChild(a);
    });
    content.appendChild(div);
  });
})();
