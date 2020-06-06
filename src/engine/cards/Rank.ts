// Define value interface
export interface Rank {
	value: number,
	symbol: String,
	name: String
};

// Define different values
const Ace : Rank = {
	value: 14,
	symbol: "A",
	name: "Ace"
};

const Two : Rank = {
	value: 2,
	symbol: "2",
	name: "Two"
};

const Three : Rank = {
	value: 3,
	symbol: "3",
	name: "Three"
};

const Four : Rank = {
	value: 4,
	symbol: "4",
	name: "Four"
};

const Five : Rank = {
	value: 5,
	symbol: "5",
	name: "Five"
};

const Six : Rank = {
	value: 6,
	symbol: "6",
	name: "Six"
};

const Seven : Rank = {
	value: 7,
	symbol: "7",
	name: "Seven"
};

const Eight : Rank = {
	value: 8,
	symbol: "8",
	name: "Eight"
};

const Nine : Rank = {
	value: 9,
	symbol: "9",
	name: "Nine"
};

const Ten : Rank = {
	value: 10,
	symbol: "10",
	name: "Ten"
};

const Jack : Rank = {
	value: 11,
	symbol: "J",
	name: "Jack"
};

const Queen : Rank = {
	value: 12,
	symbol: "Q",
	name: "Queen"
};

const King : Rank = {
	value: 13,
	symbol: "K",
	name: "King"
};


// Export enum
export const Ranks : { [key: string] : Rank } = {
	Ace,
	Two,
	Three,
	Four,
	Five,
	Six,
	Seven,
	Eight,
	Nine,
	Ten,
	Jack,
	Queen,
	King
};