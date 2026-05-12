/**
 * 蕪解 ERP · 通用幣別 / 匯率 helper
 *
 * 用途：項目／預算／合約三張表都有「幣別」+「鎖定匯率」欄位（2026-05-12 加）。
 *      顯示金額時統一加「≈ ¥X RMB」括號註解。
 *
 * 使用：頁面 <script src="erp-currency.js"></script>
 *      然後呼叫 fxFmtWithRMB(amount, currency, lockedRate)
 */

// 預設匯率（沒鎖定時 fallback，跟 finance 廳保持一致）
window.FX_DEFAULTS = {
  RMB: 1.0,
  CNY: 1.0,
  USD: 7.20,
  HKD: 0.92,
  TWD: 0.22,
  THB: 0.20,
};

/**
 * 任意幣值轉 RMB
 * @param {number} amount 原幣金額
 * @param {string} currency 幣別代碼（USD/HKD/TWD/THB/RMB/CNY）
 * @param {number} lockedRate 鎖定匯率（1 原幣 = X RMB）；若無則用 FX_DEFAULTS
 */
window.fxToRMB = function(amount, currency, lockedRate){
  if(!amount && amount !== 0) return 0;
  const rate = lockedRate || window.FX_DEFAULTS[currency] || 1;
  return amount * rate;
};

/**
 * 格式化金額並附 RMB 換算（若幣別不是 RMB）
 * @returns "USD 100,000 (≈ ¥720,000)" or "¥ 50,000"（RMB 不加括號）
 */
window.fxFmtWithRMB = function(amount, currency, lockedRate){
  const cur = (currency||'RMB').toUpperCase();
  const fmt = n => Math.round(n).toLocaleString();
  if(cur === 'RMB' || cur === 'CNY'){
    return '¥ ' + fmt(amount);
  }
  const rmb = window.fxToRMB(amount, cur, lockedRate);
  const sym = {USD:'US$', HKD:'HK$', TWD:'NT$', THB:'฿'}[cur] || (cur+' ');
  return `${sym}${fmt(amount)} <span style="color:var(--txt-lo);font-size:.85em;">(≈ ¥${fmt(rmb)})</span>`;
};

/**
 * 簡化版（無 HTML）：給 textContent 用
 */
window.fxFmtPlain = function(amount, currency, lockedRate){
  const cur = (currency||'RMB').toUpperCase();
  const fmt = n => Math.round(n).toLocaleString();
  if(cur === 'RMB' || cur === 'CNY') return '¥' + fmt(amount);
  const rmb = window.fxToRMB(amount, cur, lockedRate);
  const sym = {USD:'US$', HKD:'HK$', TWD:'NT$', THB:'฿'}[cur] || (cur+' ');
  return `${sym}${fmt(amount)} (≈¥${fmt(rmb)})`;
};

/**
 * 顯示「鎖定匯率」標籤
 * @returns "🔒 1 USD = ¥7.2000" or 空字串（無鎖定時）
 */
window.fxRateBadge = function(currency, lockedRate){
  if(!lockedRate) return '';
  const cur = (currency||'').toUpperCase();
  if(cur === 'RMB' || cur === 'CNY') return '';
  return `🔒 1 ${cur} = ¥${lockedRate.toFixed(4)}`;
};
