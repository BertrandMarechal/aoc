const fs = require("fs");

class Star {
    i = 0;
    j = 0;

    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
}

class Galaxy {
    stars = [];
    expandBy = 1;
    size = 0;

    constructor(lines, expandBy = 1) {
        this.expandBy = expandBy === 1 ? 2 : expandBy;
        this.size = lines.length;
        for (let i = 0; i < this.size; i++) {
            const line = lines[i];
            for (let j = 0; j < this.size; j++) {
                if (line[j] === "#") {
                    this.stars.push(new Star(i, j));
                }
            }
        }
        this.expand();
    }

    expand() {
        for (let i = this.size - 1; i >= 0; i--) {
            let hasStars = this.stars.some((star) => star.i === i);
            if (!hasStars) {
                this.stars.forEach(star => {
                    if (star.i > i) {
                        star.i += this.expandBy - 1;
                    }
                });
            }
            hasStars = this.stars.some((star) => star.j === i);
            if (!hasStars) {
                this.stars.forEach(star => {
                    if (star.j > i) {
                        star.j += this.expandBy - 1;
                    }
                });
            }
        }
    }

    getDistanceSum() {
        const doneDistances = {};
        let total = 0;
        for (let i = 0; i < this.stars.length; i++) {
            for (let j = 0; j < this.stars.length; j++) {
                if (i !== j && !doneDistances[i + "_" + j] && !doneDistances[j + "_" + i]) {
                    total +=
                        Math.abs(this.stars[i].i - this.stars[j].i) +
                        Math.abs(this.stars[i].j - this.stars[j].j);
                    doneDistances[i + "_" + j] = true;
                    doneDistances[j + "_" + i] = true;
                }
            }
        }
        return total;
    }
}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);
    const expandBys = [
        1, 10, 100, 1000000
    ];
    expandBys.forEach(e => {
        const galaxy = new Galaxy(lines, e);
        console.log(e, galaxy.getDistanceSum());
    });
}
resolve("./training/11.txt");
resolve("./data/11.txt");
