import DiceSet from './DiceSet.js';
import Player from './Player.js';
// Written by Brian Bird, 4/10/2026 using Gemini 3.1 in Antigravity.
// Edited by Zoie D 4/17/26 with AI assistance of copilot

// This class represents the overall game state and logic.
export default class Game {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        
        this.diceSet = new DiceSet();
        
        this.isGameOver = false;

        // Initialize turn-specific state properties
        this.resetTurnState();
    }

    startNewGame(playerNames) {
        this.players = [];
        for (const name of playerNames) {
            this.players.push(new Player(name));
        }
        
        this.currentPlayerIndex = 0;
        this.isGameOver = false;
        this.resetTurnState();
    }

    resetTurnState() {
        this.rollsPerformed = 0;
        this.diceSet.reset();
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    rollDice() {
        if (this.canRollDice()) {
            this.diceSet.rollAll();
            this.rollsPerformed++;
        }
    }

    canRollDice() {
        return !this.diceSet.isTurnComplete() && (this.rollsPerformed === 0 || this.diceSet.hasHeldDice());
    }

    isTurnComplete() {
        return this.diceSet.isTurnComplete();
    }

    endTurn() {
        const currentPlayer = this.getCurrentPlayer();
        currentPlayer.setScore(this.diceSet.getScore());

        // Advance to next player or end game
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex >= this.players.length) {
            this.isGameOver = true;
        } else {
            this.resetTurnState();
        }
    }

    getWinners() {
        if (!this.isGameOver) return [];

        let minScore = Infinity;
        let winners = [];

        // Loop through all players to find the lowest score.
        // We push to an array instead of just saving one player because ties are possible
        // and we want to return all players who share the lowest score.
        for (const player of this.players) {
            if (player.score < minScore) {
                minScore = player.score;
                winners = [player];
            } else if (player.score === minScore) {
                winners.push(player);
            }
        }
        return winners;
    }
}
