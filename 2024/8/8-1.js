import fs from "node:fs";
import path from "node:path";

const input = fs.readFileSync(path.resolve("./8.txt"), "utf8");
const antennas = {};
const inputParsed = input.split("\n")
  .filter(Boolean)
  .map((line, i) => {
    const chars = line.split("")
    chars.forEach((char, j) => char === '.' ? null : antennas[char] = [...antennas[char] || [], [i, j]]);
    return chars;
  });

let antinodes = [];
const isInBoundary = (i, j) => {
  return i >= 0 && i < inputParsed.length && j >= 0 && j < inputParsed[0].length;
}
const addAntinodes = () => {
  Object.keys(antennas).forEach((key) => {
    const antennasOfType = antennas[key];
    for (let i = 0; i < antennasOfType.length; i++) {
      const [x, y] = antennasOfType[i];
      for (let j = 0; j < antennasOfType.length; j++) {
        if (i !== j) {
          const [x2, y2] = antennasOfType[j];
          const dx = x2 - x;
          const dy = y2 - y;

          let newX = x2 + dx;
          let newY = y2 + dy;
          if (isInBoundary(newX, newY)) {
            antinodes.push([newX, newY])
          }
          newX = x - dx;
          newY = y - dy;
          if (isInBoundary(newX, newY)) {
            antinodes.push([newX, newY])
          }
        }
      }
    }
  })
}

addAntinodes();

console.log(antinodes.reduce((a, c) => {
  const code = `${c[0]}_${c[1]}`;
  if (!a.includes(code)) {
    a.push(code);
  }
  return a;
}, []).length);
// 428 too high
