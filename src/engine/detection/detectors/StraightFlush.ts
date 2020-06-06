import { Card } from "../../cards/Card";
import { Detection } from "../Detection";
import { detect as detectStraight } from "./Straight";
import { detect as detectFlush } from "./Flush";

export const BaseValue = 8000;

/**
 * Detect a straight flush in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[]) : Detection {
	// Run both detections on the cards.
	let flush = detectFlush(cards);
	if (!flush.result)
		return { result: false };

	let straight = detectStraight(flush.cards!);
	if (!straight.result)
		return { result: false };

	return { 
		result: true,
		cards: straight.cards,
		value: BaseValue + straight.cards![straight.cards!.length - 1].rank.value
	};
}