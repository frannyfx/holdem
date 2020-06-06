// Imports
import { Card } from "../../cards/Card";
import { Detection } from "../Detection";
import { detect as detectStraightFlush } from "./StraightFlush";
import { HandType } from "../HandType";

export const BaseValue = 9000;

/**
 * Detect a royal flush in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[], cachedStraightFlush : Detection | null = null) : Detection {
	// Detect straight flush.
	let straightFlush = cachedStraightFlush ? cachedStraightFlush : detectStraightFlush(cards);
	if (!straightFlush.result)
		return { type: HandType.RoyalFlush, result: false };

	// Check royalty (thorough just to be sure)
	if (straightFlush.cards![0].rank.value != 10 || straightFlush.cards![1].rank.value != 11 || straightFlush.cards![2].rank.value != 12 || straightFlush.cards![3].rank.value != 13 || straightFlush.cards![4].rank.value != 14)
		return { type: HandType.RoyalFlush, result: false };

	return { 
		type: HandType.RoyalFlush,
		result: true,
		cards: straightFlush.cards,
		value: BaseValue
	};
}