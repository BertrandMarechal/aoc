const fs = require("fs");

const directions = [
    "up",
    "down",
    "left",
    "right",
];
const opositeDirection = {
    "up": "down",
    "down": "up",
    "left": "right",
    "right": "left",
}

class Tile {
    cell = "";
    isPipe = false;
    isStart = false;
    isGround = false;
    distanceOnLoop = -1;
    open = {
        up: false,
        down: false,
        left: false,
        right: false,
    };
    neighbours = {
        up: undefined,
        down: undefined,
        left: undefined,
        right: undefined,
    };

    constructor(cell) {
        this.cell = cell;
        if (cell === ".") {
            this.isGround = true;
        } else if (cell === "S") {
            this.isPipe = true;
            this.isStart = true;
            this.distanceOnLoop = 0;
        } else {
            this.open.up = ["|", "L", "J",].includes(cell);
            this.open.down = ["|", "7", "F",].includes(cell);
            this.open.left = ["-", "J", "7",].includes(cell);
            this.open.right = ["-", "L", "F",].includes(cell);
        }
    }

    setNeighbours(neighbours) {
        this.neighbours = neighbours;
        if (this.isStart) {
            this.open.up = this.neighbours.up?.open.down || false;
            this.open.down = this.neighbours.down?.open.up || false;
            this.open.left = this.neighbours.left?.open.right || false;
            this.open.right = this.neighbours.right?.open.left || false;
        }
    }
}

class Map {
    tiles = [];
    loopSize = 0;

    constructor(lines) {
        for (let line of lines) {
            const lienTiles = line.split("").map(cell => new Tile(cell))
            this.tiles.push(lienTiles);
            if (!this.start) {
                const start = lienTiles.find(tile => tile.isStart)
                if (start) {
                    this.start = start;
                }
            }
        }
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j].setNeighbours({
                    up: this.tiles[i - 1]?.[j],
                    down: this.tiles[i + 1]?.[j],
                    left: this.tiles[i][j - 1],
                    right: this.tiles[i][j + 1],
                })
            }
        }
        this.findLoop();
    }

    findLoop() {
        const paths = [
            this.start.open.up ? {
                done: false,
                isLoop: false,
                distance: 0,
                cameThrough: "down",
                points: [this.start.neighbours.up]
            } : null,
            this.start.open.down ? {
                done: false,
                isLoop: false,
                distance: 0,
                cameThrough: "up",
                points: [this.start.neighbours.down]
            } : null,
            this.start.open.left ? {
                done: false,
                isLoop: false,
                distance: 0,
                cameThrough: "right",
                points: [this.start.neighbours.left]
            } : null,
            this.start.open.right ? {
                done: false,
                isLoop: false,
                distance: 0,
                cameThrough: "left",
                points: [this.start.neighbours.right]
            } : null,
        ].filter(Boolean);

        while (true) {
            let allDone = true;
            for (const path of paths) {
                if (path.done) {
                    continue;
                }
                const currentPoint = path.points[path.points.length - 1];
                const { cameThrough, point } = directions.reduce((a, d) => {
                    if (a) {
                        return a;
                    }
                    if (d === path.cameThrough) {
                        return;
                    }
                    if (currentPoint.open[d]) {
                        return { cameThrough: opositeDirection[d], point: currentPoint.neighbours[d] };
                    }
                }, undefined);
                if (!point) {
                    path.done = true;
                    path.isLoop = false;
                } else {
                    path.cameThrough = cameThrough;
                    path.points.push(point);
                    path.distance++;
                    if (point.distanceOnLoop > 0) {
                        path.done = true;
                        path.isLoop = true;
                    } else {
                        point.distanceOnLoop = path.distance;
                    }
                }
                allDone = allDone && path.done;
            }
            if (allDone) {
                break;
            }
        }

        this.loopSize = paths.find(p => p.isLoop).distance;
    }
}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);
    const map = new Map(lines);
    console.log(map.loopSize);
}
resolve("./training/10-1-1.txt");
resolve("./training/10-1-2.txt");
resolve("./data/10.txt");
