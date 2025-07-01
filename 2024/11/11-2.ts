// const arrangement = "125 17";
const arrangement = "4189 413 82070 61 655813 7478611 0 8";
const iterations = 75;

class Stone {
    stoneName: string;
    combinations: Record<number, number> = {};

    constructor(stoneName: string) {
        this.stoneName = stoneName;
    }

    /**
     * Returns the count of stones for the level
     * @param level
     */
    getCount(level: number): number {
        // if we are at level 0, then the count is 1
        if (level === 0) {
            return 1;
        }
        // if we already know the count, we just return it
        if (this.combinations[level]) {
            return this.combinations[level];
        }
        // initialise the count
        this.combinations[level] = 0;
        // get the next stones
        const nextStones = Stone.getNextStones(this.stoneName);
        let count = 0;
        for (const nextStone of nextStones) {
            // check if the stones already exist. if not, it creates them
            // todo we are updating a global variable, can be improved
            if (!knownStones[nextStone]) {
                knownStones[nextStone] = new Stone(nextStone);
            }
            // add the count to the overall count
            // todo careful with call stack limits here
            count += knownStones[nextStone].getCount(level - 1);
        }
        this.combinations[level] = count;
        return count;
    }

    static getNextStones(stoneStr: string): string[] {
        if (stoneStr === "0") {
            // 0 gets converted to 1
            return ["1"];
        } else if (stoneStr.length % 2 === 0) {
            // stones of even length get split
            return [
                `${+stoneStr.slice(0, stoneStr.length / 2)}`,
                `${+stoneStr.slice(stoneStr.length / 2, stoneStr.length)}`
            ];
        }
        // else, stones get multiplied by 2024
        return [`${+stoneStr * 2024}`];
    }
}

const stones = arrangement.split(" ");
const knownStones: Record<string, Stone> = {};
let count = 0;
stones.forEach(stone => {
    knownStones[stone] = new Stone(stone);
    count += knownStones[stone].getCount(iterations);
});

console.log(count);