// Imports
import { Deck } from "./cards/Deck";
import { Player } from "./Player";

export class Table {
	private seats: (Player | null)[];
	private maxSeats: number;
	private numPlayers: number;
	private deck: Deck;

	constructor (maxSeats : number = 9) {
		// Seats
		this.seats = [];
		this.maxSeats = maxSeats;
		this.numPlayers = 0;

		// Add seats in
		for (var i = 0; i < maxSeats; i++) this.seats.push(null);
		
		// Deck
		this.deck = new Deck();
	}

	addPlayer(player : Player, seatIndex : number = -1) {
		// Don't allow a player to sit if all the seats are taken.
		if (this.numPlayers >= this.maxSeats)
			return false;

		// Find the next available seat if a seat has not been specified or if the specified seat index is invalid.
		if (seatIndex == -1 || seatIndex >= this.maxSeats || this.seats[seatIndex] != null) {
			seatIndex = -1;
			for (var i = 0; i < this.maxSeats; i++) {
				if (this.seats[i] != null)
					continue;

				seatIndex = i;
				break;
			}

			// Ensure the previous algorithm didn't fail.
			if (seatIndex == -1 || this.seats[seatIndex] != null)
				return false;
		}

		// Add the player to the selected seat.
		console.log(`Sat player ${player.name} at seat ${seatIndex}.`);
		this.seats[seatIndex] = player;
		this.numPlayers++;
		return true;
	}

	removePlayer(seatIndex : number) {
		// Don't remove player if the seat index provided is invalid or if there's nobody sat at the specified seat.
		if (seatIndex < 0 || seatIndex >= this.maxSeats || this.seats[seatIndex] == null)
			return null;

		// Remove the player
		let player = this.seats[seatIndex];
		this.numPlayers--;
		this.seats[seatIndex] = null;
		return player;
	}
}