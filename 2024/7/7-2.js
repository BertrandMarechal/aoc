import fs from "node:fs";
import path from "node:path";

const operators = [ "*", "+", "||" ];

const input = fs.readFileSync(path.resolve("./7.txt"), "utf8");
const checkCombination = (combination, sum) => {
  let currentSum = combination[0];
  for (let i = 2; i <combination.length; i = i + 2) {
    if (combination[i - 1] === "+") {
      currentSum += combination[i]
    } else if (combination[i - 1] === "*") {
      currentSum *= combination[i]
    } else if (combination[i - 1] === "||") {
      currentSum = +`${currentSum}${combination[i]}`;
    }
  }
  return currentSum === sum;
};

const generateCombinations = (parts) => {
  if (parts.length === 1) return [parts[0]];

  const combinations = [];
  for (const operator of operators) {
    const restCombinations = generateCombinations(parts.slice(1));
    for (const rest of restCombinations) {
      if (Array.isArray(rest)) {
        combinations.push([parts[0], operator, ...rest]);
      } else {
        combinations.push([parts[0], operator, rest]);
      }
    }
  }
  return combinations;
};
const solveEquation = (equation) => {
  const combinations = generateCombinations(equation.parts);
  for (const generateCombination of combinations) {
    if (checkCombination(generateCombination, equation.sum)) {
      equation.validCounts++;
    }
  }
}

const parsed = input.split("\n").filter(Boolean).map((line) => {
  const [first, ...others] = line.split(" ");
  const sum = +first.replace(":", "");
  const parts = others.map((part) => +part);
  return { sum, parts, validCounts: 0 };
});
for (const parsedElement of parsed) {
  solveEquation(parsedElement);
}
console.log(parsed.reduce((acc, { validCounts, sum }) => acc + (validCounts > 0 ? sum : 0), 0));
