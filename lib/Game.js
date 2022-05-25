const inquirer = require("inquirer");
const Enemy = require("../lib/Enemy");
const Player = require("../lib/Player");

class Game {
  constructor() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
  }

  initializeGame() {
    // enemy list
    this.enemies.push(new Enemy("Gladiator", "sword"));
    this.enemies.push(new Enemy("Rogue", "dagger"));
    this.enemies.push(new Enemy("Bandit", "axe"));

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

        this.startNewBattle();
      });
  }

  startNewBattle() {
    if (this.player.agility > this.currentEnemy.agility) {
      this.isPlayerTurn = true;
    } else {
      this.isPlayerTurn = false;
    }
    console.log("Your stats are:");
    console.table(this.player.getStats());

    console.log(this.currentEnemy.getDescription());

    //starts new battle
    this.battle();
  }

  battle() {
    if (this.isPlayerTurn) {
      // player chooses to attack or use potion
      inquirer
        .prompt({
          type: "list",
          message: "What would you like to do",
          name: "action",
          choices: ["Attack", "Use potion"],
        })
        .then(({ action }) => {
          // If player selects use potion...
          if (action === "Use potion") {
            // if there's no potions in inventory: alert player, and return.
            if (!this.player.getInventory()) {
              console.log(`You don't have any potions`);
              return this.checkEndOfBattle();
            }

            // if there are potions: offer a selection from getInventory()
            inquirer
              .prompt({
                type: "list",
                message: "Which potion would you like to use?",
                name: "action",
                choices: this.player
                  .getInventory()
                  .map((item, index) => `${index + 1}; ${item.name}`),
              })
              .then(({ action }) => {
                const potionDetails = action.split(": ");

                this.player.usePotion(potionDetails[0] - 1);
                console.log(`You used a ${potionDetails[1]} potion.`);

                this.checkEndOfBattle();
              });

            // if player chooses Attack
          } else {
            const damage = this.player.getAttackValue();
            this.currentEnemy.reduceHealth(damage);

            console.log(`You attacked the ${this.currentEnemy.name}`);
            console.log(this.currentEnemy.getHealth());

            this.checkEndOfBattle();
          }
        });
    } else {
      const damage = this.currentEnemy.getAttackValue();
      this.player.reduceHealth(damage);

      console.log(`You were attacked by the ${this.currentEnemy.name}`);
      console.log(this.player.getHealth());

      this.checkEndOfBattle();
    }
  }

  checkEndOfBattle() {
    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
      // switch turn order.
      this.isPlayerTurn = !this.isPlayerTurn;
      this.battle();
    } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
      console.log(`You've defeated the ${this.currentEnemy.name}!`);

      this.player.addPotion(this.currentEnemy.potion);
      console.log(
        `${this.player.name} found a ${this.currentEnemy.potion.name} potion`
      );

      this.roundNumber++;

      if (this.roundNumber < this.enemies.length) {
        this.currentEnemy = this.enemies[this.roundNumber];
        this.startNewBattle();

        // if no enemies remain
      } else {
        console.log("No enemies remain. You have won!");
      }
    } else {
      console.log("You've been defeated!");
    }
  }
}
module.exports = Game;
