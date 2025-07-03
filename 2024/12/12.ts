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

enum Direction {
    NorthWest = "north-west",
    SouthWest = "south-west",
    NorthEast = "north-east",
    SouthEast = "south-east",
    West = "west",
    East = "east",
    North = "north",
    South = "south",
}

enum NextPositionMode {
    External = "external",
    Internal = "internal",
}

class RegionMover {
    static getNextPosition(x: number, y: number, direction: Direction): { x: number; y: number } {
        switch (direction) {
            case Direction.West:
                return { x, y: y - 1 };
            case Direction.NorthWest:
                return { x: x - 1, y: y - 1 };
            case Direction.NorthEast:
                return { x: x - 1, y: y + 1 };
            case Direction.SouthWest:
                return { x: x + 1, y: y - 1 };
            case Direction.SouthEast:
                return { x: x + 1, y: y + 1 };
            case Direction.East:
                return { x, y: y + 1 };
            case Direction.North:
                return { x: x - 1, y };
            case Direction.South:
                return { x: x + 1, y };
        }
    }

    static getNextDirection(direction: Direction): Direction {
        switch (direction) {
            case Direction.West:
                return Direction.North;
            case Direction.East:
                return Direction.South;
            case Direction.North:
                return Direction.East;
            case Direction.South:
                return Direction.West;
        }
    }

    static getNextPositions(x: number, y: number, direction: Direction): {
        x: number,
        y: number,
        direction: Direction
    }[] {
        switch (direction) {
            case Direction.West:
                return [
                    { ...RegionMover.getNextPosition(x, y, Direction.South), direction: Direction.South },
                    { ...RegionMover.getNextPosition(x, y, Direction.West), direction: Direction.West },
                    { ...RegionMover.getNextPosition(x, y, Direction.North), direction: Direction.North },
                ];
            case Direction.East:
                return [
                    { ...RegionMover.getNextPosition(x, y, Direction.North), direction: Direction.North },
                    { ...RegionMover.getNextPosition(x, y, Direction.East), direction: Direction.East },
                    { ...RegionMover.getNextPosition(x, y, Direction.South), direction: Direction.South },
                ];
            case Direction.North:
                return [
                    { ...RegionMover.getNextPosition(x, y, Direction.West), direction: Direction.West },
                    { ...RegionMover.getNextPosition(x, y, Direction.North), direction: Direction.North },
                    { ...RegionMover.getNextPosition(x, y, Direction.East), direction: Direction.East },
                ];
            case Direction.South:
                return [
                    { ...RegionMover.getNextPosition(x, y, Direction.East), direction: Direction.East },
                    { ...RegionMover.getNextPosition(x, y, Direction.South), direction: Direction.South },
                    { ...RegionMover.getNextPosition(x, y, Direction.West), direction: Direction.West },
                ];
        }
    }

    static getNeighbourCoordinates(x: number, y: number): [number, number][] {
        return [
            [x - 1, y],
            [x + 1, y],
            [x, y + 1],
            [x, y - 1],
        ];
    }
}

class Region {
    count = 0;
    fenceCount = 0;
    sideCount = 0;
    sideFromHolesCount = 0;
    index: number;
    parts: [number, number][] = [];
    holes: [number, number][] = [];

    constructor(index: number) {
        this.index = index;
    }

    countExternalSides(data: string[][]) {
        this.findHoles(data.length, data[0].length);

        // start on the outer border
        const firstPart = this.parts[0];
        // We start from the first item which would be the north-west (NW) side, and try to move east (j+1)
        let currentPart = [...firstPart];
        let direction = Direction.East;
        let looped = false;
        this.sideCount = 1;
        const visitedParts: [number, number, Direction][] = [[...firstPart, direction]];

        let idx = 0;
        while (!looped && idx++ < 100) {
            let nextPositions = RegionMover.getNextPositions(currentPart[0], currentPart[1], direction);
            let nextPosition = nextPositions.find(pos => this.parts.some(part => part[0] === pos.x && part[1] === pos.y));
            if (!nextPosition) {
                // in that case we are on a tail => we set the same position as the currentPart, but we rotate
                nextPosition = {
                    x: currentPart[0],
                    y: currentPart[1],
                    direction: RegionMover.getNextDirection(direction),
                };
            }
            if (visitedParts.some(visitedPart => nextPosition.x === visitedPart[0] && nextPosition.y === visitedPart[1] && visitedPart[2] === nextPosition.direction)) {
                looped = true;
            } else {
                if (nextPosition.direction !== direction) {
                    log(4, `Changing direction from "${direction}" to "${nextPosition.direction}"`);
                    direction = nextPosition.direction;
                    this.sideCount++;
                }
                currentPart = [nextPosition.x, nextPosition.y];
                visitedParts.push([nextPosition.x, nextPosition.y, direction]);
            }
        }
    }

    /**
     * Goes through the limits of the region and see if there are some holes contained in the region
     */
    findHoles(dataSizeX: number, dataSizeY: number) {
        log(5, "find holes");
        const maxX = Math.min(dataSizeX, this.parts.reduce((agg, curr) => Math.max(agg, curr[0]), -Infinity));
        const minX = Math.max(0, this.parts.reduce((agg, curr) => Math.min(agg, curr[0]), Infinity));
        const maxY = Math.min(dataSizeY, this.parts.reduce((agg, curr) => Math.max(agg, curr[1]), -Infinity));
        const minY = Math.max(0, this.parts.reduce((agg, curr) => Math.min(agg, curr[1]), Infinity));

        // we take out the border ones as we are looking for holes inside the region
        for (let i = minX + 1; i < maxX; i++) {
            for (let j = minY + 1; j < maxY; j++) {
                if (!this.parts.some(part => part[0] === i && part[1] === j)) {
                    this.holes.push([i, j]);
                }
            }
        }
        // we now take out the holes that have neither parts nor holes as neighbours
        let allOk = false;
        while (!allOk) {
            let partsAndHoles = [
                ...this.parts,
                ...this.holes,
            ];
            allOk = true;
            for (let i = this.holes.length - 1; i >= 0; i--) {
                if (!RegionMover.getNeighbourCoordinates(this.holes[i][0], this.holes[i][1]).every(neighbour =>
                    partsAndHoles.some(partOrHole => partOrHole[0] === neighbour[0] && partOrHole[1] === neighbour[1])
                )) {
                    this.holes.splice(i, 1);
                    allOk = false;
                }
            }
        }
    }

    countExternalSidesFromRegionIfContained(region: Region) {
        const contained = region.parts.every(part => this.holes.some(hole => part[0] === hole[0] && part[1] === hole[1]));
        if (contained) {
            this.sideFromHolesCount += region.sideCount;
        }
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

    computeExternalSides(data: string[][]) {
        log(3, `computeExternalSides ${this.char}`);
        for (let i = 0; i < this.index + 1; i++) {
            if (this.regions[`${i}`]) {
                // calculate the external sides value
                log(4, `computeExternalSides for region ${i}`);
                this.regions[`${i}`].countExternalSides(data);
            }
        }
    }

    checkContainedRegions(map: Record<string, CharData>) {
        const regions = Object.values(map)
            // filter out our own data
            .filter(({ char }) => char !== this.char)
            // take all the regions
            .reduce((agg: Region[], curr: CharData) => {
                agg.push(...Object.values(curr.regions));
                return agg;
            }, []);

        for (let i = 0; i < this.index + 1; i++) {
            if (this.regions[`${i}`]) {
                for (const region of regions) {
                    this.regions[`${i}`].countExternalSidesFromRegionIfContained(region);
                }
            }
        }
    }

    getValueForSide(): number {
        let value = 0;
        for (let i = 0; i < this.index + 1; i++) {
            if (this.regions[`${i}`]) {
                // calculate the external sides value
                value += (this.regions[`${i}`].sideCount + this.regions[`${i}`].sideFromHolesCount) * this.regions[`${i}`].count;
                log(3, this.char, `${i}`, value, `(${this.regions[`${i}`].sideCount} + ${this.regions[`${i}`].sideFromHolesCount}) x ${this.regions[`${i}`].count}`);
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

    log(1, `Starting resolution`);
    log(2, `Starting processing data`);
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            const char = data[i][j];
            if (!map[char]) {
                map[char] = new CharData(char);
            }
            map[char].processChar(data, i, j);
        }
    }
    log(2, `Compute external sides`);
    // we compute the data relative to the external edge
    Object.values(map).forEach(mapItem => {
        mapItem.computeExternalSides(data);
    });
    log(2, `Check contained regions`);
    // we look for included holes
    Object.values(map).forEach(mapItem => {
        mapItem.checkContainedRegions(map);
    });
    log(2, `Get values`);
    const value = Object.values(map).reduce((agg, charData) => {
        return agg + charData.getValueForSide(data);
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