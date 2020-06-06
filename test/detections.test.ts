import { expect } from 'chai';

// Import cards
import { Card } from "../src/engine/cards/Card";
import { Rank, Ranks } from "../src/engine/cards/Rank";
import { Suit, Suits } from "../src/engine/cards/Suit";

// Import detectors
import { detect as detectHighCard, BaseValue as HighCardBaseValue } from "../src/engine/detection/detectors/HighCard";
import { detect as detectPair, BaseValue as PairBaseValue } from "../src/engine/detection/detectors/Pair";
import { detect as detectTwoPair, BaseValue as TwoPairBaseValue } from "../src/engine/detection/detectors/TwoPair";
import { detect as detectThreeOfAKind } from "../src/engine/detection/detectors/ThreeOfAKind";
import { detect as detectStraight } from "../src/engine/detection/detectors/Straight";
import { detect as detectFlush } from "../src/engine/detection/detectors/Flush";
import { detect as detectFullHouse } from "../src/engine/detection/detectors/FullHouse";
import { detect as detectFourOfAKind } from "../src/engine/detection/detectors/FourOfAKind";
import { detect as detectStraightFlush } from "../src/engine/detection/detectors/StraightFlush";
import { detect as detectRoyalFlush } from "../src/engine/detection/detectors/RoyalFlush";

describe('High card detection', () => {
	// Run detections
	let cards = [
		new Card(Ranks.Ace, Suits.Diamonds),
		new Card(Ranks.King, Suits.Diamonds),
		new Card(Ranks.Queen, Suits.Diamonds),
		new Card(Ranks.Jack, Suits.Diamonds),
		new Card(Ranks.Ten, Suits.Diamonds)
	];

	let detection = detectHighCard(cards);

    it('return false with 0 cards', () => {
		expect(detectHighCard([]).result).equal(false);
	});
	
	it('detect high card', () => {
		expect(detection.result).equal(true);
	});
	
	it('identify correct high card', () => {
		expect(detection.value).equal(HighCardBaseValue + cards[0].rank.value);
	})

	it ('return correct number of cards', () => {
		expect(detection.cards!.length).equal(1);
	})
});

describe('Pair detection', () => {
	// Run detections
	let cardsPair = [
		new Card(Ranks.Ace, Suits.Diamonds),
		new Card(Ranks.King, Suits.Diamonds),
		new Card(Ranks.Ace, Suits.Hearts),
		new Card(Ranks.King, Suits.Hearts),
		new Card(Ranks.Three, Suits.Hearts)
	];

	let cardsNoPair = [
		new Card(Ranks.Ace, Suits.Diamonds),
		new Card(Ranks.King, Suits.Diamonds),
		new Card(Ranks.Queen, Suits.Diamonds),
		new Card(Ranks.Jack, Suits.Diamonds),
		new Card(Ranks.Ten, Suits.Diamonds)
	];

	let detectionPair = detectPair(cardsPair);
	let detectionNoPair = detectPair(cardsNoPair);

    it('return false with less than 2 cards', () => {
		expect(detectPair(cardsPair.slice(0, 1)).result).equal(false);
	});

	it('return false with no pairs', () => {
		expect(detectionNoPair.result).equal(false);
	});
	
	it('detect pair', () => {
		expect(detectionPair.result).equal(true);
	});
	
	it('detect highest pair', () => {
		expect(detectionPair.value).equal(PairBaseValue + cardsPair[0].rank.value);
	})

	it ('return correct number of cards', () => {
		expect(detectionPair.cards!.length).equal(2);
	})
});

describe('Two pair detection', () => {
	// Run detections
	let cardsTwoPairs = [
		new Card(Ranks.Ace, Suits.Diamonds),
		new Card(Ranks.King, Suits.Diamonds),
		new Card(Ranks.Ace, Suits.Hearts),
		new Card(Ranks.King, Suits.Hearts),
		new Card(Ranks.Three, Suits.Hearts)
	];

	let cardsOnePair = [
		new Card(Ranks.Ace, Suits.Diamonds),
		new Card(Ranks.King, Suits.Diamonds),
		new Card(Ranks.Queen, Suits.Diamonds),
		new Card(Ranks.Jack, Suits.Diamonds),
		new Card(Ranks.Ten, Suits.Diamonds)
	];

	let cardsNoPairs = [
		new Card(Ranks.Ace, Suits.Diamonds),
		new Card(Ranks.King, Suits.Diamonds),
		new Card(Ranks.Queen, Suits.Diamonds),
		new Card(Ranks.Jack, Suits.Diamonds),
		new Card(Ranks.Ten, Suits.Diamonds)
	];

	let detectionTwoPairs = detectTwoPair(cardsTwoPairs);
	let detectionOnePair = detectTwoPair(cardsOnePair);
	let detectionNoPairs = detectTwoPair(cardsNoPairs);

    it('return false with less than 4 cards', () => {
		expect(detectTwoPair(cardsTwoPairs.slice(0, 3)).result).equal(false);
	});

	it('return false with no pairs', () => {
		expect(detectionNoPairs.result).equal(false);
	});
	
	it('return false with one pair', () => {
		expect(detectionOnePair.result).equal(false);
	});

	it('detect two pair', () => {
		expect(detectionTwoPairs.result).equal(true);
	});

	it('return correct value', () => {
		expect(detectionTwoPairs.value).equal(TwoPairBaseValue + cardsTwoPairs[0].rank.value);
	})

	it ('return correct number of cards', () => {
		expect(detectionTwoPairs.cards!.length).equal(4);
	})
});
