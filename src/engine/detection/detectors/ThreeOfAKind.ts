// Imports
import { Card, groupCardsByRank } from "../../cards/Card";
import { Detection } from "../Detection";
import { HandType } from "../HandType";

export const BaseValue = 3000;

/**
 * Detect a three-of-a-kind in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[]) : Detection {
	// Impossible to have a three-of-a-kind with less than 3 cards.
	if (cards.length < 3) {
		return { type: HandType.ThreeOfAKind, result: false };
	}

	// Group the cards by rank.
	let rankGroups = groupCardsByRank(cards);

	// Detect if any of the groups contain exactly 3 elements.
	let sets = Object.keys(rankGroups).filter(rankValue => rankGroups[rankValue].length == 3);
	if (sets.length > 0) {
		// Sort the sets and pick the highest
		let sortedValues = sets.map(set => parseInt(set)).sort((a, b) => b - a);
		return {
			type: HandType.ThreeOfAKind,
			result: true,
			cards: rankGroups[sortedValues[0].toString()],
			value: BaseValue + sortedValues[0]
		};
	}

	return { type: HandType.ThreeOfAKind, result: false };
}

