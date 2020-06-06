import { Card, groupCardsByRank } from "../../cards/Card";
import { Detection } from "../Detection";

export const BaseValue = 1000;

/**
 * Detect a pair in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[]) : Detection {
	// Impossible to have a pair with less than 2 cards.
	if (cards.length < 2) {
		return { result: false };
	}

	// Group the cards by rank.
	let rankGroups = groupCardsByRank(cards);

	// Detect if any of the groups contain exactly 2 elements.
	let pairs = Object.keys(rankGroups).filter(rankValue => rankGroups[rankValue].length == 2);
	if (pairs.length == 1) {
		return {
			result: true,
			cards: rankGroups[pairs[0]],
			value: BaseValue + parseInt(pairs[0])
		};
	}

	return { result: false };
}

