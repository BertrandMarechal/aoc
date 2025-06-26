import * as fs from "node:fs";
import * as path from "node:path";

const input = fs.readFileSync(path.resolve("./4.txt"), "utf8");

const inputMapped = input
  .split("\n")
  .filter(a => a.length).map(line => line.split("").map(l => l.match(/[XMAS]/) ? l : ""));


const hasXmas = (i, j) => {
  if (inputMapped[i][j] !== "A") {
    return false;
  }
  if (!inputMapped[i - 1] || !inputMapped[i + 1]) {
    return false;
  }
  if (!inputMapped[i][j - 1] || !inputMapped[i][j + 1]) {
    return false;
  }
  // S
  if (inputMapped[i - 1][j - 1] === "S" && inputMapped[i - 1][j + 1] === "S" && inputMapped[i + 1][j - 1] === "M" && inputMapped[i + 1][j + 1] === "M") {
    return true;
  }
  // N
  if (inputMapped[i - 1][j - 1] === "M" && inputMapped[i - 1][j + 1] === "M" && inputMapped[i + 1][j - 1] === "S" && inputMapped[i + 1][j + 1] === "S") {
    return true;
  }
  // E
  if (inputMapped[i - 1][j - 1] === "M" && inputMapped[i - 1][j + 1] === "S" && inputMapped[i + 1][j - 1] === "M" && inputMapped[i + 1][j + 1] === "S") {
    return true;
  }
  if (inputMapped[i - 1][j - 1] === "S" && inputMapped[i - 1][j + 1] === "M" && inputMapped[i + 1][j - 1] === "S" && inputMapped[i + 1][j + 1] === "M") {
    return true;
  }
  return false;
};

let result = 0;
let xMap = [];
for (let i = 0; i < inputMapped.length; i++) {
  xMap.push([]);
  for (let j = 0; j < inputMapped[i].length; j++) {
    const count = hasXmas(i, j) ? 1 : 0;
    result += count;
  }
}

console.log("=>(4-1.js:92) result", result);
