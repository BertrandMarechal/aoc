import * as fs from "node:fs";

const testData = fs.readFileSync("./12-test.txt", "ascii").split("\n").filter(Boolean).map(l => l.split(""));
const testDataABBA = fs.readFileSync("./12-test-ABBA.txt", "ascii").split("\n").filter(Boolean).map(l => l.split(""));
const testDataABCDE = fs.readFileSync("./12-test-ABCDE.txt", "ascii").split("\n").filter(Boolean).map(l => l.split(""));
const testDataXO = fs.readFileSync("./12-test-XO.txt", "ascii").split("\n").filter(Boolean).map(l => l.split(""));
const testDataEX = fs.readFileSync("./12-test-EX.txt", "ascii").split("\n").filter(Boolean).map(l => l.split(""));
const realData = fs.readFileSync("./12.txt", "ascii").split("\n").filter(Boolean).map(l => l.split(""));

const LOG_LEVEL = 1;

function log(level: number, ...data: any[]) {
    if (level <= LOG_LEVEL) {
        let header = "";
        if (level > 0) {
            header = "└" + "-".repeat(level);
            console.log(header, ...data);
            return;
        }

        console.log(...data);
    }
}

class Region {
    count = 0;
    fenceCount = 0;
    index: number;
    parts: [number, number][] = [];

    constructor(index: number) {
        this.index = index;
    }
}

class CharData {
    index = 0;
    char: string;
    charCoordsToRegion: Record<string, number> = {};
    regions: Record<number, Region> = {};

    constructor(char: string) {
        this.char = char;
        log(3, `Created CharData for ${char}`);
    }

    private getRegion(x: number, y: number) {
        const up = `${x - 1}_${y}`;
        const down = `${x + 1}_${y}`;
        const left = `${x}_${y - 1}`;
        const right = `${x}_${y + 1}`;

        const regions = [left, up, down, right].map(position => this.charCoordsToRegion[position]).filter(Boolean).reduce((agg, curr) => {
            if (!agg.includes(curr)) {
                agg.push(curr);
            }
            return agg;
        }, []);
        regions.sort();
        if (regions.length === 0) {
            this.index++;

            const region = new Region(this.index);
            region.parts.push([x, y]);
            this.regions[this.index] = region;
            this.charCoordsToRegion[`${x}_${y}`] = region.index;
            return region;
        } else if (regions.length > 1) {
            this.mergeRegions(regions);
        }
        this.charCoordsToRegion[`${x}_${y}`] = regions[0];
        this.regions[regions[0]].parts.push([x, y]);
        return this.regions[regions[0]];

    }

    /**
     * Puts all the listed regions under the first one
     * @param indexes
     */
    private mergeRegions(indexes: number[]) {
        const orderedIndexes = [...indexes];
        orderedIndexes.sort();

        const referenceRegion = this.regions[orderedIndexes[0]];

        // starts at 1 to keep the first index as the reference
        for (let i = 1; i < orderedIndexes.length; i++) {
            const oldIndex = orderedIndexes[i];
            referenceRegion.count += this.regions[oldIndex].count;
            referenceRegion.fenceCount += this.regions[oldIndex].fenceCount;
            // move the charCoordsToRegion records
            Object.entries(this.charCoordsToRegion).forEach(([char, index]) => {
                if (index === oldIndex) {
                    this.charCoordsToRegion[char] = referenceRegion.index;
                }
            });
            // move the parts from region to region
            this.regions[oldIndex].parts.forEach(part => referenceRegion.parts.push(part));
            // remove the region record
            delete this.regions[oldIndex];
        }
    }

    processChar(data: string[][], x: number, y: number) {
        const region = this.getRegion(x, y);
        region.count++;
        region.fenceCount +=
            (data[x - 1]?.[y] === this.char ? 0 : 1) +
            (data[x + 1]?.[y] === this.char ? 0 : 1) +
            (data[x]?.[y - 1] === this.char ? 0 : 1) +
            (data[x]?.[y + 1] === this.char ? 0 : 1);
    }

    getValueForPerimeter(): number {
        let value = 0;
        for (let i = 0; i < this.index + 1; i++) {
            if (this.regions[`${i}`]) {
                value += this.regions[i].count * this.regions[i].fenceCount;
            }
        }
        return value;
    }



    getValueForSides(maxX: number, maxY: number): number {
        let value = 0;
        for (let i = 0; i < this.index + 1; i++) {
            const region = this.regions[`${i}`];
            if (region) {
                const parts = region.parts;

                let top = 0;
                let bottom = 0;
                let left = 0;
                let right = 0;
                // count the sides that have no parts at the top

                for (let j = 0; j < maxX; j++) {
                    for (let k = 0; k < maxY; k++) {
                        // find the part in the list
                        const isInList = parts.some(part => part[0] === j && part[1] === k);
                        const sameCharIsNotOnTheCheckedPartPosition = !parts.some(part => part[0] === j - 1 && part[1] === k);
                        const previousCellIsContainedInCharList = parts.some(part => part[0] === j && part[1] === k - 1);
                        const sameCharIsOnThePreviousCellCheckedPartPosition = parts.some(part => part[0] === j - 1 && part[1] === k - 1);

                        if (isInList) {
                            if (sameCharIsNotOnTheCheckedPartPosition) {
                                if (
                                    !previousCellIsContainedInCharList ||
                                    sameCharIsOnThePreviousCellCheckedPartPosition
                                ) {
                                    top++;
                                }
                            }
                        }
                    }
                }
                // count the sides that have no parts at the bottom
                for (let j = 0; j < maxX; j++) {
                    for (let k = 0; k < maxY; k++) {
                        // find the part in the list
                        const isInList = parts.some(part => part[0] === j && part[1] === k);
                        const sameCharIsNotOnTheCheckedPartPosition = !parts.some(part => part[0] === j + 1 && part[1] === k);
                        const previousCellIsContainedInCharList = parts.some(part => part[0] === j && part[1] === k - 1);
                        const sameCharIsOnThePreviousCellCheckedPartPosition = parts.some(part => part[0] === j + 1 && part[1] === k - 1);

                        if (isInList) {
                            if (sameCharIsNotOnTheCheckedPartPosition) {
                                if (
                                    !previousCellIsContainedInCharList ||
                                    sameCharIsOnThePreviousCellCheckedPartPosition
                                ) {
                                    bottom++;
                                }
                            }
                        }
                    }
                }
                // count the sides that have no parts at the left
                for (let j = 0; j < maxX; j++) {
                    for (let k = 0; k < maxY; k++) {
                        // find the part in the list
                        const isInList = parts.some(part => part[0] === j && part[1] === k);
                        const sameCharIsNotOnTheCheckedPartPosition = !parts.some(part => part[0] === j && part[1] === k - 1);
                        const previousCellIsContainedInCharList = parts.some(part => part[0] === j - 1 && part[1] === k);
                        const sameCharIsOnThePreviousCellCheckedPartPosition = parts.some(part => part[0] === j - 1 && part[1] === k - 1);

                        if (isInList) {
                            if (sameCharIsNotOnTheCheckedPartPosition) {
                                if (
                                    !previousCellIsContainedInCharList ||
                                    sameCharIsOnThePreviousCellCheckedPartPosition
                                ) {
                                    left++;
                                }
                            }
                        }
                    }
                }
                // count the sides that have no parts at the right
                for (let j = 0; j < maxX; j++) {
                    for (let k = 0; k < maxY; k++) {
                        // find the part in the list
                        const isInList = parts.some(part => part[0] === j && part[1] === k);
                        const sameCharIsNotOnTheCheckedPartPosition = !parts.some(part => part[0] === j && part[1] === k + 1);
                        const previousCellIsContainedInCharList = parts.some(part => part[0] === j - 1 && part[1] === k);
                        const sameCharIsOnThePreviousCellCheckedPartPosition = parts.some(part => part[0] === j - 1 && part[1] === k + 1);

                        if (isInList) {
                            if (sameCharIsNotOnTheCheckedPartPosition) {
                                if (
                                    !previousCellIsContainedInCharList ||
                                    sameCharIsOnThePreviousCellCheckedPartPosition
                                ) {
                                    right++;
                                }
                            }
                        }
                    }
                }
                value += (top + bottom + left + right) * parts.length;
                // console.log(this.char, top, bottom, left, right, parts.length, (top + bottom + left + right) * this.regions[`${i}`].parts.length);
            }
        }
        return value;
    }
}

function resolve1(data: string[][]): number {
    const map: Record<string, CharData> = {};
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            const char = data[i][j];
            if (!map[char]) {
                map[char] = new CharData(char);
            }
            map[char].processChar(data, i, j);
        }
    }
    return Object.values(map).reduce((agg, charData) => {
        return agg + charData.getValueForPerimeter();
    }, 0);
}

function resolve2(data: string[][]): number {
    const map: Record<string, CharData> = {};
    const maxX = data.length;
    const maxY = data[0].length;

    log(1, `Starting resolution`);
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            const char = data[i][j];
            if (!map[char]) {
                map[char] = new CharData(char);
            }
            map[char].processChar(data, i, j);
        }
    }
    const value = Object.values(map).reduce((agg, charData) => {
        return agg + charData.getValueForSides(maxX, maxY);
    }, 0);
    log(1, `Done`);
    return value;
}

log(0, "1 - Test\t \t- 1930", resolve1(testData));
log(0, "1 - Real\t \t- 1465968", resolve1(realData));

log(0, "2 - Test\t[EX]\t- 236", resolve2(testDataEX));
log(0, "2 - Test\t[XO]\t- 436", resolve2(testDataXO));
log(0, "2 - Test\t[ABBA]\t- 368", resolve2(testDataABBA));
log(0, "2 - Test\t[ABCDE]\t- 80", resolve2(testDataABCDE));
log(0, "2 - Test\t \t- 1206", resolve2(testData));
log(0, "2 - Real\t \t", resolve2(realData));