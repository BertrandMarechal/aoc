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

const incorrectPages = pagesToProduce.filter((pages) => getCorrectPageMiddlePageNumber(pages) === 0);

const fixIncorrectPage = (pages) => {
  let pageNumbers = [...pages];
  let count = 0;
  while (getCorrectPageMiddlePageNumber(pageNumbers) === 0) {
    count++;
    const incorrectTuple = pageCouples.find(([page1, page2]) => {
      const page1Index = pageNumbers.indexOf(page1);
      if (page1Index !== -1) {
        const page2Index = pageNumbers.indexOf(page2);
        if (page2Index !== -1 && page1Index > page2Index) {
          return true;
        }
      }
      return false;
    });
    const [page1, page2] = incorrectTuple;
    const page1Index = pageNumbers.indexOf(page1);
    const page2Index = pageNumbers.indexOf(page2);
    const page1ToInsert = pageNumbers[page1Index];
    const page2ToInsert = pageNumbers[page2Index];
    pageNumbers.splice(page1Index, 1, page2ToInsert);
    pageNumbers.splice(page2Index, 1, page1ToInsert);
  }
  const index = Math.floor(pageNumbers.length / 2);
  return pageNumbers[index];
}

console.log(incorrectPages.reduce((acc, page) => acc + fixIncorrectPage(page), 0));
