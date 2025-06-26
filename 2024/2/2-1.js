import * as fs from "node:fs";
import * as path from "node:path";

const input = fs.readFileSync(path.resolve('./2.txt'), 'utf8');
const inputMapped = input.split('\n').filter(a => a.length).map(line => line.split(' ').map(Number));

const minDelta = 1;
const maxDelta = 3;

const isSafe = (arr) => {
  if (arr[0] === arr[1]) {
    return false;
  }
  const isDecreasing = arr[1] < arr[0] ;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1] && isDecreasing) {
      return false;
    } else if (arr[i] < arr[i - 1] && !isDecreasing) {
      return false;
    }
    const delta = Math.abs(arr[i] - arr[i-1]);
    if (delta > maxDelta || delta < minDelta) {
      return false;
    }
  }
  return true;
}

const result = inputMapped.reduce((a,c, i) => {
  if (isSafe(c)) {
    return a + 1;
  }
  return a;
}, 0);
console.log("=>(2-1.js:35) result", result);
