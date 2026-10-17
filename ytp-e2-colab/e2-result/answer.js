// ??????????????????????????
function normalizeAnswer(value){ return value.trim().toLowerCase().replace(/\s+/g, " "); }
function isCorrectAnswer(input, expected){ return normalizeAnswer(input) === normalizeAnswer(expected); }
if(typeof module !== "undefined") module.exports = { normalizeAnswer, isCorrectAnswer };
