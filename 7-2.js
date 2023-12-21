const fs = require("fs");

const cardPowerMapping = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "T": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14,
}
const cardPowerMappingWithJs = {
    "J": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "T": 10,
    "Q": 12,
    "K": 13,
    "A": 14,
}
const typePowerMapping = {
    "Five of a kind": 7,
    "Four of a kind":6,
    "Full house": 5,
    "Three of a kind": 4,
    "Two pair": 3,
    "One pair": 2,
    "High card": 1,
}

class Hand {
    hand = "";
    hash = "";
    type = null;
    bid = null;
    cardPowers = [];
    typePower = 0;
    constructor(line, dealWithJs) {
        const [hand, bid] = line.split(" ");
        this.hand = hand;
        this.cardPowers = hand.split("").map(card => dealWithJs ? cardPowerMappingWithJs[card] : cardPowerMapping[card]);
        this.bid = +bid;

        this.computeType(dealWithJs);
        this.typePower = typePowerMapping[this.type];
        this.hash = `${this.typePower}`+ this.cardPowers.map(p => p < 10 ? `0${p}` : `${p}`).join("");
    }

    computeType(dealWithJs = false) {
        const keys = this.cardPowers.reduce((agg, curr) => {
            if (agg[curr]) {
                agg[curr]++;
            } else {
                agg[curr] = 1;
            }
            return agg;
        }, {});
        if (dealWithJs) {
            const js = keys[cardPowerMappingWithJs["J"]];
            if (js !== 5) {
                delete keys[cardPowerMappingWithJs["J"]];
                const maxCardPower = this.cardPowers.reduce((agg, c) => c > agg ? c : agg, -Infinity);
                keys[maxCardPower] += js;
            }
        }

        switch (Object.keys(keys).length) {
            case 1:
                this.type = "Five of a kind";
                break;
            case 2:
                if (keys[Object.keys(keys)[0]] === 1 || keys[Object.keys(keys)[0]] === 4) {
                    this.type = "Four of a kind";
                } else {
                    this.type = "Full house";
                }
                break;
            case 3:
                if (Object.keys(keys).some(key => keys[key] === 3)) {
                    this.type = "Three of a kind";
                } else {
                    this.type = "Two pair";
                }
                break;
            case 4:
                this.type = "One pair"
                break;
            case 5:
                this.type = "High card"
                break;
        }
    }
}

const sorter = (a, b) => {
    if (a.hash > b.hash) {
        return 1;
    }
    if (a.hash < b.hash) {
        return -1;
    }
    return 0;
}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);

    const hands = lines.map(line => new Hand(line, true));
    hands.sort(sorter);
    console.log(hands.filter(({hash}) => hash.startsWith("2")).map(({ hand, hash }) => ({ hand, hash })));
    console.log(hands.reduce((agg, {bid}, i) =>agg + bid * (i + 1), 0));

    /*
* Question 2
*/
    const strengths2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];
    const camelCards2 = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    const strings = lines
    for(let i = 0; i < strings.length; i++) {
        const hand = strings[i].split(' ')[0];
        let numJs = 0;
        const tally = hand.split('').reduce((acc, c, i, arr) => {
            c == 'J' ? numJs++ : acc[c] ? acc[c]++ : acc[c] = 1;

            if (i == arr.length - 1) {
                acc = Object.values(acc)
                if (numJs) {
                    acc.sort().reverse();
                    acc[0] += numJs;
                }
            }
            return acc;
        }, {})

        switch(tally.length) {
            case 5:
                camelCards2[7].push(strings[i]);
                break;
            case 4:
                camelCards2[6].push(strings[i]);
                break;
            case 3:
                tally.find((x) =>  x === 3)
                    ? camelCards2[4].push(strings[i])
                    : camelCards2[5].push(strings[i]);
                break;
            case 2:
                tally.find((x) => x === 4)
                    ? camelCards2[2].push(strings[i])
                    : camelCards2[3].push(strings[i]);
                break;
            default:
                camelCards2[1].push(strings[i]);
                break;
        }
    }

    let sum2 = [];
    for (const x in camelCards2) {
        const order = camelCards2[x].sort((a, b) => {
            const cur = a.split(' ')
            const next= b.split(' ')
            for (let i = 0; i < cur[0].length; i++) {
                const curIndx = strengths2.findIndex((x) => x == cur[0][i]);
                const nextIndx = strengths2.findIndex((x) => x == next[0][i]);
                if (curIndx < nextIndx) return -1;
                if (curIndx > nextIndx) return 1;
                continue;
            }
        })
        sum2 = [...sum2, ...order];
    }

    const ans2 = sum2.reverse().reduce((acc, c, i) => acc += c.split(' ')[1] * (i + 1), 0)

    console.log(ans2)
}
resolve("./training/7.txt");
resolve("./data/7.txt");
//250075891 low
