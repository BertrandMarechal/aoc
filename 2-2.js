const fs = require("fs");
const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n").filter(Boolean);

    const games = [];
    for (const line of lines) {
        const [, gameId, setsStr] = line.match(/^Game ([0-9]+): (.*?)$/)
        const sets = setsStr.split("; ")
        const setsWithCubes = sets.map((set) => {
            const toReturn = {};
            const cubeCombinations = set.split(", ");
            for (const cubeCombination of cubeCombinations) {
                const [, n, color] = cubeCombination.match(/^([0-9]+) ([a-z]+)$/)
                if (toReturn[color]) {
                    toReturn[color] += +n;
                } else {
                    toReturn[color] = +n;
                }
            }
            return toReturn;
        })
        const { red, blue, green } = setsWithCubes.reduce((agg, { red, blue, green }) => {
            if (agg.red < red) {
                agg.red = red;
            }
            if (agg.blue < blue) {
                agg.blue = blue;
            }
            if (agg.green < green) {
                agg.green = green;
            }
            return agg
        }, { red: 0, blue: 0, green: 0 })
        games.push({
            id: +gameId,
            setsWithCubes,
            power: red * blue * green,
        });
    }
    console.log(games.reduce((agg, { power }) => agg + power, 0));
}
resolve("./training/2-1.txt");
resolve("./data/2.txt");
