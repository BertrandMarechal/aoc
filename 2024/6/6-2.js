import fs from "node:fs";
import path from "node:path";

const input = fs.readFileSync(path.resolve("./6.txt"), "utf8");
let initialGuardPosition = [0, 0];
let initialGuardDirection = "";
let guardPosition = [0, 0];
let guardDirection = "";
let validObstaclePositions = [];

const grid = input.split("\n").filter(Boolean).map((line, i) => {
  return line.split("").map((char, j) => {
    if (char !== "." && char !== "#") {
      initialGuardPosition = [i, j];
      if (char === "^") {
        initialGuardDirection = "N";
      } else if (char === ">") {
        initialGuardDirection = "E";
      } else if (char === "<") {
        initialGuardDirection = "W";
      } else if (char === "v") {
        initialGuardDirection = "S";
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

const makeGrid = (newObstaclePosition) => {
  if (!newObstaclePosition) {
    return grid.map((row) => row.map((cell) => ({
      ...cell,
      visitedFrom: [],
    })))
  }
  return grid.map((row, i) => row.map((cell, j) => ({
    ...cell,
    isObstacle: i === newObstaclePosition[0] && j === newObstaclePosition[1] ? true : cell.isObstacle,
    visitedFrom: [],
  })))
};

const makeGuardRoute = (newObstaclePosition) => {
  guardPosition = [...initialGuardPosition];
  guardDirection = initialGuardDirection;
  const newGrid = makeGrid(newObstaclePosition);
  const currentPath = [];
  let out = false;
  let loop = false;

  while (!out && !loop) {
    moveGuard();
    if (guardPosition[0] === -1 || guardPosition[0] > newGrid.length - 1 || guardPosition[1] < 0 || guardPosition[1] > newGrid[0].length - 1) {
      out = true;
    } else {
      const { isObstacle } = newGrid[guardPosition[0]][guardPosition[1]];
      if (isObstacle) {
        backUpAndTurnGuard();
      } else {
        currentPath.push([...guardPosition]);
        if (!newGrid[guardPosition[0]][guardPosition[1]].visitedFrom.includes(guardDirection)) {
          newGrid[guardPosition[0]][guardPosition[1]].visitedFrom.push(guardDirection);
        } else {
          loop = true;
        }
      }
    }
  }
  if (loop) {
    validObstaclePositions.push(newObstaclePosition);
  }
  return currentPath;
};
const guardPath = makeGuardRoute();

for (const guardPathItem of guardPath) {
  if (validObstaclePositions.some((item) => item[0] === guardPathItem[0] && item[1] === guardPathItem[1])) {
    continue;
  } else if (initialGuardPosition[0] === guardPathItem[0] && initialGuardPosition[1] === guardPathItem[1]) {
    continue;
  }
  makeGuardRoute(guardPathItem);
}
console.log(validObstaclePositions.length);

const s = [
  // [6, 3],
  // [7, 6],
  // [8, 3],
  // [8, 1],
  // [7, 7],
  [9, 7],
];
