import { Card, groupCardsByRank } from "../../cards/Card";
import { Detection } from "../Detection";

export const BaseValue = 6000;

/**
 * Detect a full house in an array of cards.
 * @param cards The array of cards to run the algorithm on.
 * @return A detection object.
 */
export function detect(cards : Card[]) : Detection {
	// Impossible to have a full house with less than 5 cards.
	if (cards.length < 5) {
		return { result: false };
	}

	// Group the cards by rank.
	let rankGroups = groupCardsByRank(cards);

	// Detect if any of the groups contain exactly 2, more than 2 and more than 3 elements.
	let definitePairs = Object.keys(rankGroups).filter(rankValue => rankGroups[rankValue].length == 2);
	let potentialSets = Object.keys(rankGroups).filter(rankValue => rankGroups[rankValue].length >= 2);
	let definiteSets = Object.keys(rankGroups).filter(rankValue => rankGroups[rankValue].length >= 3);
	
	// Only detect a full house if we definitely have a set and we definitely have at least a separate pair.
	if (definiteSets.length == 0 || potentialSets.length < 2)
		return { result: false };
	
	// If we only have groups of 3 or more...
	if (definiteSets.length - potentialSets.length == 0 && definiteSets.length > 1) {
		// Sort the sets by value and pick the highest one to be the 3 set, and the second highest to be the 2 set.
		let sortedValues = definiteSets.map(set => parseInt(set)).sort((a, b) => b - a);

		return {
			result: true,
			cards: [...rankGroups[sortedValues[0].toString()].slice(0, 3), ...rankGroups[sortedValues[1].toString()].slice(0, 2)],
			value: BaseValue + sortedValues[0]
		};
	}

	// If the last condition wasn't met, it means we definitely have a group of 3 or more and a group of exactly 2.
	if (definitePairs.length > 0 && definiteSets.length > 0) {
		// Sort the sets and the pairs so we can pick the highest set and highest pair to go together.
		let sortedSets = definiteSets.map(set => parseInt(set)).sort((a, b) => b - a);
		let sortedPairs = definitePairs.map(set => parseInt(set)).sort((a, b) => b - a);

		return {
			result: true,
			cards: [...rankGroups[sortedSets[0].toString()].slice(0, 3), ...rankGroups[sortedPairs[0].toString()].slice(0, 2)],
			value: BaseValue + sortedSets[0]
		};
		
	}

	return { result: false };
}

