const fs = require("fs");
const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n").filter(Boolean);
    const sum = lines.reduce((agg, line) => {
        const [, firstDiGit] = line.match(/^[a-z]*([0-9])/);
        const [, lastDiGit] = line.match(/([0-9])[a-z]*$/);
        return agg + (+(firstDiGit+lastDiGit));
    }, 0);
    console.log(inputFile, sum);
}
resolve("./training/1-1.txt");
resolve("./data/1.txt");
