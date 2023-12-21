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
const typePowerMapping = {
    "Five of a kind": 700,
    "Four of a kind":600,
    "Full house": 500,
    "Three of a kind": 400,
    "Two pair": 300,
    "One pair": 200,
    "High card": 100,
}

class Hand {
    hand = "";
    type = null;
    bid = null;
    cardPowers = [];
    typePower = 0;
    constructor(line) {
        const [hand, bid] = line.split(" ");
        this.hand = hand;
        this.cardPowers = hand.split("").map(card => cardPowerMapping[card]);
        this.computeType();
        this.bid = +bid;
    }

    computeType() {
        const keys = this.cardPowers.reduce((agg, curr) => {
            if (agg[curr]) {
                agg[curr]++;
            } else {
                agg[curr] = 1;
            }
            return agg;
        }, {});

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
        this.typePower = typePowerMapping[this.type];
    }
}

const sorter = (a, b) => {
    if (a.typePower !== b.typePower) {
        return a.typePower - b.typePower;
    }
    let i = 0;
    while(a.cardPowers[i] === b.cardPowers[i]) {
        i++;
    }
    return a.cardPowers[i] - b.cardPowers[i];
}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);

    const hands = lines.map(line => new Hand(line));
    hands.sort(sorter);
    console.log(hands.reduce((agg, {bid}, i) =>agg + bid * (i + 1), 0));
}
resolve("./training/7.txt");
resolve("./data/7.txt");
