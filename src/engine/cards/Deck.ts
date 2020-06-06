// Imports
import { Card } from "./Card"; 
import { Suits } from "./Suit";
import { Ranks } from "./Rank"; 

export class Deck {
	private cards: Card[];
	private missingCards: Card[];

	constructor(shuffled = true) {
		this.cards = [];
		this.missingCards = [];
		this.fill();

		// Shuffle deck if requested.
		if (shuffled) this.shuffle();
	}

	private fill() {
		// Don't fill if it's already been filled.
		if (this.cards.length != 0)
			return;

		// Loop through suits and values to fill the deck.
		for (let suit in Suits) {	
			for (let rank in Ranks) {
				let card = new Card(Ranks[rank], Suits[suit]);
				this.cards.push(card);
			}
		}
	}

	reset() {
		this.cards = [];
		this.missingCards = [];
		this.fill();
	}

	shuffle() {
		this.cards.sort(() => Math.random() - 0.5);
	}

	pick() : Card | null {
		if (this.cards.length == 0) {
			console.log("Cannot pick a card from an empty deck.");
			return null;
		}

		let card = this.cards.splice(0, 1)[0];
		this.missingCards.push(card);
		return card;
	}
}