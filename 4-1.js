const fs = require("fs");

class Game {
    points = 0;
    times = 1;
    matchingCount = 0;
    winning = [];
    mine = [];

    constructor(line) {
        const [, winning, mine] = line.match(/Card\s+[0-9]+:\s+(.*?)\s+\|\s+(.*?)$/);
        this.winning = winning.replace(/\s+/g, " ").split(" ").map(s => +s.trim());
        this.mine = mine.replace(/\s+/g, " ").split(" ").map(s => +s.trim());
        const { points, matchingCount } = this.mine.reduce((agg, curr) => {
            if (this.winning.some(m => m === curr)) {
                agg.matchingCount++;
                if (agg.points === 0) {
                    agg.points = 1;
                }
                agg.points = agg.points * 2
            }
            return agg;
        }, { points: 0, matchingCount: 0 });
        this.points = points;
        this.matchingCount = matchingCount;
    }

}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);
    const games = lines.map(line => new Game(line));
    console.log("points", games.reduce((a, g) => a + g.points, 0));
    games.forEach((g, i) => {
        for (let j = 0; j < g.matchingCount; j++) {
            games[i + 1 + j].times = games[i + 1 + j].times + g.times;
        }
    });
    console.log("scratchCards", games.reduce((a, c) => a + (c.times || 0), 0));
}
resolve("./training/4.txt");
resolve("./data/4.txt");
// 53553 high
// 131448 high
