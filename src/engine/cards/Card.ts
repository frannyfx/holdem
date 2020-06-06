// Imports
import util from "util";
import { Suit } from "./Suit";
import { Value } from "./Value";

// Define card class
export class Card {
	value: Value;
	suit: Suit;

	constructor (value : Value, suit : Suit) {
		this.value = value;
		this.suit = suit;
	}

	/**
	 * Output card correctly in console.log(Card).
	 */
	[util.inspect.custom]() {
		return this.toString();
	}

	toString() {
		return `${this.value.name} of ${this.suit.symbol}`;
	}
}