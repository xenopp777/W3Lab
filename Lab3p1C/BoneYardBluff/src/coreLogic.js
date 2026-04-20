// CS233JS 4/9/26 edited by Zoie D

// -------------------- Constants --------------------
const STARTING_LIVES = 5;

// -------------------- Core Logic --------------------
// Domino object constructor used in gameLogic object
/**
 * Creates a new Domino object.
 * @param {number} leftPips - The number of pips on the left half of the domino.
 * @param {number} rightPips - The number of pips on the right half of the domino.
 * @returns {void}
 */
function Domino(leftPips, rightPips) {
  this.leftPips = leftPips;
  this.rightPips = rightPips;
}

export class GameLogic {
  constructor() {
    this.boneyard = [];
    this.currentDomino = null;
    this.nextDomino = null;
    this.score = 0;
    this.lives = STARTING_LIVES;
    this.isResolving = false;
    this.isGameOver = false;
  }

  /**
   * Fills the boneyard array with all standard dominos.
   * There are 6 X 6 dominos in a standard set.
   * Has no parameters and returns noting.
   */
  fillBoneyard() {
    // TODO: fill the boneyard array with domino objects and reset game state.
    this.boneyard = [];
    for (let l = 0; l <= 6; l++) {
      for (let r = l; r <= 6; r++) {
        this.boneyard.push(new Domino(l, r));
      }
    }
  }

  /**
   * Shuffles the dominoes in the boneyard randomly.
   * Has no parameters and eturns nothing.
   */
  shuffleBoneyard() {
    // TODO: shuffle the boneyard randomly.
    for (let i = 0; i < this.boneyard.length; i++) {
        let rndIndex = Math.trunc(Math.random() * this.boneyard.length);
        let temp = this.boneyard[i];
        this.boneyard[i] = this.boneyard[rndIndex];
        this.boneyard[rndIndex] = temp;
    }
  }

  /**
   * Deals the first two dominos out of the boneyard: one visible, one hidden.
   * Has no parameters and eturns nothing.
   */
  dealStartingDominos() {
    // TODO: Choose the two starting dominos, put them in currentDomino and nextDomino.
    this.shuffleBoneyard();
    this.currentDomino = this.boneyard.pop();
    this.nextDomino = this.boneyard.pop();
  }

  /**
   * Calculates the total sum of pips on a domino.
   * @param {Object} domino - The domino object to sum up.
   * @returns {number} The total number of pips (value of domino).
   */
  getTotalPips(domino) {
    // TODO: Add up the total value of the domino
    return domino.leftPips + domino.rightPips;
  }

  /**
   * Compares the next domino's total pips against the current domino's total pips
   * to determine if the player's guess ("high" or "low") was correct.
   * @param {string} guess - The player's guess, either "high" or "low".
   * @returns {boolean} Whether the guess was correct.
   */
  evaluateGuess(guess) {
    const currentTotal = this.getTotalPips(this.currentDomino);
    const nextTotal = this.getTotalPips(this.nextDomino);
    let isCorrect = false;
    // TODO: evaluate the guess and return whether it is correct.
    if (nextTotal === currentTotal) {
      isCorrect = true;
    } else if (guess === "high") {
      isCorrect = nextTotal > currentTotal;
    } else if (guess === "low") {
      isCorrect = nextTotal < currentTotal;
    }
    return isCorrect;
  }

  /**
   * Shifts the hidden domino into the visible spot, and draws a new hidden domino
   * if there are any remaining in the boneyard.
   * Returns nothing
   */
  advanceRound() {
    // TODO: advance to the next round by shifting dominos and drawing a new hidden domino.
    this.currentDomino = this.nextDomino;
    if (this.boneyard.length > 0) {
      this.nextDomino = this.boneyard.pop();
    } else {
      this.nextDomino = null;
    }
  }
};