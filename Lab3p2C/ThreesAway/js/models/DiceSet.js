// Edited by Zoie D 4/17/26 with AI assistance of copilot

import Die from './Die.js';

export default class DiceSet {
    constructor() {
        this.dice = [];
        for (let i = 0; i < 5; i++) {
            this.dice.push(new Die());
        }

        this.isComplete = false;
    }

    rollAll() {
        for (const die of this.dice) {
            die.roll();
        }

        this.autoHoldThrees();
        this.evaluateDice();
    }

    autoHoldThrees() {
        for (const die of this.dice) {
            if (die.value === 3 && !die.isHeld) {
                die.hold();
            }
        }
    }

    evaluateDice() {
        this.isComplete = this.dice.every(die => die.isHeld);
    }

    hasHeldDice() {
        return this.dice.some(die => die.isHeld);
    }

    isTurnComplete() {
        return this.isComplete;
    }

    canHold(die) {
        return true;
    }

    canUnhold(die) {
        if (die.value === 3) {
            return 'All 3s must stay held.';
        }
        return true;
    }

    getScore() {
        let total = 0;
        for (const die of this.dice) {
            total += die.value === 3 ? 0 : die.value;
        }
        return total;
    }

    reset() {
        this.isComplete = false;

        for (const die of this.dice) {
            die.reset();
        }
    }
}
