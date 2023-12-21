const fs = require("fs");

class Sequence {
    numbers = [];

    constructor(line) {
        this.numbers.push(line.split(" ").map(n => +n));
        let numbers = this.numbers[0];
        while (true) {
            const newNumbers = [];
            let isAllZero = true;
            for (let i = 0; i < numbers.length - 1; i++) {
                const item = numbers[i + 1] - numbers[i];
                isAllZero = isAllZero && item === 0;
                newNumbers.push(item);
            }
            this.numbers.push(newNumbers);
            numbers = [...newNumbers];
            if (isAllZero) {
                break;
            }
        }
    }

    predict() {
        this.numbers[this.numbers.length - 1][this.numbers[this.numbers.length - 1].length] = 0;
        for (let i = this.numbers.length - 2; i >= 0; i--) {
            this.numbers[i][this.numbers[i].length] =
                this.numbers[i][this.numbers[i].length - 1] +
                this.numbers[i + 1][this.numbers[i + 1].length - 1];
        }
        this.numbers[this.numbers.length - 1][0] = 0
        for (let i = this.numbers.length - 2; i >= 0; i--) {
            this.numbers[i].unshift(0);
            this.numbers[i][0] =
                this.numbers[i][1] -
                this.numbers[i+1][0];
        }
    }
}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);
    const sequences = lines.map(l => new Sequence(l));
    sequences.forEach(s=>s.predict());
    console.log(sequences.reduce((a, s) => a + s.numbers[0][s.numbers[0].length - 1], 0));
    console.log(sequences.reduce((a, s) => a + s.numbers[0][0], 0));
}
resolve("./training/9.txt");
resolve("./data/9.txt");
