const fs = require("fs");
class Mapping {
    source = 0;
    target = 0;
    range = 0;
    constructor(source, target, range) {
        this.source = source;
        this.target = target;
        this.range = range;
    }
    isSourceIn(source) {
        return source >= this.source && source <= this.source + this.range;
    }

    getTargetValue(source) {
        return this.target + source - this.source;
    }
}
class World {
    mappings = {
        "seed-to-soil": [],
        "soil-to-fertilizer": [],
        "fertilizer-to-water": [],
        "water-to-light": [],
        "light-to-temperature": [],
        "temperature-to-humidity": [],
        "humidity-to-location": [],
    }
    minLocation = Infinity;

    constructor(lines, seedMode = "exhaustive") {
        let currentType = "";
        for (let i = 1; i < lines.length; i++) {
            const typeMatch = lines[i].match(/([a-z-]+)\smap:/);
            const lineNumbersMatch = lines[i].match(/([0-9]+)\s+([0-9]+)\s+([0-9]+)/);
            if (typeMatch) {
                currentType = typeMatch[1];
            } else if (lineNumbersMatch) {
                const target = +lineNumbersMatch[1];
                const source = +lineNumbersMatch[2];
                const range = +lineNumbersMatch[3];
                this.mappings[currentType].push(new Mapping(source, target, range));
            }
        }

        const [,...seeds] = lines[0].split(/\s+/).map(seed => +seed);
        if (seedMode === "exhaustive") {

            for (const seed of seeds) {
                this.getLowestLocation(seed);
            }
        } else {
            console.log("seeds.length",seeds.length);
            for (let i = 0; i < seeds.length; i += 2) {
                console.log("seeds",i);
                for (let j = seeds[i]; j < seeds[i] + seeds[i + 1]; j++) {
                    this.getLowestLocation(j);
                }
            }
        }
    }

    getLowestLocation(seed) {
        const paths = [
            "seed-to-soil",
            "soil-to-fertilizer",
            "fertilizer-to-water",
            "water-to-light",
            "light-to-temperature",
            "temperature-to-humidity",
            "humidity-to-location",
        ];
        let currentValue = seed;
        // console.log(currentValue);
        for (const path of paths) {
            currentValue = this.getMappingValue(path, currentValue);
        }
        if (currentValue < this.minLocation) {
            this.minLocation = currentValue;
        }
    }

    getMappingValue(type, value) {
        for (const mapping of this.mappings[type]) {
            if (mapping.isSourceIn(value)) {
                return mapping.getTargetValue(value);
            }
        }
        return value;
    }
}

const resolve = (inputFile) => {
    const file = fs.readFileSync(inputFile, "ascii");
    const lines = file.split("\n")
        .filter(Boolean);

    const world = new World(lines);
    console.log(world.minLocation);
    const world2 = new World(lines, "pairs");
    console.log(world2.minLocation);
}
resolve("./training/5.txt");
resolve("./data/5.txt");
