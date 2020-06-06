// Imports
import { Card } from "../../cards/Card";
import { Detection } from "../Detection";
import { detect as detectStraight } from "./Straight";
import { detect as detectFlush } from "./Flush";
import { HandType } from "../HandType";

export const BaseValue = 8000;

/**
 * Detect a straight flush in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[], cachedStraight : Detection | null = null, cachedFlush : Detection | null = null) : Detection {
	// Run both detections on the cards.
	let flush = cachedFlush ? cachedFlush : detectFlush(cards);
	if (!flush.result)
		return { type: HandType.StraightFlush, result: false };

	let straight = cachedStraight ? cachedStraight : detectStraight(flush.cards!);
	if (!straight.result)
		return { type: HandType.StraightFlush, result: false };

	return {
		type: HandType.StraightFlush,
		result: true,
		cards: straight.cards,
		value: BaseValue + straight.cards![straight.cards!.length - 1].rank.value
	};
}