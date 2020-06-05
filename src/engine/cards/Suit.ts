// Define suit interface
export interface Suit {
	value: number;
	symbol: String;
	name: String;
};

// Define different suits
const Clubs : Suit = {
	value: 0,
	symbol: "♣",
	name: "Clubs"
};

const Diamonds : Suit = {
	value: 1,
	symbol: "♦",
	name: "Diamonds"
};

const Hearts : Suit = {
	value: 2,
	symbol: "♥",
	name: "Hearts"
};

const Spades : Suit = {
	value: 3,
	symbol: "♠",
	name: "Spades"
};

// Export enum
export const Suits : { [key: string] : Suit } = {
	Clubs,
	Diamonds,
	Hearts,
	Spades
};
