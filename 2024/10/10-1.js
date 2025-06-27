import fs from "node:fs";
import path from "node:path";

const input = fs.readFileSync(path.resolve("./10.txt"), "utf8");
const inputParsed = input.split("\n").filter(Boolean).reduce((acc, line, i) => {
    acc.push(line.split("").map(cell => +cell))
    return acc;
}, []);

let trailheads = [];

function optimisePaths() {
    for (let i = 0; i < inputParsed.length; i++) {
        for (let j = 0; j < inputParsed[0].length; j++) {
            let hasDeltaAsOne = false;
            if (i > 0) {
                hasDeltaAsOne = hasDeltaAsOne || Math.abs(inputParsed[i - 1][j] - inputParsed[i][j]) === 1;
            }
            if (i < inputParsed.length - 1) {
                hasDeltaAsOne = hasDeltaAsOne || Math.abs(inputParsed[i + 1][j] - inputParsed[i][j]) === 1;
            }
            if (j > 0) {
                hasDeltaAsOne = hasDeltaAsOne || Math.abs(inputParsed[i][j - 1] - inputParsed[i][j]) === 1;
            }
            if (j < inputParsed[0].length - 1) {
                hasDeltaAsOne = hasDeltaAsOne || Math.abs(inputParsed[i][j + 1] - inputParsed[i][j]) === 1;
            }
            if (!hasDeltaAsOne) {
                inputParsed[i][j] = -1;
            }
        }
    }
}

function logInputParsed() {
    // console.log(inputParsed.map(line => line.map(c => c === -1 ? "." : c).join("")).join("\n"))
}

function findTrailheads() {
    for (let i = 0; i < inputParsed.length; i++) {
        for (let j = 0; j < inputParsed[0].length; j++) {
            if (inputParsed[i][j] === 0) {
                trailheads.push([i, j]);
            }
        }
    }
}

function progress([x, y], value = 0) {
    const objectives = [];
    const coords = [
        [x, y + 1],
        [x, y - 1],
        [x + 1, y],
        [x - 1, y],
    ];
    for (let coord of coords) {
        if (inputParsed[coord[0]]?.[coord[1]] === value + 1) {
            if (value === 8) {
                objectives.push([coord[0], coord[1]]);
            } else {
                objectives.push(...progress([coord[0], coord[1]], value + 1))
            }
        }
    }
    return objectives;
}

function getTrailHeadScore([x, y]) {
    const objectives = progress([x, y]);
    const uniqueObjectives = objectives.reduce((agg, curr) => {
        if (!agg.some(([aX, aY]) => curr[0] === aX && curr[1] === aY)) {
            agg.push(curr);
        }
        return agg
    }, []);
    return uniqueObjectives.length;
}


logInputParsed();
optimisePaths();
logInputParsed();
findTrailheads();

// trailheads = [trailheads[0]];

const trailHeadScore = trailheads.map(getTrailHeadScore);
console.log(trailHeadScore.reduce((agg, curr) => {
    return agg + curr
}, 0))