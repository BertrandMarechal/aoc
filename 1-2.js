const fs = require("fs");
const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const numbersMapping = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9
    };
    const lines = file.split("\n").filter(Boolean);
    const sum = lines.reduce((agg, line) => {
        const matches = line.match(/one|two|three|four|five|six|seven|eight|nine|[0-9]/g);
        const firstDigit = isNaN(+matches[0]) ? numbersMapping[matches[0]] : +matches[0];

        //trying to get the real last digit
        let lastDigit = 0;
        let slice = "";
        let sliceStart = 1;
        while(!lastDigit) {
            slice = line.slice(-1 * sliceStart);
            const lastMatches = slice.match(/one|two|three|four|five|six|seven|eight|nine|[0-9]/g);
            if (lastMatches) {
                lastDigit = isNaN(+lastMatches[0]) ? numbersMapping[lastMatches[0]] : +lastMatches[0];
            }
            sliceStart++
        }
        return agg + (+(`${firstDigit}${lastDigit}`));
    }, 0);
    console.log(inputFile, sum);
}

resolve("./training/1-2.txt");
resolve("./data/1.txt");
