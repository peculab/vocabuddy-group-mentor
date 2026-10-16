const assert = require("assert");
const { countDue } = require("./srs.js");
assert.strictEqual(countDue([], 100), 0);
const states = Object.freeze([
  Object.freeze({ due: 99 }),
  Object.freeze({ due: 100 }),
  Object.freeze({ due: 101 })
]);
const before = JSON.stringify(states);
assert.strictEqual(countDue(states, 100), 2);
assert.strictEqual(countDue([{ due: 101 }, { due: 200 }], 100), 0);
assert.strictEqual(JSON.stringify(states), before);
assert.strictEqual(countDue(states, 100), countDue(states, 100));
assert.strictEqual(countDue([{ due: -1.5 }, { due: 0 }, { due: 0.5 }], 0), 2);
console.log("countDue tests passed ?");
