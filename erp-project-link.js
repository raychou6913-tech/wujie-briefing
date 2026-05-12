/**
 * 蕪解 ERP · 項目連結 helper
 *
 * 用途：「項目為中心」架構下，所有收付款表單必填「對應項目」。
 *      本 helper 提供載入項目列表 + 注入下拉的通用邏輯。
 *
 * 使用：
 *   <script src="erp-project-link.js"></script>
 *   <select id="exp-project" required></select>
 *   ...
 *   await window.injectProjectSelect('exp-project'); // 自動填選項
 *   const info = window.getSelectedProject('exp-project'); // 取得 {name, id, ip}
 */

(function(){
const PROXY = 'https://feishu-proxy.raychou6913.workers.dev';
const APP = 'Sg7ObNELHaAdZzshGIFjWPVhpce';
const TBL_PROJECT = 'tblPLJ2dLkdkWUAa';

let _cachedProjects = null;
let _cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 分鐘快取，避免每打開 modal 都重打

async function _getToken(){
  const r = await fetch(PROXY+'/auth/token', {method:'POST', headers:{'Content-Type':'application/json'}, body:'{}'});
  return (await r.json()).tenant_access_token;
}

/**
 * 載入所有「進行中 / 待 Ray 確認 / baseline 鎖定」的項目
 * 返回 [{record_id, name, ip, status, owner, region}, ...]
 */
window.loadProjectsForLink = async function(force){
  if(!force && _cachedProjects && Date.now() - _cacheTime < CACHE_TTL){
    return _cachedProjects;
  }
  try{
    const tk = await _getToken();
    const r = await fetch(`${PROXY}/open-apis/bitable/v1/apps/${APP}/tables/${TBL_PROJECT}/records?page_size=200`, {
      headers:{'Authorization':'Bearer '+tk}
    });
    const d = await r.json();
    const _v = x => (x && typeof x === 'object' && x.value) ? x.value : x;
    const projects = (d.data?.items || []).map(it => {
      const f = it.fields || {};
      return {
        record_id: it.record_id,
        name: f['項目名稱'] || '?',
        ip: _v(f['IP品牌']) || '',
        status: _v(f['狀態']) || '',
        owner: f['負責人'] || '',
        region: _v(f['所在地']) || '',
        category: _v(f['類別']) || '',
      };
    });
    // 過濾掉已完成 / 已取消
    const active = projects.filter(p => !['已完成','已取消'].includes(p.status));
    _cachedProjects = active;
    _cacheTime = Date.now();
    return active;
  }catch(e){
    console.warn('load projects failed', e);
    return [];
  }
};

/**
 * 把項目列表注入到指定的 <select> 元素
 * @param {string|HTMLElement} selectIdOrElem
 * @param {string} placeholder 預設提示文字
 */
window.injectProjectSelect = async function(selectIdOrElem, placeholder){
  const el = (typeof selectIdOrElem === 'string')
    ? document.getElementById(selectIdOrElem) : selectIdOrElem;
  if(!el) return;
  el.innerHTML = '<option value="">— 載入項目中 —</option>';
  const projects = await window.loadProjectsForLink();
  if(!projects.length){
    el.innerHTML = '<option value="">⚠ 還沒有項目，請先到「+ 新增項目」建立</option>';
    return;
  }
  // 按 IP 分組
  const byIP = {};
  projects.forEach(p => {
    const key = p.ip || '未指定 IP';
    if(!byIP[key]) byIP[key] = [];
    byIP[key].push(p);
  });
  const ph = placeholder || '— 必選對應項目 —';
  let html = `<option value="">${ph}</option>`;
  Object.keys(byIP).sort().forEach(ip => {
    html += `<optgroup label="📦 ${ip}">`;
    byIP[ip].forEach(p => {
      const tag = p.status === 'baseline 鎖定' ? ' 🔒' : p.status === '待 Ray 確認' ? ' ⏳' : '';
      html += `<option value="${p.record_id}" data-name="${p.name}">${p.name}${tag}</option>`;
    });
    html += '</optgroup>';
  });
  el.innerHTML = html;
};

/**
 * 取得使用者選的項目資訊（從快取拿，避免再打 API）
 * @returns {name, id, ip} 或 null
 */
window.getSelectedProject = function(selectIdOrElem){
  const el = (typeof selectIdOrElem === 'string')
    ? document.getElementById(selectIdOrElem) : selectIdOrElem;
  if(!el || !el.value) return null;
  const opt = el.options[el.selectedIndex];
  return {
    id: el.value,
    name: opt.getAttribute('data-name') || opt.textContent,
  };
};
})();
