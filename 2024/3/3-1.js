import * as fs from "node:fs";
import * as path from "node:path";

const input = fs.readFileSync(path.resolve("./3.txt"), "utf8");

const muRegExp = /mul\([0-9]+,[0-9]+\)|do\(\)|don't\(\)/g;


let result = 0;
let matched = input.match(muRegExp);
console.log("=>(3-1.js:11) matched", matched);
let canDo = true;
for (const matchedElement of matched) {
  if (matchedElement === "do()") {
    canDo = true;
  } else if (matchedElement === "don't()") {
    canDo = false;
  } else if (canDo) {
    const [, l, r] = matchedElement.match(/mul\(([0-9]+),([0-9]+)\)/);
    result += Number(l) * Number(r);
  }
}
console.log("=>(3-1.js:10) result", result);


