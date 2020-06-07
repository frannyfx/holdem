import { Player } from "./Player";
import { Action, Type as ActionType } from "./Action";
import { Deck } from "./cards/Deck";
import { Pot } from "./Pot";
import { Card } from "./cards/Card";

export enum Status {
	Waiting = 0,
	InProgress = 1,
	Finished = 2
}

export enum Stage {
	PreFlop = 0,
	Flop = 1,
	Turn = 2,
	River = 3,
	Result = 4
}

export class Hand {
	status: Status;
	stage: Stage;

	// Players
	players: Player[];
	
	// Dealer & blinds
	dealerIndex: number;
	bigBlindIndex: number;
	smallBlindIndex: number;
	blindAmount: number;

	// Turns
	currentTurn: number;
	currentBetAmount: number;
	pots: Pot[];
	currentPot: Pot;
	
	// Cards
	deck: Deck;
	cardsOnTable: Card[];

	constructor(players : Player[], dealerIndex: number, bigBlindIndex : number, smallBlindIndex: number, blindAmount: number) {
		this.stage = Stage.PreFlop;
		this.status = Status.Waiting;
		this.players = players;
		this.dealerIndex = dealerIndex;
		this.bigBlindIndex = bigBlindIndex;
		this.smallBlindIndex = smallBlindIndex;
		this.blindAmount = blindAmount;
		this.currentTurn = -1;
		this.currentBetAmount = 0;
		this.pots = [];
		this.currentPot = new Pot(this.players);
		this.deck = new Deck(true);
		this.cardsOnTable = [];
	}

	start() {
		// The current turn is the player after the big blind.
		this.currentTurn = (this.bigBlindIndex + 1) % this.players.length;
		this.currentBetAmount = this.blindAmount * 2; // Blind amount indicates small blind

		// Set the pot to the initial blinds (don't add the small blind if it's not being used)
		this.currentPot.setAmount((this.blindAmount * 2) + (this.smallBlindIndex == -1 ? 0 : this.blindAmount));

		// Reset all players.
		this.resetPlayers(true);
		this.dealCards();

		// Make blinds player pay, make sure the big blind player has "hasPlayed" set to false so they can check.
		if (this.smallBlindIndex != -1) this.players[this.smallBlindIndex].bet(this.blindAmount);
		this.players[this.bigBlindIndex].bet(this.blindAmount * 2);
		this.players[this.bigBlindIndex].hasPlayed = false;
	}

	getTurnPlayer() : Player {
		return this.players[this.currentTurn];
	}

	private resetPlayers(totalReset = false) {
		this.players.map(player => {
			// If we're completely resetting, remove permanent effects such as all-in and folding.
			if (totalReset) {
				player.isAllIn = false;
				player.hasFolded = false;
			}

			player.roundBetAmount = 0;
			player.hasChecked = false;
			player.hasPlayed = false;
		});
	}

	private dealCards() {
		this.players.map(player => {
			player.setCards(this.deck.pick()!, this.deck.pick()!);
		});
	}

	private addCardsOnTable() {
		// Prevent adding too many cards.
		if (this.stage == Stage.PreFlop || this.stage == Stage.Result || this.cardsOnTable.length >= 5)
			return;

		for (var i = 0; i < (this.stage == Stage.Flop ? 3 : 1); i++) this.cardsOnTable.push(this.deck.pick()!);
		console.log(`The cards on the table are: ${this.cardsOnTable}`);
	}

	private startNextStage() {
		// Count number of players still in the game (must end if all but one have folded)
		let playersFolded = this.players.reduce<number>((previous, current) => previous + (current.hasFolded ? 1 : 0), 0);

		// End the hand if we're either at the result stage or if we have only one player left (or less :/)
		if (this.stage == Stage.River || playersFolded >= this.players.length - 1) {
			// TODO: Calculate best hand.
			console.log("Done!");
			this.status = Status.Finished;
			return;
		}

		// Check if all players are either folded or all-in (apart from one).
		let totalPlayersAllIn = this.players.reduce<number>((previous, current) => previous + (current.isAllIn ? 1 : 0), 0);
		if (totalPlayersAllIn + playersFolded >= this.players.length - 1) {
			// TODO: Simulate the rest of the game.
			console.log("Now simulating the rest of the game (no more turns).");
			this.status = Status.Finished;
			return;
		}
		
		// Advance the stage.
		this.stage++;
		this.addCardsOnTable();

		// Reset players & bet amounts.
		this.resetPlayers(false);
		this.currentBetAmount = 0;

		// Get the players that are still active and add them to the next pot.
		let activePlayers = this.currentPot.getActivePlayers();
		if (activePlayers.length > 0 && this.currentPot.getNumAllInPlayers() > 0) {
			console.log("New pot has been created.");
			this.pots.push(this.currentPot);
			this.currentPot = new Pot(activePlayers);
			console.log(activePlayers);
		}

		// Set the new turn to after the dealer.
		for (var i = 0; i < this.players.length - 1; i++) {
			// Offset the index by the dealer index and add 1 to not include the dealer.
			let j = (this.dealerIndex + i + 1) % this.players.length;

			// Find the next person after the dealer who is in the current pot.
			if (this.currentPot.players.indexOf(this.players[j]) != -1) {
				this.currentTurn = j;
				break;
			}
		}

		// Log the new stage
		console.log(`New stage: ${Stage[this.stage]}.`);
	}

	takeTurn(player : Player, action : Action) {
		// Don't allow a player to perform an action when it's not their turn.
		if (this.players[this.currentTurn] != player) {
			console.log(`${player.name} cannot perform this action as it's not their turn.`);
			return;
		}

		// This shouldn't happen, but make sure that the player is actually allowed to perform an action.
		// TODO: ...

		switch (action.type) {
			case ActionType.Fold: {
				player.fold();
				break;
			}
			case ActionType.Check: {
				if (player.roundBetAmount < this.currentBetAmount) {
					console.log(`${player.name} cannot check as their bet (${player.roundBetAmount}) is lower than the round bet (${this.currentBetAmount}).`);
					return;
				}

				player.check();
				break;
			}
			case ActionType.Call: {
				// Calculate the amount of money the player would have to spend to call.
				let amountToCall = this.currentBetAmount - player.roundBetAmount;

				// Don't allow the call action to be used for raising, and don't allow calling zero chips either.
				if (amountToCall < 1) {
					console.log(`${player.name} cannot call as they already bet greater than or equal to the bet amount.`);
					return;
				}

				// Don't allow calling unless the player has enough money to call. (All-in action is separate)
				if (player.chips < amountToCall) {
					console.log(`${player.name} cannot call as they don't have enough money.`);
					return;
				}

				// Call the difference between current bet and and the amount of money the player has already bet.
				player.bet(amountToCall);
				this.currentPot.setAmount(this.currentPot.amount + amountToCall);
				break;
			}
			case ActionType.Raise: {
				// Don't allow malformed action payload.
				if (action.amount == null) {
					console.log(`${player.name} cannot raise as they have not specified an amount.`);
					return;
				}

				// TODO: Don't allow raising when all other players active in this round (not folded or all-in previous rounds) are all in.
				// Don't allow raising less than the blind, the current amount or raising less than double the previous bet.
				if (action.amount! < this.blindAmount * 2 || action.amount! < this.currentBetAmount * 2) {
					console.log(`${player.name} cannot raise to ${action.amount!} - Invalid amount.`);
					return;
				}

				// Calculate the difference between how much the player has already bet and the amount they specified.
				let amountToRaise = action.amount! - player.roundBetAmount;

				// Don't allow raising unless the player has enough money to raise.
				if (player.chips < amountToRaise) {
					console.log(`${player.name} cannot raise to ${action.amount!} as they don't have enough money.`);
					return;
				}

				// Don't allow raising if everyone else in the pot is already all-in.
				if (this.currentPot.getNumAllInPlayers() >= this.currentPot.players.length - 1) {
					console.log(`${player.name} cannot raise as all the other players are already all in.`);
					return;
				}

				// Raise to the difference between how much the player has already bet and their raise amount.
				player.bet(amountToRaise);
				this.currentBetAmount = action.amount!;	// Set the current bet amount to the total raise amount.
				this.currentPot.setAmount(this.currentPot.amount + amountToRaise); // Only add the difference to the pot (!)
				break;
			}
			case ActionType.AllIn: {
				// Make the player bet this amount and add it to the pot.
				let amountAllIn = player.chips;
				player.bet(amountAllIn);
				this.currentPot.setAmount(this.currentPot.amount + amountAllIn);

				// Only increase the current bet amount if the all in amount is larger than the current bet.
				if (amountAllIn > this.currentBetAmount) {
					this.currentBetAmount = amountAllIn;
				}

				break;
			}
			default: {
				console.warn(`Unhandled action ${action.type}.`);
				return;
			}
		}

		// Check if all players have bet the right amount.
		// TODO: Side pots & all-ins.
		let shouldGoToNextStage = true;
		for (var i = 0; i < this.players.length; i++) {
			if ((this.players[i].roundBetAmount != this.currentBetAmount || !this.players[i].hasPlayed) && !this.players[i].hasFolded && !this.players[i].isAllIn) {
				shouldGoToNextStage = false;
				break;
			}
		}

		if (shouldGoToNextStage) {
			this.startNextStage();
			return;
		}

		// Otherwise...

		// Find the next person who isn't folded and isn't all in.
		var nextTurnIndex = -1;
		for (var i = 0; i < this.players.length - 1; i++) {
			let j = (i + this.currentTurn + 1) % this.players.length; // Offset
			let player = this.players[j];
			
			if (!player.hasFolded && !player.isAllIn) {
				nextTurnIndex = j;
				break;
			}
		}

		this.currentTurn = nextTurnIndex;
	}
}