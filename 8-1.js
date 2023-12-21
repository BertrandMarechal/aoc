const fs = require("fs");

class Point {
    name = "";
    left = "";
    right = "";
    constructor(line) {
        const [, name, left, right] = line.match(/(.*?) = \((.*?), (.*?)\)/);
        this.name = name;
        this.left = left;
        this.right = right;
    }


    get(side) {
        if (side === "left") {
            return this.left;
        }
        return this.right;
    }
}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);

    const [firstLine, ...otherLines] = lines;
    const commands = firstLine.split("").map((command) => command === "L" ? "left" : "right");

    const points = otherLines.map(line => new Point(line));
    let steps = 0;
    let commandIndex = 0;
    let point = points.find(({ name }) => name === "AAA");
    while(true) {
        // console.log(steps);
        steps++;
        point = points.find(({ name }) => name === point.get(commands[commandIndex]));
        if (point.name === "ZZZ") {
            break;
        }
        commandIndex++;
        if (commandIndex >= commands.length) {
            commandIndex = 0;
        }
    }
    console.log(steps);
}
resolve("./training/8-1-1.txt");
resolve("./training/8-1-2.txt");
resolve("./data/8.txt");
