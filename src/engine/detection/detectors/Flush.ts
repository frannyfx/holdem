import { Card, groupCardsBySuit } from "../../cards/Card";
import { Detection } from "../Detection";

export const BaseValue = 5000;

/**
 * Detect a flush in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[]) : Detection {
	// Impossible to have a flush with less than 5 cards.
	if (cards.length < 5) {
		return { result: false };
	}

	// Group the cards by suit.
	let suitGroups = groupCardsBySuit(cards);

	// Detect if any of them contain 5 or more elements.
	let flushes = Object.keys(suitGroups).filter(suitValue => suitGroups[suitValue].length >= 5);
	if (flushes.length > 0) {
		// Get the cards for the first flush.
		var flushCards = suitGroups[flushes[0]].sort((a, b) => a.rank.value - b.rank.value);

		// Pick the highest 5 cards (if there are more than 5 cards).
		flushCards = flushCards.slice(Math.max(flushCards.length - 5, 0));

		// Pick first flush (there shouldn't be more than one).
		return {
			result: true,
			cards: flushCards,
			value: BaseValue + flushCards[flushCards.length - 1].rank.value
		};
	}

	return { result: false };
}

