const fs = require("fs");
class Race {
    time = 0
    distance = 0;
    waysToWinCount = 0;

    constructor(time, distance) {
        this.time = time;
        this.distance = distance;
        this.calculateWaysToWin();
    }

    calculateWaysToWin() {
        for (let i = 0; i < this.time + 1; i++) {
            const d = i * (this.time - i);
            if (d > this.distance) {
                this.waysToWinCount++;
            }
        }
    }

}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);
    const [, time] = lines[0].replace(/\s+/g, "").split(":");
    const [, distance] = lines[1].replace(/\s+/g, "").split(":");
    const race = new Race(+time, +distance);
    console.log(race.waysToWinCount);

}
resolve("./training/6.txt");
resolve("./data/6.txt");
