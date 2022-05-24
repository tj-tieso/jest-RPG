const inquirer = require("inquirer");
const Enemy = require("./Enemy");
const Player = require("./Player");

function Game() {
  this.roundNumber = 0;
  this.isPlayerTurn = false;
  this.enemies = [];
  this.currentEnemy;
  this.player;
}

Game.prototype.initializeGame = function () {
  // enemy list
  this.enemies.push(new Enemy("goblin", "sword"));
  this.enemies.push(new Enemy("gnoll", "spear"));
  this.enemies.push(new Enemy("skeleton", "axe"));

  // keep track of the current enemy
  this.currentEnemy = this.enemies[0];

  // User info
  inquirer
    .prompt({
      type: "text",
      name: "name",
      message: "Who dares enter the Darkwild?",
    })
    // destructure name from the prompt object
    .then(({ name }) => {
      this.player = new Player(name);

      // test object creation
      this.startNewBattle();
    });
};

module.exports = Game;
