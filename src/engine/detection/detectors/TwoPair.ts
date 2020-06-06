// Imports
import { Card, groupCardsByRank } from "../../cards/Card";
import { Detection } from "../Detection";
import { HandType } from "../HandType";

export const BaseValue = 2000;

/**
 * Detect a two-pair in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[]) : Detection {
	// Impossible to have a two-pair with less than 4 cards.
	if (cards.length < 4) {
		return { type: HandType.TwoPair, result: false };
	}

	// Group the cards by rank.
	let rankGroups = groupCardsByRank(cards);

	// Detect if any of the groups contain exactly 2 elements.
	let pairs = Object.keys(rankGroups).filter(rankValue => rankGroups[rankValue].length == 2);
	if (pairs.length > 1) {
		// Sort the pairs and pick the two highest.
		let sortedValues = pairs.map(pair => parseInt(pair)).sort((a, b) => b - a);
		return {
			type: HandType.TwoPair,
			result: true,
			cards: [...rankGroups[sortedValues[0].toString()], ...rankGroups[sortedValues[1].toString()]],
			value: BaseValue + sortedValues[0]
		};
	}

	return { type: HandType.TwoPair, result: false };
}

