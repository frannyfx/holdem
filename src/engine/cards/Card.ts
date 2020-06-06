// Imports
import util from "util";
import { Suit } from "./Suit";
import { Rank } from "./Rank";

// Define card class
export class Card {
	rank: Rank;
	suit: Suit;

	constructor (rank : Rank, suit : Suit) {
		this.rank = rank;
		this.suit = suit;
	}

	/**
	 * Output card correctly in console.log(Card).
	 */
	[util.inspect.custom]() {
		return this.toString();
	}

	toString() {
		return `${this.rank.name} of ${this.suit.symbol}`;
	}
}

export function groupCardsBySuit(cards: Card[]) : {[key: string]: Card[]} {
	// Reduce the cards as to group them by their suit.
	return cards.reduce<{[key: string]: Card[]}>((groups, current) => {
		if (!groups[current.suit.value])
			groups[current.suit.value] = [];

		groups[current.suit.value].push(current);
		return groups;
	}, {});
}

export function groupCardsByRank(cards: Card[]) : {[key: string]: Card[]} {
	// Reduce the cards as to group them by their suit.
	return cards.reduce<{[key: string]: Card[]}>((groups, current) => {
		if (!groups[current.rank.value])
			groups[current.rank.value] = [];

		groups[current.rank.value].push(current);
		return groups;
	}, {});
}