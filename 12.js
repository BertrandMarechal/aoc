const fs = require("fs");

class HotSpring {
    status = ".";

    constructor(status) {
        this.status = status;
    }

    toString() {

    }
}

class Line {
    hotSprings = [];
    groups = [];
    arrangementCounts = 0;
    line = "";

    constructor(line) {
        const [hotSprings, groups] = line.split(" ");
        this.hotSprings = hotSprings.split("").map(c => new HotSpring(c));
        this.groups = groups.split(",").map(n => +n);
        this.resolveObviousHotSprings();
        this.setArrangementCounts();
    }

    resolveObviousHotSprings() {
        let currentBrokenOrUnknownGroups = [[]];

        this.hotSprings.forEach((hotSpring, i) => {
            if (hotSpring.status !== ".") {
                currentBrokenOrUnknownGroups[currentBrokenOrUnknownGroups.length - 1].push(hotSpring);
            } else {
                currentBrokenOrUnknownGroups.push([]);
            }
        });
        // filter out the empty groups
        currentBrokenOrUnknownGroups = currentBrokenOrUnknownGroups.filter(g => g.length);

        // resolve the groups that have exactly the correct number of items
        currentBrokenOrUnknownGroups.forEach((group, i) => {
            if (group.length === this.groups[i]) {
                group.forEach(h => h.status = "#");
            }
        });

        // resolve the groups that have the proper
    }

    setArrangementCounts() {
        this.hotSprings.map(({status}) => status);
    }

    toString() {
        return this.hotSprings.map(({status}) => status).join("");
    }
}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);
    const linesItems = lines.map(line => new Line(line));
    linesItems.forEach(l => console.log(l.toString()));
}
resolve("./training/12.txt");
// resolve("./data/12.txt");
