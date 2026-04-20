// CS233JS 4/9/26 edited by Zoie D

// -------------------- Constants --------------------
// PIP_LAYOUTS maps one half of a domino numerical value (properties 0-6) to the specific
// spots in a 3 x 3 grid where pips (dots) should be placed to represent that number.

// The values in the array represent pip locations in the grid:
//   1 2 3  (top row)
//   4 5 6  (middle row)
//   7 8 9  (bottom row)
const PIP_LAYOUTS = {
  0: [],
  1: [5],
  2: [3, 7],
  3: [3, 5, 7],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

// -------------------- UI --------------------
// The ui object handles all interaction with the HTML document
// It only modifies visual elements and relies on gameLogic for data.
export class Ui {
  constructor () {
    this.leftDominoElement = null;
    this.rightDominoElement = null;
    this.statusElement = null;
    this.highButton = null;
    this.lowButton = null;
    this.resetButton = null;
  }

  /**
   * Caches references to DOM elements used frequently in the UI,
   * assigning them to properties of the ui object to improve performance.
   * @returns {void}
   */
  cacheDominoElements() {
    this.leftDominoElement = document.getElementById("left-domino");
    this.rightDominoElement = document.getElementById("right-domino");
    this.statusElement = document.getElementById("status");
    this.highButton = document.getElementById("high-btn");
    this.lowButton = document.getElementById("low-btn");
    this.resetButton = document.getElementById("reset-btn");
  }

  /**
   * Builds the HTML for one half of a domino, generating the grid cells.
   * Based on the pipCount, it adds a "pip" class to the correct cell positions.
   * @param {number} pipCount - Total number of pips required (usually 0 to 6).
   * @returns {string} The raw HTML string representing half of a domino.
   */
  buildHalfHTML(pipCount) {
    let html = '<div class="domino-half">';
    for (let pos = 1; pos <= 9; pos++) {
      let hasPip = PIP_LAYOUTS[pipCount].includes(pos);
      html += '<span class="pip-cell' + (hasPip ? " pip" : "") + '"></span>';
    }
    html += "</div>";
    return html;
  }
  /**
   * Builds the complete HTML layout structure of a face-up domino.
   * It takes a domino object to generate the pip counts for both halves,
   * and inserts a divider line between them.
   * @param {Object} domino - The domino object to visually render.
   * @returns {string} The full HTML string representing a rendered domino.
   */
  buildDominoFaceHTML(domino) {
    const left = domino.leftPips;
    const right = domino.rightPips;

    return (
      '<div class="domino-face">' +
      this.buildHalfHTML(left) +
      '<div class="domino-divider"></div>' +
      this.buildHalfHTML(right) +
      "</div>"
    );
  }

  /**
   * Shows a domino face up in the left domino element slot.
   * @param {Object} domino - The domino object to reveal.
   * @returns {void}
   */
  showLeftDomino(domino) {
    this.leftDominoElement.innerHTML = this.buildDominoFaceHTML(domino);
    this.leftDominoElement.classList.remove("back");
  }

  /**
   * Displays the right-side domino face down (its back cover).
   * @returns {void}
   */
  showRightDominoBack() {
    this.rightDominoElement.innerHTML = '<div class="domino-back"></div>';
    this.rightDominoElement.classList.add("back");
  }

  /**
   * Displays the right-side domino face up, revealing its actual pips.
   * @param {Object} domino - The domino object to reveal.
   * @returns {void}
   */
  showRightDominoFace(domino) {
    this.rightDominoElement.innerHTML = this.buildDominoFaceHTML(domino);
    this.rightDominoElement.classList.remove("back");
  }

  /**
   * Binds the passed click handler function to the high and low guess buttons.
   * @param {Function} clickHandler - Function to be executed when the buttons are clicked.
   * @returns {void}
   */
  bindGuessButtons(clickHandler) {
    this.highButton.dataset.guess = "high";
    this.lowButton.dataset.guess = "low";
    this.highButton.onclick = clickHandler;
    this.lowButton.onclick = clickHandler;
  }

  /**
   * Binds the passed click handler function to the reset button.
   * @param {Function} clickHandler - Function to be executed when the reset button is clicked.
   * @returns {void}
   */
  bindResetButton(clickHandler) {
    this.resetButton.onclick = clickHandler;
  }

  /**
   * Disables the interaction of high/low buttons during round resolution.
   * @returns {void}
   */
  disableGuessButtons() {
    this.highButton.disabled = true;
    this.lowButton.disabled = true;
  }

  /**
   * Enables the interaction of high/low guess buttons.
   * @returns {void}
   */
  enableGuessButtons() {
    this.highButton.disabled = false;
    this.lowButton.disabled = false;
  }

  /**
   * Updates the visual game status including score, lives, and boneyard count.
   * @param {number} score - Present game score.
   * @param {number} lives - Present total of the user's remaining lives.
   * @param {number} remaining - Number of dominoes still remaining in the boneyard.
   * @param {string} [message=""] - Message text detailing round status or game outcome.
   * @returns {void}
   */
  updateStatus(score, lives, remaining, message = "") {
    let text = `Score: ${score} | Lives: ${lives} | Remaining: ${remaining}`;
    if (message !== "") {
      text += ` | ${message}`;
    }
    this.statusElement.textContent = text;
  }
};