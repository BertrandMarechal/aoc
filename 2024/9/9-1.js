import fs from "node:fs";
import path from "node:path";

const input = fs.readFileSync(path.resolve("./9.txt"), "utf8");
let index = 0;
const inputParsed = input.split("\n")[0].split("").reduce((acc, char, i) => {
  const val = +char;
  if (i % 2 === 0) {
    for (let j = 0; j < val; j++) {
      acc.push(index);
    }
    index++;
  } else {
    for (let j = 0; j < val; j++) {
      acc.push(".");
    }
  }
  return acc;
}, []);
console.log(inputParsed);

let current = [...inputParsed];
while(current[current.length - 1] === ".") {
  current.pop();
}
for (let i = 0; i < current.length; i++) {
  if (current[i] === ".") {
    current[i] = current[current.length - 1];
    current.pop();
    while(current[current.length - 1] === ".") {
      current.pop();
    }
  }
}
console.log(current.reduce((acc, char, i) => acc + (+char) * i, 0));
