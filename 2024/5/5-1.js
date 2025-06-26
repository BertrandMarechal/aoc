import fs from "node:fs";
import path from "node:path";

const input = fs.readFileSync(path.resolve("./5.txt"), "utf8");

let pageCouplesProcessed = false;
const { pageCouples, pagesToProduce } = input.split("\n").reduce((acc, line) => {
  if (!pageCouplesProcessed && line === "") {
    pageCouplesProcessed = true;
  }
  if (line !== "") {
    if (pageCouplesProcessed) {
      acc.pagesToProduce.push(line.split(",").map(Number));
    } else {
      acc.pageCouples.push(line.split("|").map(Number));
    }
  }

  return acc;
}, {
  pageCouples: [],
  pagesToProduce: []
});

const getCorrectPageMiddlePageNumber = (pageToProduce) => {
  const isIncorrect = pageCouples.some(([page1, page2]) => {
    const page1Index = pageToProduce.indexOf(page1);
    if (page1Index !== -1) {
      const page2Index = pageToProduce.indexOf(page2);
      if (page2Index !== -1 && page1Index > page2Index) {
        return true;
      }
    }
    return false;
  });
  if (isIncorrect) {
    return 0;
  }
  const index = Math.floor(pageToProduce.length / 2);
  return pageToProduce[index];
};

console.log(pagesToProduce.reduce((acc, page) => acc + getCorrectPageMiddlePageNumber(page), 0));
