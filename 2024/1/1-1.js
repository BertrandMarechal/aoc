import * as fs from "node:fs";
import * as path from "node:path";

const input = fs.readFileSync(path.resolve('./1.txt'), 'utf8');

const inputMapped = input.split('\n').filter(a => a.length).map(line => line.split(' ').filter(Boolean).map(Number));
const left = inputMapped.map(line => line[0]).sort((a, b) => a - b);
const right = inputMapped.map(line => line[1]).sort((a, b) => a - b);
const result = left.reduce((acc, l, index) => acc + Math.abs(l - right[index]), 0);
console.log("=>(1-1.js:9) result", result);
