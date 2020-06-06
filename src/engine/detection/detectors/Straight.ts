// Imports
import { Card } from "../../cards/Card";
import { Detection } from "../Detection";
import { Ranks } from "../../cards/Rank";
import { HandType } from "../HandType";

export const BaseValue = 4000;

/**
 * Detect a straight in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[]) : Detection {
	// Impossible to have a straight with less than 5 cards.
	if (cards.length < 5) {
		return { type: HandType.Straight, result: false };
	}

	// Sort the cards by their rank.
	cards.sort((a : Card, b : Card) => a.rank.value - b.rank.value);
	
	// If we have a high ace, make sure we also add a low ace to the card set.
	if (cards[cards.length - 1].rank == Ranks.Ace) {
		cards.unshift(new Card({ value: 1, symbol: "A", name: "Ace" }, cards[cards.length - 1].suit));
	}

	// Check for continuous ranks.
	var lastRank = -1;
	let continuousCards : Card[] = [];
	for (var i = 0; i < cards.length; i++) {
		// Clear the array if the last rank is not continuous.
		if (lastRank != -1 && lastRank != cards[i].rank.value - 1) {
			// Otherwise, clear the array.
			continuousCards.splice(0, continuousCards.length);
		}

		continuousCards.push(cards[i]);
		lastRank = cards[i].rank.value;
	}

	// Make sure that somehow the continuous cards don't contain both aces (???)
	if (continuousCards.length >= 5 && continuousCards[0].rank.value == 1 && continuousCards[continuousCards.length - 1].rank.value == 14) {
		continuousCards.splice(0, continuousCards.length);
	} 

	// We need at least 5 consecutive cards for a straight.
	if (continuousCards.length >= 5) {
		// Pick the highest 5 cards.
		let straightCards = continuousCards.slice(Math.max(continuousCards.length - 5, 0));

		return {
			type: HandType.Straight,
			result: true,
			cards: straightCards,
			value: BaseValue + straightCards[straightCards.length - 1].rank.value
		};
	}

	return { type: HandType.Straight, result: false };
}

