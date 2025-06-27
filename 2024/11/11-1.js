// const arrangement = "125 17";
const arrangement = "4189 413 82070 61 655813 7478611 0 8";
const iterations = 25;

console.log(arrangement);
let stones = arrangement.split(" ");
for (let i = 0; i < iterations; i++) {
    let newStones = [];
    for (const stone of stones) {
        if (stone === "0") {
            newStones.push("1");
        } else if (stone.length % 2 === 0) {
            newStones.push(`${+stone.slice(0, stone.length / 2)}`, `${+stone.slice(stone.length / 2, stone.length)}`);
        } else {
            newStones.push(`${+stone * 2024}`)
        }
    }
    // console.log(newStones.join(" "));
    stones = newStones;
}
console.log(stones.length);