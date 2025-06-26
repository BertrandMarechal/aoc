import fs from "node:fs";
import path from "node:path";

const input = fs.readFileSync(path.resolve("./9.txt"), "utf8");
let index = 0;

function getChainItems(chain) {
    let item = chain;
    let values = [];
    while (item) {
        for (let i = 0; i < item.space; i++) {
            values.push(item.index === -1 ? 0 : item.index);
        }
        item = item.next;
    }
    return values;
}

class ChainItem {
    /**
     * {number}
     */
    space;
    /**
     * {number}
     */
    index;
    attemptedMove = false;
    /**
     * {ChainItem | undefined}
     */
    next;
    /**
     * {ChainItem | undefined}
     */
    previous;
    constructor(space, index) {
        this.space = space;
        this.index = index;
        this.attemptedMove = index === -1;
    }

    isEmpty() {
        return this.index === -1;
    }

    canMove() {
        return this.index !== -1 && !this.attemptedMove;
    }

    setNext(next) {
        this.next = next;
        if (next) {
            next.setPrevious(this);
        }
    }

    addSpace(space) {
        this.space += space;
    }

    removeSpace(space) {
        this.space -= space;
    }

    setPrevious(previous) {
        this.previous = previous;
    }

    toString() {
        let printable = `${this.index === -1 ? '.' : this.index}`.repeat(this.space);
        if (!this.next) {
            return printable;
        }
        return printable + this.next.toString();
    }

    /**
     * Puts an item in the empty space, and connects the previous and next properly
     * @param item
     */
    fitItemIn(item) {
        // we first start by adding space to the current item's next item
        item.next.addSpace(item.space);

        const itemsNext = item.next;

        // as item will be moved, we need to connect item.previous and item.next
        item.previous.setNext(itemsNext);

        // item.previous becomes this.previous through setNext
        this.previous.setNext(item);

        // item.next becomes this
        // this.previous becomes item through the setNext
        item.setNext(this);
        // this.next does not change

        // we now remove the space of the item in this
        this.removeSpace(item.space);
    }

    log() {
        console.log(this.j, this.index === -1 ? '.' : this.index, this.space, this.previous?.j, this.previous?.index, this.next?.index)
        if (this.next) {
            this.next.log();
        }
    }

    optimiseChain() {
        if (!this.next) {
            return;
        }
        if (this.index === -1) {
            if (this.next.index === -1) {
                // we merge the records
                this.addSpace(this.next.space);
                this.setNext(this.next.next);
            }
        } else {
            if (this.next.index !== -1) {
                // we now add a space
                const newItem = new ChainItem(0, -1);
                newItem.setNext(this.next);

                this.setNext(newItem);
            }
        }
        if (this.next) {
            return this.next;
        }
    }

    /**
     * @return {ChainItem | undefined}
     */
    getPreviousNotAttemptedBlock() {
        if (!this.previous) {
            return;
        }
        if (this.previous.attemptedMove) {
            return this.previous.getPreviousNotAttemptedBlock();
        }
        return this.previous;
    }
}

index = 0;
/**
 *
 * @type {ChainItem}
 */
let chain;

/**
 * Returns the last item in the chain
 * @return {ChainItem}
 */
function getLast() {
    let item = chain;
    while(item.next) {
        item = item.next;
    }
    return item;
}

let lastItem;
input.split("\n")[0].split("").forEach((n, i) => {
    if (i === 0) {
        chain = new ChainItem(+n, index);
        lastItem = chain;
        return;
    }
    if (i % 2 === 0) {
        index++;
        const newItem = new ChainItem(+n, index);
        lastItem.setNext(newItem);
        lastItem = newItem;
    } else {
        const newItem = new ChainItem(+n, -1);
        lastItem.setNext(newItem);
        lastItem = newItem;
    }
});

// we now add an empty block at the end of the list if it does not end with an empty block
if (!lastItem.isEmpty()) {
    lastItem.setNext(new ChainItem(0, -1));
}

let itemToOptimise = chain;
while(itemToOptimise) {
    itemToOptimise = itemToOptimise.optimiseChain();
}

/**
 * Returns a space that has enough empty blocks before the current object
 * @param {number} index
 * @param {number} space
 * @return {ChainItem | undefined}
 */
function getFittingSpace(index, space) {
    let item = chain;

    while(item.index !== index) {
        if (!item.isEmpty()) {
            item = item.next;
            continue;
        }
        if (item.space < space) {
            item = item.next;
            continue;
        }
        return item;
    }
}

let carryOn = true;
while (carryOn) {
    let item = getLast();

    while(item) {
        if (!item.canMove()) {
            item = item.getPreviousNotAttemptedBlock();
        } else {
            // else we try to move the item in an available place
            // we start to mark it as attempted

            // Save the next item
            const nextItem = item.previous;

            item.attemptedMove = true;

            const fittingSpace = getFittingSpace(item.index, item.space);
            if (fittingSpace) {
                // if we find a fitting space, we squeeze it in
                fittingSpace.fitItemIn(item);
                itemToOptimise = chain;
                while(itemToOptimise) {
                    itemToOptimise = itemToOptimise.optimiseChain();
                }
            }
            item = nextItem;
        }
    }
    carryOn = false;
}
const chainValues = getChainItems(chain);
console.log(chainValues.reduce((acc, char, i) => {
    return acc + (+char * i)
}, 0));