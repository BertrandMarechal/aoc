const fs = require("fs");
let commands = [];
let points = [];

const getProgress = () => {
    return points.reduce((a, c) => {
        for (let i = 0; i < commands.length; i++) {
            a.total++;
            a.done += !!c.distancesToZ[i] ? 1 : 0;
        }
        return a;
    }, { total: 0, done: 0 });
}

class Point {
    name = "";
    left = null;
    leftStr = null;
    right = null;
    rightStr = null;
    parents = { fromLeft: [], fromRight: [] };
    distancesToZ = [];
    isZ = false;
    isA = false;

    constructor(line) {
        const [, name, left, right] = line.match(/(.*?) = \((.*?), (.*?)\)/);
        this.name = name;
        this.leftStr = left;
        this.rightStr = right;

        this.isA = this.name.match(/A$/) && true || false;
        this.isZ = this.name.match(/Z$/) && true || false;
    }

    setDependencies() {
        this.parents.fromLeft = points.filter(({ leftStr }) => leftStr === this.name);
        this.parents.fromRight = points.filter(({ rightStr }) => rightStr === this.name);
        this.right = points.find(({ name }) => name === this.rightStr);
        this.left = points.find(({ name }) => name === this.leftStr);
    }

    get(side) {
        if (side === "left") {
            return this.left;
        }
        return this.right;
    }

    computeDistancesOneToZs() {
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            const next = this.get(command);
            if (next.isZ) {
                this.distancesToZ[i] = 1;
            }
        }
    }

    computeDistancesToZs() {
        for (let i = 0; i < commands.length; i++) {
            if (!this.distancesToZ[i]) {
                const command = commands[i];
                const next = this.get(command);
                if (next.distancesToZ[(i + 1) % commands.length]) {
                    this.distancesToZ[i] = next.distancesToZ[(i + 1) % commands.length] + 1;
                }
            }
        }
    }
}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);

    const [firstLine, ...otherLines] = lines;
    commands = firstLine.split("").map((command) => command === "L" ? "left" : "right");

    points = otherLines.map(line => new Point(line));
    for (const point of points) {
        point.setDependencies(points);
    }
    console.log("computeDistancesOneToZs");
    for (const point of points) {
        point.computeDistancesOneToZs();
    }
    console.log("computeDistancesOneToZs Done");
    let progress = getProgress();
    let done = false;
    let currentDone = progress.done;
    console.log("computeDistancesToZs");
    while (!done) {
        for (const point of points) {
            point.computeDistancesToZs();
        }
        progress = getProgress();
        if (currentDone === progress.done || progress.total === progress.done) {
            done = true;
        }
        currentDone = progress.done;
    }
    console.log("computeDistancesToZs Done");

    let currentPoints = points.filter(p => p.isA);
    let commandIndex = 0;
    let steps = 0;
    while (true) {
        const minDistance = currentPoints
            .map(p => p.distancesToZ[commandIndex])
            .reduce(
                (a, d) => d < a ? d : a,
                Infinity
            );
        if (minDistance === Infinity) {
            console.log(steps, commandIndex, currentPoints
                .map(p => p.distancesToZ[commandIndex]));
            process.exit(1);
        }
        for (let i = 0; i < minDistance; i++) {
            steps++;
            commandIndex = commandIndex % commands.length;
            const command = commands[commandIndex];
            currentPoints = currentPoints.map(p => p.get(command));
            commandIndex++;
            if (commandIndex > commands.length - 1) {
                commandIndex = 0;
            }
        }
        if (currentPoints.every(p => p.isZ)) {
            break;
        }
    }
    console.log("results", steps);
}
resolve("./training/8-2.txt");
resolve("./data/8.txt");
