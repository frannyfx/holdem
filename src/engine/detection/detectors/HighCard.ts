// Imports
import { Card } from "../../cards/Card";
import { Detection } from "../Detection";
import { HandType } from "../HandType";

export const BaseValue = 0;

/**
 * Detect a high card in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[]) : Detection {
	// Impossible to have a high card with no cards.
	if (cards.length == 0) {
		return { type: HandType.HighCard, result: false };
	}

	// Sort the cards by rank.
	cards.sort((a : Card, b : Card) => b.rank.value - a.rank.value);
	return {
		type: HandType.HighCard,
		result: true,
		cards: [cards[0]],
		value: cards[0].rank.value
	};
}

