// Imports
import { Deck } from "./cards/Deck";
import { Player } from "./Player";
import { Hand, Status as HandStatus, Status } from "./Hand";

export class Table {
	// Seats & players
	private seats: (Player | null)[];
	private maxSeats: number;
	private numPlayers: number;
	private players : Player[];
	private waitingForPlayers: boolean;
	private playerToSeat : { [key: string] : number};

	// Blinds handling
	private blindAmount: number;
	private dealerIndex: number;

	// Current hand
	private hand: Hand | null;

	constructor (maxSeats : number = 9, blindAmount: number) {
		// Seats & players
		this.seats = [];
		this.maxSeats = maxSeats;
		this.numPlayers = 0;
		this.players = [];
		this.waitingForPlayers = true;
		this.playerToSeat = {};

		// Add seats in
		for (var i = 0; i < maxSeats; i++) this.seats.push(null);

		// Blinds handling
		this.blindAmount = blindAmount;
		this.dealerIndex = -1;
		
		// Current hand
		this.hand = null;
	}

	/**
	 * Add a player to the table.
	 * @param player The player to add.
	 * @param seatIndex Where the player would like to be seated.
	 * @return Whether the player was successfully added.
	 */
	addPlayer(player : Player, seatIndex : number = -1) : Boolean {
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
		this.playerToSeat[player.id] = seatIndex;
		this.numPlayers++;
	
		// TODO: Only execute this code if auto-start is enabled
		// Check if there are enough players to play.
		//if (this.numPlayers > 1)
		//	this.createNewHand();

		return true;
	}

	/**
	 * Remove a player from the table.
	 * @param seatIndex The seat where the player being removed is sitting.
	 * @return Either the player removed or null if the removal failed.
	 */
	removePlayer(seatIndex : number) : Player | null {
		// Don't remove player if the seat index provided is invalid or if there's nobody sat at the specified seat.
		if (seatIndex < 0 || seatIndex >= this.maxSeats || this.seats[seatIndex] == null)
			return null;

		// Remove the player
		let player = this.seats[seatIndex];
		this.numPlayers--;
		this.seats[seatIndex] = null;
		delete this.playerToSeat[player!.id];

		// If there aren't enough players to continue the game
		if (this.numPlayers < 2) {
			//this.hand.stop();
			this.waitingForPlayers = true;
		}

		return player;
	}

	// TODO: Make this private.
	/*private*/ startNewHand() {
		// Don't start unless the previous hand is either non-existent or finished or there are enough players.
		if ((this.hand != null && this.hand.status != HandStatus.Finished) || this.numPlayers < 2)
			return;

		// Get list of players who are in this hand.
		let activePlayers : Player[] = this.seats.filter((player : Player | null) : player is Player => player != null && player.wantToPlay && player.chips > this.blindAmount);
		if (activePlayers.length < 2)
			return;

		// Set a dealer if it doesn't exist
		this.dealerIndex = (this.dealerIndex + 1) % activePlayers.length;
		
		// Work out blind indexes (there is no small blind with only two players)
		let bigBlindIndex = (activePlayers.length + this.dealerIndex + activePlayers.length > 2 ? 2 : 1) % activePlayers.length;
		let smallBlindIndex = activePlayers.length > 2 ? (activePlayers.length + this.dealerIndex + 1) % activePlayers.length : -1;

		// Create new hand
		this.hand = new Hand(activePlayers, this.dealerIndex, bigBlindIndex, smallBlindIndex, this.blindAmount);
		console.log(`Created new hand with ${activePlayers.length} players. Dealer is ${this.dealerIndex}. Big blind is ${bigBlindIndex}. Small blind is ${smallBlindIndex}.`);
		this.hand.start();
	}

	getHand() {
		return this.hand;
	}
}