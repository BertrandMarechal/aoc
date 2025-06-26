import * as fs from "node:fs";
import * as path from "node:path";

const input = fs.readFileSync(path.resolve('./1.txt'), 'utf8');

const inputMapped = input.split('\n').filter(a => a.length).map(line => line.split(' ').filter(Boolean).map(Number));
const left = inputMapped.map(line => line[0]);
const right = inputMapped.map(line => line[1]).reduce((a, c) => {
  a[c] = (a[c] || 0) + 1;
  return a
}, {});

const result = left.reduce((acc, l, index) => acc + (l * (right[l] || 0)), 0);
console.log("=>(1-2.js:12) result", result);
