// Import detectors
import { detect as detectHighCard} from "./detectors/HighCard";
import { detect as detectPair } from "./detectors/Pair";
import { detect as detectTwoPair } from "./detectors/TwoPair";
import { detect as detectThreeOfAKind } from "./detectors/ThreeOfAKind";
import { detect as detectStraight } from "./detectors/Straight";
import { detect as detectFlush } from "./detectors/Flush";
import { detect as detectFullHouse } from "./detectors/FullHouse";
import { detect as detectFourOfAKind } from "./detectors/FourOfAKind";
import { detect as detectStraightFlush } from "./detectors/StraightFlush";
import { detect as detectRoyalFlush } from "./detectors/RoyalFlush";

// Import cards and hand type
import { Card } from "../cards/Card";
import { HandType } from "./HandType";
import { Detection } from "./Detection";

/**
 * Run all detections
 * 
 */
export function detect(cards : Card[]) : Detection {
	// Run all detections.
	// TODO: Optimise detections to prevent redundant checks.
	let detections = [
		detectHighCard(cards),
		detectPair(cards),
		detectTwoPair(cards),
		detectThreeOfAKind(cards),
		detectStraight(cards),
		detectFlush(cards),
		detectFullHouse(cards),
		detectFourOfAKind(cards),
		detectStraightFlush(cards),
		detectRoyalFlush(cards)
	];

	// Sort the detections and return HandType.None if no detections were successful.
	let sortedDetections = detections.filter(detection => detection.result && detection.value != undefined).sort((a, b) => b.value! - a.value!);
	if (sortedDetections.length == 0) {
		return {
			type: HandType.None,
			result: true
		};
	}

	// Otherwise, return the first detection.
	return sortedDetections[0];
}