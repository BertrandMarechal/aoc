import fs from "node:fs";
import path from "node:path";

const input = fs.readFileSync(path.resolve("./6.txt"), "utf8");

let guardPosition = [0, 0];
let guardDirection = "";
const parsed = input.split("\n").filter(Boolean).map((line, i) => {
  return line.split("").map((char, j) => {
    if (char !== "." && char !== "#") {
      guardPosition = [i, j];
      if (char === "^") {
        guardDirection = "N";
      } else if (char === ">") {
        guardDirection = "E";
      } else if (char === "<") {
        guardDirection = "W";
      } else if (char === "v") {
        guardDirection = "S";
      }
    }
    return ({
      visited: char !== "." && char !== "#",
      isObstacle: char === "#",
    });
  });
});

const moveGuard = (delta = 1) => {
  if (guardDirection === "N") {
    guardPosition[0] -= delta;
  } else if (guardDirection === "S") {
    guardPosition[0] += delta;
  } else if (guardDirection === "E") {
    guardPosition[1] += delta;
  } else if (guardDirection === "W") {
    guardPosition[1] -= delta;
  }
};
const backUpAndTurnGuard = () => {
  moveGuard(-1);
  if (guardDirection === "N") {
    guardDirection = "E";
  } else if (guardDirection === "S") {
    guardDirection = "W";
  } else if (guardDirection === "E") {
    guardDirection = "S";
  } else if (guardDirection === "W") {
    guardDirection = "N";
  }
};

let out = false;
while (!out) {
  moveGuard();
  if (guardPosition[0] === -1 || guardPosition[0] > parsed.length - 1 || guardPosition[1] < 0 || guardPosition[1] > parsed[0].length - 1) {
    out = true;
  } else {
    const { isObstacle } = parsed[guardPosition[0]][guardPosition[1]];
    if (isObstacle) {
      backUpAndTurnGuard();
    } else {
      parsed[guardPosition[0]][guardPosition[1]].visited = true;
    }
  }
}

console.log(parsed.flat().filter(({ visited }) => visited).length);
