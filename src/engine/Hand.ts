import { Player } from "./Player";
import { Action, Type as ActionType } from "./Action";
import { Deck } from "./cards/Deck";

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
	pot: number;
	
	// Cards
	deck: Deck;

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
		this.pot = 0;
		this.deck = new Deck(true);
	}

	start() {
		// The current turn is the player after the big blind.
		this.currentTurn = (this.bigBlindIndex + 1) % this.players.length;
		this.currentBetAmount = this.blindAmount * 2; // Blind amount indicates small blind

		// Set the pot to the initial blinds (don't add the small blind if it's not being used)
		this.pot = (this.blindAmount * 2) + (this.smallBlindIndex == -1 ? 0 : this.blindAmount);

		// Reset all players.
		this.resetPlayers(true);
		this.dealCards();

		// Make blinds player pay.
		if (this.smallBlindIndex != -1) this.players[this.smallBlindIndex].bet(this.blindAmount);
		this.players[this.bigBlindIndex].bet(this.blindAmount * 2);
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

	private startNextStage() {
		// Advance the stage.
		this.stage++;

		// Count number of players still in the game (must end if all but one have folded)
		let playersFolded = this.players.reduce<number>((previous, current, index) => previous + (current.hasFolded ? 1 : 0), 0);

		// End the hand if we're either at the result stage or if we have only one player left (or less :/)
		if (this.stage == Stage.Result || playersFolded >= this.players.length - 1) {
			console.log("Show your cards!");
			this.status = Status.Finished;
			return;
		}

		// Reset players & bet amounts.
		this.resetPlayers(false);
		this.currentBetAmount = 0;

		// Set the new turn to after the dealer.
		this.currentTurn = (this.dealerIndex + 1) % this.players.length;

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
					//player.goAllIn();
					console.log(`${player.name} cannot call as they don't have enough money.`);
					return;
				}

				// Call the difference between current bet and and the amount of money the player has already bet.
				player.bet(amountToCall);
				this.pot += amountToCall;
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
				if (action.amount! < this.blindAmount * 2 && action.amount! < this.currentBetAmount * 2) {
					console.log(`${player.name} cannot raise to ${action.amount!} - Invalid amount.`);
					return;
				}

				// Calculate the difference between how much the player has already bet and the amount they specified.
				let amountToRaise = action.amount! - player.roundBetAmount;

				// Don't allow raising unless the player has enough money to raise. (All-in action is separate)
				if (player.chips < amountToRaise) {
					console.log(`${player.name} cannot raise to ${action.amount!} as they don't have enough money.`);
					return;
				}

				// Raise to the difference between how much the player has already bet and their raise amount.
				player.bet(amountToRaise);
				this.currentBetAmount = action.amount!;	// Set the current bet amount to the total raise amount.
				this.pot += amountToRaise; // Only add the difference to the pot (!)
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