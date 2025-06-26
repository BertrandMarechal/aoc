import * as fs from "node:fs";
import * as path from "node:path";

const input = fs.readFileSync(path.resolve("./4.txt"), "utf8");
const xmas = "XMAS".split("");

const orientations = [
  "N",
  "N-E",
  "E",
  "S-E",
  "S",
  "S-W",
  "W",
  "N-W",
];

const inputMapped = input
  .split("\n")
  .filter(a => a.length).map(line => line.split("").map(l => l.match(/[XMAS]/) ? l : ""));

const getArray = (i, j, orientation) => {
  let arr = [];
  let index = 0;
  let li = i;
  let lj = j;
  while (index < xmas.length) {
    if (!inputMapped[li]) {
      return null;
    }
    if (!inputMapped[li][lj]) {
      return null;
    }
    arr.push(inputMapped[li][lj]);
    switch (orientation) {
      case "N":
        li--;
        break;
      case "N-E":
        li--;
        lj++;
        break;
      case "E":
        lj++;
        break;
      case "S-E":
        li++;
        lj++;
        break;
      case "S":
        li++;
        break;
      case "S-W":
        li++;
        lj--;
        break;
      case "W":
        lj--;
        break;
      case "N-W":
        li--;
        lj--;
        break;
    }
    index++;
  }
  return arr;
};

const checkArray = (arr) => {
  if (arr === null) {
    return false;
  }
  return arr.every((a,i) => a === xmas[i]);
}

const countXmasesForXmas = (i, j) => {
  if (inputMapped[i][j] !== xmas[0]) {
    return 0;
  }

  return orientations.reduce((agg, orientation) => {
    const arr = getArray(i, j, orientation);
    const hasXmas = checkArray(arr);
    return agg + (hasXmas ? 1 : 0);
  }, 0);
};

let result = 0;
let xMap = [];
for (let i = 0; i < inputMapped.length; i++) {
  xMap.push([]);
  for (let j = 0; j < inputMapped[i].length; j++) {
    const count = countXmasesForXmas(i, j);
    if (count > 0) {
      xMap[i].push(count.toString());
    } else {
      xMap[i].push(".");
    }
    result += count;
  }
}
// console.log(xMap.map(l => l.join("")).join("\n"));

console.log("=>(4-1.js:92) result", result);
