// srs.js —— 純函式：不碰畫面、不自己看時鐘，所以可以測試
// （Lab 7 Sprint 3；PLAN 見 index.html 頂端註解）
const INTERVALS = [0, 1, 2, 4, 8, 16];   // 盒 1~5 的間隔天數（索引 0 不用）

function schedule(box, ok, today){
  const nb = ok ? Math.min(box + 1, 5) : 1;
  return { box: nb, due: today + INTERVALS[nb] };
}

// 讓 Node（測試）與瀏覽器（App）都能用這個檔案
// 用途：計算 due <= today 的筆數，不修改輸入。
function countDue(states, today){
  return states.reduce((count, state) => count + (state.due <= today ? 1 : 0), 0);
}

if (typeof module !== "undefined") module.exports = { schedule, INTERVALS, countDue };
