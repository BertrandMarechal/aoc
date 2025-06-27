const arrangement = "125 17";
// const arrangement = "4189 413 82070 61 655813 7478611 0 8";
const iterations = 25;
const LOG_LEVEL = 1;
console.log("Arrangement", arrangement);

function log(level, ...args) {
    if (level <= LOG_LEVEL) {
        let delta = "";
        if (level > 0) {
            delta = " -".repeat(level);
        }
        console.log(delta, ...args);
    }
}

function getNextStones(stoneStr) {
    const stonesToAdd = [];
    if (stoneStr === "0") {
        stonesToAdd.push("1");
    } else if (stoneStr.length % 2 === 0) {
        stonesToAdd.push(
            `${+stoneStr.slice(0, stoneStr.length / 2)}`,
            `${+stoneStr.slice(stoneStr.length / 2, stoneStr.length)}`
        );
    } else {
        stonesToAdd.push(`${+stoneStr * 2024}`);
    }
    return stonesToAdd;
}

function getStoneCount() {
    let stoneCount = 0;
    let stone = rootStone;
    while (stone) {
        stoneCount++;
        stone = stone.sibling
    }
    return stoneCount;
}
function getFinalStoneCount() {
    let stoneCount = 0;
    let stone = rootStone;
    while (stone) {
        if (!stone.isKnown) {
            stoneCount++;
            log(4, `Counting 1 stone for ${stone.stoneStr}`);
        } else {
            stoneCount += knownStonesMap[stone.stoneStr].stonesCountPerLevel[stone.level];
            log(4, `Counting ${knownStonesMap[stone.stoneStr].stonesCountPerLevel[stone.level]} stones for ${stone.stoneStr} at level ${stone.level}`);
        }
        stone = stone.sibling
    }
    return stoneCount;
}
function getFinalStoneStr() {
    let stoneStr = "";
    let stone = rootStone;
    while (stone) {
        if (!stone.isKnown) {
            stoneStr+=` ${stone.stoneStr}`;
        } else {
            stoneStr+=` ${knownStonesMap[stone.stoneStr].stonesPerLevel[stone.level]}`;
        }
        stone = stone.sibling
    }
    return stoneStr.replace(/\s+/g, " ");
}

function getStoneStr() {
    let stoneStr = "";
    let stone = rootStone;
    stoneStr = stone.stoneStr;
    stone = stone.sibling
    while (stone) {
        stoneStr += ` ${stone.stoneStr}`;
        stone = stone.sibling
    }
    return stoneStr;
}

class KnownStone {
    stoneStr = 0;
    stonesCountPerLevel = [];
    stonesPerLevel = [];
    isResolved = false;

    constructor(stoneStr, minLevel) {
        this.minLevel = minLevel
        this.stoneStr = stoneStr
        log(6, `Added stone ${stoneStr} to known stones for level ${minLevel}`);
    }

    setMinLevel(minLevel) {
        if (this.minLevel > minLevel) {
            log(6, `Changed known stone ${this.stoneStr} level from ${this.minLevel} to ${minLevel}`);
            this.minLevel = minLevel;
            this.isResolved = false;
        }
    }

    resolve() {
        log(5, `Resolving ${this.stoneStr}`);
        if (this.isResolved) {
            return this.stonesCountPerLevel.length;
        }
        this.stonesCountPerLevel[iterations] = 1;
        this.stonesPerLevel[iterations] = this.stoneStr;
        log(6, `Level ${iterations}, count: 1`);
        this.isResolved = true;
        let resolvedCount = 0;
        let isResolved = false;
        for (let i = iterations - 1; i >= this.minLevel - 1; i--) {
            if (this.stonesCountPerLevel[i]) {
                continue;
            }
            isResolved = true;
            const nextStones = getNextStones(this.stoneStr);
            this.stonesCountPerLevel[i] = 0;
            this.stonesPerLevel[i] = "";
            for (const nextStone of nextStones) {
                new Stone(nextStone, i + 1);
                if (knownStonesMap[nextStone].stonesCountPerLevel[i+1]) {
                    this.stonesCountPerLevel[i]+= knownStonesMap[nextStone].stonesCountPerLevel[i+1];
                    this.stonesPerLevel[i] += ` ${knownStonesMap[nextStone].stonesPerLevel[i+1]}`
                } else {
                    log(6, `Level ${i}, Missing count for ${nextStone}`);
                    this.isResolved = false;
                    isResolved = false;
                }
            }
            if (isResolved) {
                this.stonesPerLevel[i].trim();
                log(6, `Level ${i}, count: ${this.stonesCountPerLevel[i]}`);
                resolvedCount++;
            }
        }
        if (this.isResolved) {
            log(5, `${this.stoneStr} Resolved`);
        } else {
            log(5, `${this.stoneStr} NOT Resolved`);
        }
        return resolvedCount;
    }
}

/**
 *
 * @type {{[string]: KnownStone}}
 */
const knownStonesMap = {};

class Stone {
    /**
     * {string}
     */
    stoneStr;
    level = 0;
    /**
     * {Stone}
     */
    sibling;
    isKnown = false;

    constructor(stoneStr, level = 0) {
        this.stoneStr = stoneStr;
        this.level = level;

        if (!knownStonesMap[stoneStr]) {
            knownStonesMap[stoneStr] = new KnownStone(stoneStr, level);
        } else {
            this.isKnown = true;
            knownStonesMap[stoneStr].setMinLevel(level)
        }
    }

    getNextStones() {
        const stonesToAdd = getNextStones(this.stoneStr).map(s => new Stone(s, this.level + 1));
        log(5, `Stone ${this.stoneStr} generated ${stonesToAdd.length} stones`);
        return stonesToAdd;
    }

    addSibling(sibling) {
        if (!this.sibling) {
            log(5, `Adding sibling ${sibling.stoneStr} to ${this.stoneStr}`);
            this.sibling = sibling;
            return;
        }
        let siblingToAddTo = this.sibling;
        while (siblingToAddTo.sibling) {
            siblingToAddTo = siblingToAddTo.sibling;
        }
        log(5, `Adding sibling ${sibling.stoneStr} to nested sibling ${siblingToAddTo.stoneStr}`);
        siblingToAddTo.sibling = sibling;
    }

    clone() {
        const newStone = new Stone(this.stoneStr, this.level);
        return newStone;
    }
}
function resolveKnownStones() {
    log(0, `Resolving known stones`);
    let allResolved = false;
    let index = 0;
    while(!allResolved) {
        index++
        allResolved = true;
        let knownStones = Object.values(knownStonesMap);
        let resolvedCount = 0;
        let resolvedGranularCount = 0;
        for (let knownStone of knownStones) {
            resolvedGranularCount += knownStone.resolve();
            resolvedCount += knownStone.isResolved ? 1 : 0;
            allResolved = allResolved && knownStone.isResolved;
        }
        log(1, `Iteration ${index}, total: ${knownStones.length}, resolved: ${resolvedCount}, resolved granular: ${resolvedGranularCount}`);
    }
}

let inputStones = arrangement.split(" ").map(s => new Stone(s));
let rootStone = inputStones[0];
for (let i = 1; i < inputStones.length; i++) {
    rootStone.addSibling(inputStones[i]);
}

log(0, `Getting stones`);
for (let i = 0; i < iterations; i++) {
    log(1, `Iteration ${i + 1} starting`);
    let stone = rootStone;
    let newRoot;
    while (stone) {
        if (!newRoot) {
            log(2, `No root is set up, selecting one`);
            if (stone.isKnown) {
                log(3, `The initial stone is known, it will be the root`);
                newRoot = stone.clone();
            } else {
                log(3, `The initial stone is not known, it generates stones`);
                const stonesToAdd = stone.getNextStones();
                newRoot = stonesToAdd[0];
                for (let j = 1; j < stonesToAdd.length; j++) {
                    newRoot.addSibling(stonesToAdd[j]);
                }
            }
        } else {
            if (stone.isKnown) {
                log(2, `Stone ${stone.stoneStr} is known, we add it to the previous stone`);
                newRoot.addSibling(stone.clone());
            } else {
                log(2, `Stone ${stone.stoneStr} is NOT known, we generate the next stones and add them as siblings`);
                const stonesToAdd = stone.getNextStones();
                newRoot.addSibling(stonesToAdd[0]);
                for (let j = 1; j < stonesToAdd.length; j++) {
                    stonesToAdd[j - 1].addSibling(stonesToAdd[j]);
                }
            }
        }

        stone = stone.sibling;
    }
    rootStone = newRoot;
}

// we now resolve the known stones
resolveKnownStones()

log(-1, `Stone count: ${getFinalStoneCount()}`);
log(-1, `Stones: ${getFinalStoneStr()}`);