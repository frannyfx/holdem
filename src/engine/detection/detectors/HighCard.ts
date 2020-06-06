import { Card, groupCardsBySuit } from "../../cards/Card";
import { Detection } from "../Detection";

export const BaseValue = 0;

/**
 * Detect a high card in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[]) : Detection {
	// Impossible to have a high card with no cards.
	if (cards.length == 0) {
		return { result: false };
	}

	// Sort the cards by rank.
	cards.sort((a : Card, b : Card) => b.rank.value - a.rank.value);
	return {
		result: true,
		cards: [cards[0]],
		value: cards[0].rank.value
	};
}

