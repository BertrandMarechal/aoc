import * as fs from "node:fs";

const BUTTON_REGEXP = /Button [AB]: X\+([0-9]+), Y\+([0-9]+)/;
const PRIZE_REGEXP = /Prize: X=([0-9]+), Y=([0-9]+)/;

const aButtonCost = 3;
const bButtonCost = 1;
const deltaPrize = 10000000000000;

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
        this.prize = new V2([`${+prizeInput[0] + deltaPrize}`, `${+prizeInput[1] + deltaPrize}`]);
    }

    findLowestOption() {
        /*
            We need to find the solutions to the following equations:
            ta => Touches on A
            tb => Touches on B
            xa => Amount of units on X when we touch A
            xb => Amount of units on X when we touch B
            ya => Amount of units on Y when we touch A
            yb => Amount of units on Y when we touch B

            1) ta x xa + tb x xb = xp
            2) ta x ya + tb x yb = yp

            => from 1 we get
                ta = (xp - tb x xb) / xa
            => applying that to 2 we get
                (xp - tb x xb) / xa x ya + tb x yb = yp
                xp / xa x ya - tb x xb / xa x ya + tb x yb = yp
                tb x (yb - tb x xb / xa x ya) = yp - xp / xa x ya
                tb = (yp - xp x ya / xa ) / (yb - xb x ya / xa )
         */
        const touchesOnB = Math.round((this.prize.y - this.prize.x * this.a.y / this.a.x) / (this.b.y - this.b.x * this.a.y / this.a.x));
        const touchesOnA = Math.round((this.prize.x - touchesOnB * this.b.x) / this.a.x);
        // this only works if touches on B.s rounded value works
        if (touchesOnB * this.b.x + touchesOnA * this.a.x !== this.prize.x) {
            return 0;
        }
        if (touchesOnB * this.b.y + touchesOnA * this.a.y !== this.prize.y) {
            return 0;
        }
        return touchesOnA * aButtonCost + touchesOnB * bButtonCost;
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
