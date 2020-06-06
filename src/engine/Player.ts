// Imports
import { v4 } from "uuid";
import { Card } from "./cards/Card";

// Name generation
const adjectives = ["Chich", "Atheist", "Quick", "Fast", "Hot", "Sexy", "Nice", "Floppy", "Wet", "Moist", "Neeky"];
const nouns = ["Muck", "Win", "Call", "Bluff", "Booper", "Weed", "Bugzy", "Malone", "Flop", "Fintan"];
const minNameGenerationNumber = 10;
const maxNameGenerationNumber = 100;

function generateName() {
	return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * (maxNameGenerationNumber - minNameGenerationNumber)) + minNameGenerationNumber}`;
}

export class Player {
	id: string;
	name: String;
	chips: number;
	wantToPlay: Boolean;
	roundBetAmount: number;

	// Status
	hasFolded: Boolean;
	hasChecked: Boolean;
	isAllIn: Boolean;
	hasPlayed: Boolean;

	// Cards
	cardA: Card | null;
	cardB: Card | null;

	constructor(name : String | null, chips : number) {
		// Generate ID
		this.id = v4();
		
		// Set name
		this.name = !!name ? name : generateName();

		// Set chip stack
		this.chips = chips;
		
		// Set player status
		this.cardA = this.cardB = null;
		this.wantToPlay = true;
		this.roundBetAmount = 0;

		// Set player status
		this.hasFolded = true;
		this.hasChecked = false;
		this.isAllIn = false;
		this.hasPlayed = false;
	}

	setCards(cardA : Card, cardB : Card) {
		this.cardA = cardA;
		this.cardB = cardB;

		console.log(`${this.name} has ${this.cardA}, ${this.cardB}.`);
	}

	fold() {
		this.hasFolded = true;
		this.hasChecked = false;
		this.isAllIn = false;
		this.hasPlayed = true;
		console.log(`${this.name} folded.`);
	}

	check() {
		this.hasChecked = true;
		this.hasPlayed = true;
		console.log(`${this.name} checked.`);
	}

	goAllIn() : number {
		this.isAllIn = true;
		this.hasChecked = false;
		this.hasFolded = false;
		this.hasPlayed = true;
		
		let betSize = this.chips;
		this.chips = 0;
		return betSize;
	}

	bet(amount : number) {
		this.chips -= amount;
		this.roundBetAmount += amount;
		this.hasPlayed = true;
		console.log(`${this.name} bet ${amount}.`);
	}

	canPlay() {

	}
}