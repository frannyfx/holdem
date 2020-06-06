/**
 * @file Testing.
 */

// Imports
import { Card } from "./engine/cards/Card";
import { Deck } from "./engine/cards/Deck";
import { Player } from "./engine/Player";
import { Table } from "./engine/Table";
import { Action, Type as ActionType} from "./engine/Action";

// Handle input
/*
import readline from "readline";
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// Create table
let table = new Table(9, 2500);
let player1 = new Player("Player 1", 100000);
let player2 = new Player("Player 2", 100000);
let player3 = new Player("Player 3", 100000);

table.addPlayer(player1);
table.addPlayer(player2);
table.addPlayer(player3);

function askForMove() {
	return new Promise(resolve => {
		// Get hand & current turn player.
		let hand = table.getHand()!;
		let currentPlayer = hand.getTurnPlayer();

		rl.question(`\nCommand for ${currentPlayer.name}:\n> `, command => {
			// Rudimentary command parser
			let keywords = command.split(" ");
			let action = keywords[0].trim().toLowerCase();
			let amount = keywords.length > 1 ? parseInt(keywords[1].trim()) : -1;

			switch (action) {
				case "fold": {
					hand.takeTurn(currentPlayer, { type: ActionType.Fold });
					break;
				}
				case "check": {
					hand.takeTurn(currentPlayer, { type: ActionType.Check });
					break;
				}
				case "call": {
					hand.takeTurn(currentPlayer, { type: ActionType.Call });
					break;
				}
				case "raise": {
					hand.takeTurn(currentPlayer, { type: ActionType.Raise, amount });
					break;
				}
				default: {
					console.log("Invalid command.");
				}
			}

			// Obviously trash code (just for now) - also status seems redundant since we know the status already from the stage.
			if (hand.status != 2) askForMove();
			resolve();
		});
	});
}

async function init() {
	table.startNewHand();



	await askForMove();
}

//init();
*/

import { detect } from "./engine/detection/detectors/HighCard";
import { Ranks } from "./engine/cards/Rank";
import { Suits } from "./engine/cards/Suit";

let detection = detect([new Card(Ranks.Ace, Suits.Clubs), new Card(Ranks.King, Suits.Clubs), new Card(Ranks.Queen, Suits.Clubs), new Card(Ranks.Jack, Suits.Clubs), new Card(Ranks.Ten, Suits.Clubs), new Card(Ranks.Nine, Suits.Clubs)])
console.log(detection);

/*
table.getHand()!.takeTurn(player1, {
	type: ActionType.Raise,
	amount: 10000
});

table.getHand()!.takeTurn(player2, {
	type: ActionType.Call
});

table.getHand()!.takeTurn(player3, {
	type: ActionType.Call
});*/