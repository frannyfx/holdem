import { Card, groupCardsByRank } from "../../cards/Card";
import { Detection } from "../Detection";

export const BaseValue = 7000;

/**
 * Detect a four-of-a-kind in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[]) : Detection {
	// Impossible to have a four-of-a-kind with less than 4 cards.
	if (cards.length < 4) {
		return { result: false };
	}

	// Group the cards by rank.
	let rankGroups = groupCardsByRank(cards);

	// Detect if any of the groups contain exactly 4 elements.
	let fourSets = Object.keys(rankGroups).filter(rankValue => rankGroups[rankValue].length == 4);

	// Technically impossible to have more than 1 four of a kind but let's sort them anyway.
	if (fourSets.length > 0) {
		// Sort the sets and pick the highest
		let sortedValues = fourSets.map(set => parseInt(set)).sort((a, b) => b - a);

		return {
			result: true,
			cards: rankGroups[sortedValues[0].toString()],
			value: BaseValue + sortedValues[0]
		}
	}

	return { result: false };
}

