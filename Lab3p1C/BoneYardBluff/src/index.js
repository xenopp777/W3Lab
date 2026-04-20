/*  Overview
    BoneYard Bluff uses a shuffled boneyard of standard double-six dominos.
    One domino is face up on the left, and one is face down on the right.
    The player guesses whether the hidden domino total is higher or lower than
    the visible domino total. The right domino is revealed for 2 seconds.
    If the guess is correct, score increases, the revealed domino becomes the
    new left domino, and a fresh hidden domino is drawn. Reach a score of 10 to win.

    Written by Brian Bird, 3/29/2026, using GitHub Copilot
*/

// CS233JS 4/9/26 edited by Zoie D
// added arrow funcs in index.js and template literal in ui.js

import { GameLogic } from './coreLogic.js'
import { Ui } from './ui.js'

// -------------------- Constants --------------------
const WIN_STREAK = 10;
const REVEAL_DELAY_MS = 2000;
const STARTING_LIVES = 5;

// -------------------- Main Flow --------------------
/**
 * Initializes the game by setting up UI elements and event listeners,
 * and starts the first game.
 */
const ui = new Ui();
const gameLogic = new GameLogic();

const init = () => {
  ui.cacheDominoElements();
  ui.highButton.onclick = handleHighGuess;
  ui.lowButton.onclick = handleLowGuess;
  ui.resetButton.onclick = resetGame;

  resetGame();
};

/**
 * Resets the game state, dealing a new starting hand and resetting score and lives.
 * Calls UI methods to reflect the new starting state.
 */
const resetGame = () => {
  gameLogic.fillBoneyard();
  gameLogic.shuffleBoneyard();
  gameLogic.dealStartingDominos();
  gameLogic.lives = STARTING_LIVES;
  gameLogic.score = 0;
  gameLogic.isGameOver = false;
  gameLogic.isResolving = false;

  ui.showLeftDomino(gameLogic.currentDomino);
  ui.showRightDominoBack();
  ui.updateStatus(gameLogic.score, gameLogic.lives, gameLogic.boneyard.length);
  ui.enableGuessButtons();
};

/**
 * Handles the player clicking "higher" or "lower".
 * Determines if the round can proceed, evaluates the player's guess,
 * reveals the hidden domino, and sets a timeout to complete the round.
 */
const handleHighGuess = () => {
  processGuess('high');
};

const handleLowGuess = () => {
  processGuess('low');
};

function processGuess(guess) {
  if (
    gameLogic.isResolving ||
    gameLogic.isGameOver ||
    gameLogic.nextDomino === null
  ) {
    return;
  }

  gameLogic.isResolving = true;
  ui.disableGuessButtons();

  const isCorrect = gameLogic.evaluateGuess(guess);
  ui.showRightDominoFace(gameLogic.nextDomino);

  setTimeout(() => {
    completeRound(isCorrect);
  }, REVEAL_DELAY_MS);
};

/**
 * Completes the current round by applying the evaluated guess result.
 * Updates the score or lives accordingly, checks for win/loss conditions,
 * and resets the board to prepare for the next guess.
 * @param {boolean} isCorrect - The result of the guess.
 */
const completeRound = (isCorrect) => {
  if (isCorrect) {
    gameLogic.score++;
    gameLogic.advanceRound();

    if (gameLogic.score >= WIN_STREAK) {
      gameLogic.isGameOver = true;
      ui.showLeftDomino(gameLogic.currentDomino);
      ui.showRightDominoBack();
      ui.updateStatus(
        gameLogic.score,
        gameLogic.lives,
        gameLogic.boneyard.length,
        "You win! Streak of 10."
      );
      return;
    }

    if (gameLogic.nextDomino === null) {
      gameLogic.isGameOver = true;
      ui.showLeftDomino(gameLogic.currentDomino);
      ui.showRightDominoBack();
      ui.updateStatus(
        gameLogic.score,
        gameLogic.lives,
        gameLogic.boneyard.length,
        "No more dominos."
      );
      return;
    }

    ui.showLeftDomino(gameLogic.currentDomino);
    ui.showRightDominoBack();
    ui.updateStatus(
      gameLogic.score,
      gameLogic.lives,
      gameLogic.boneyard.length,
      "Correct! Keep the streak going."
    );
  } else {
    gameLogic.lives--;
    gameLogic.score = 0;
    gameLogic.advanceRound();

    if (gameLogic.lives <= 0) {
      gameLogic.isGameOver = true;
      ui.showLeftDomino(gameLogic.currentDomino);
      ui.showRightDominoBack();
      ui.updateStatus(
        gameLogic.score,
        gameLogic.lives,
        gameLogic.boneyard.length,
        "No lives left. Game over."
      );
      return;
    }

    if (gameLogic.nextDomino === null) {
      gameLogic.isGameOver = true;
      ui.showLeftDomino(gameLogic.currentDomino);
      ui.showRightDominoBack();
      ui.updateStatus(
        gameLogic.score,
        gameLogic.lives,
        gameLogic.boneyard.length,
        "No more dominos."
      );
      return;
    }

    ui.showLeftDomino(gameLogic.currentDomino);
    ui.showRightDominoBack();
    ui.updateStatus(
      gameLogic.score,
      gameLogic.lives,
      gameLogic.boneyard.length,
      "Wrong guess. You lost a life."
    );
  }

  gameLogic.isResolving = false;
  ui.enableGuessButtons();
};

window.onload = init;