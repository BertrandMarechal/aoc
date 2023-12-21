const fs = require("fs");
const maxCubesPerColor = {
    red: 12,
    green: 13,
    blue: 14,
};
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
        games.push({
            id: +gameId,
            setsWithCubes
        });
    }
    const possibleGames = games.filter(({ setsWithCubes }) => {
        return !setsWithCubes.some(({ red, green, blue }) =>
            ((red || 0) > maxCubesPerColor.red) ||
            ((green || 0) > maxCubesPerColor.green) ||
            ((blue || 0) > maxCubesPerColor.blue)
        )
    })
    console.log(possibleGames.reduce((agg, {id}) => agg + id, 0));
}
resolve("./training/2-1.txt");
resolve("./data/2.txt");
