import * as fs from "node:fs";

const BUTTON_REGEXP = /Button [AB]: X\+([0-9]+), Y\+([0-9]+)/;
const PRIZE_REGEXP = /Prize: X=([0-9]+), Y=([0-9]+)/;

const aButtonCost = 3;
const bButtonCost = 1;
const maxButtonPush = 100;

class V2 {
    x: number;
    y: number;

    constructor([x, y]: [string, string]) {
        this.x = +x;
        this.y = +y;
    }

}

class ClawMachine {
    a: V2;
    b: V2;
    prize: V2;

    constructor(set: string) {
        const [buttonALine, buttonBLine, prizeLine] = set.split("\n");
        const [, ...aInput] = buttonALine.match(BUTTON_REGEXP);
        const [, ...bInput] = buttonBLine.match(BUTTON_REGEXP);
        const [, ...prizeInput] = prizeLine.match(PRIZE_REGEXP);
        this.a = new V2(aInput as [string, string]);
        this.b = new V2(bInput as [string, string]);
        this.prize = new V2(prizeInput as [string, string]);
    }

    findLowestOption() {
        let lowestCost = Infinity;
        /*
            We need to find the solutions to the following equations:
            ta x xa + tb x xb = xp
            ta x ya + tb x yb = yp
         */
        const combinations: { tapOnA: number; tapOnB: number; cost: number }[] = [];
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
                const px = i * this.a.x + j * this.b.x;
                const py = i * this.a.y + j * this.b.y;

                if (px === this.prize.x && py === this.prize.y) {
                    const cost = i * aButtonCost + j * bButtonCost;
                    combinations.push({ tapOnA: i, tapOnB: j, cost });
                    lowestCost = Math.min(lowestCost, cost);
                }
            }
        }
        if (lowestCost === Infinity) {
            return 0;
        }
        return lowestCost;
    }
}

function parseData(data: string): ClawMachine[] {
    return data.split("\n\n").map(set => new ClawMachine(set));
}

const testData = parseData(fs.readFileSync("./13-test.txt", "ascii"));
const realData = parseData(fs.readFileSync("./13.txt", "ascii"));

console.log("1 - Test - 480", testData.reduce((agg, clawMachine) => {
    return agg + clawMachine.findLowestOption();
}, 0));
console.log("1 - Real - ?", realData.reduce((agg, clawMachine) => {
    return agg + clawMachine.findLowestOption();
}, 0));
