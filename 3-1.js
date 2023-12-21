const fs = require("fs");

class Point {
    i = 0;
    j = 0;

    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
}

class Part {
    start = new Point();
    end = new Point();
    value = null;
    isIn = false;
    id=0

    constructor(id, i, j, v) {
        this.id = id
        this.start = new Point(i, j);
        this.end = new Point(i, j);
        this.value = +v;
    }

    addCell(i, j, v) {
        this.end = new Point(i, j);
        this.value = +`${this.value}${v}`;
    }

    setIsInIfIn(symbol) {
        if (this.isInBBox(symbol.point.i, symbol.point.j)) {
            this.isIn = true;
            symbol.addPartIfNotIn(this);
        }
    }

    isInBBox(i, j) {
        if (this.start.i - 1 <= i && this.start.i + 1 >= i) {
            if (this.start.j - 1 <= j && this.end.j + 1 >= j) {
                return true;
            }
        }
        return false
    }
}

class Symbol {
    point = null;
    symbol = "";
    parts = []

    constructor(i, j, symbol) {
        this.point = new Point(i, j);
        this.symbol = symbol
    }

    isGear() {
        return this.symbol === "*" && this.parts.length === 2;
    }

    getGearRatio () {
        return this.parts[0].value * this.parts[1].value;
    }

    addPartIfNotIn(part) {
        if (!this.parts.some(({ id }) => id === part.id)) {
            this.parts.push(part);
        }
    }
}

class Grid {
    symbols = []
    parts = []

    constructor(lines) {
        let n = 0
        lines.forEach((line, i) => {
            let currentPart = null
            line.split("").forEach((char, j) => {
                let addPart = true;
                if (char.match(/[0-9]/)) {
                    if (!currentPart) {
                        currentPart = new Part(n++,i, j, char);
                    } else {
                        currentPart.addCell(i, j, char);
                    }
                    addPart = false;
                } else if (char !== ".") {
                    this.symbols.push(new Symbol(i, j, char));
                }
                if (addPart && currentPart) {
                    this.parts.push(currentPart);
                    currentPart = null;
                }
            });
            if (currentPart) {
                this.parts.push(currentPart);
            }
        });
        this.symbols.forEach(symbol => {
            this.parts.forEach((part) => {
                part.setIsInIfIn(symbol);
            });
        });
    }

    getPartsSum() {
        console.log("parts sum", this.parts.reduce((agg, { isIn, value }) => {
            if (!isIn) {
                return agg;
            }
            return agg + value;
        }, 0));
    }

    getGearRationSum() {
        console.log("gear ratio sum", this.symbols.reduce((agg, symbol) => {
            if (!symbol.isGear()) {
                return agg;
            }
            return agg + symbol.getGearRatio();
        }, 0));
    }
}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);
    const grid = new Grid(lines);
    grid.getPartsSum();
    grid.getGearRationSum();
}
resolve("./training/3-1.txt");
resolve("./data/3.txt");

// 519763 too low
// 508676 too low
