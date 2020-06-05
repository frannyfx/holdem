// Name generation
const adjectives = ["Chich", "Atheist", "Quick", "Fast", "Hot", "Sexy", "Nice", "Floppy", "Wet", "Moist", "Neeky"];
const nouns = ["Muck", "Win", "Call", "Bluff", "Booper", "Weed", "Bugzy", "Malone", "Flop", "Fintan"];
const minNameGenerationNumber = 10;
const maxNameGenerationNumber = 100;

function generateName() {
	return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * (maxNameGenerationNumber - minNameGenerationNumber)) + minNameGenerationNumber}`;
}

export class Player {
	name: String;
	stack: Number;
	constructor(name : String | null, stack : Number) {
		// Set name
		this.name = !!name ? name : generateName();

		// Set chip stack
		this.stack = stack;
	}
}