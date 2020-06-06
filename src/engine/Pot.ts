// Imports
import { Player } from "./Player";

export class Pot {
	players: Player[];
	amount: number;
	constructor(players : Player[]) {
		this.players = players;
		this.amount = 0;
	}

	setAmount(amount : number) {
		this.amount = amount;
	}

	getNumAllInPlayers() : number {
		return this.players.filter(player => player.isAllIn).length;
	}

	getActivePlayers() : Player[] {
		// Filter players
		let activePlayers = this.players.filter(player => !player.isAllIn && !player.hasFolded);
		return activePlayers;
	}
}