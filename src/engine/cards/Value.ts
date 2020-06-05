// Define value interface
export interface Value {
	value: number,
	symbol: String,
	name: String
};

// Define different values
const Ace : Value = {
	value: 14,
	symbol: "A",
	name: "Ace"
};

const Two : Value = {
	value: 2,
	symbol: "2",
	name: "Two"
};

const Three : Value = {
	value: 3,
	symbol: "3",
	name: "Three"
};

const Four : Value = {
	value: 4,
	symbol: "4",
	name: "Four"
};

const Five : Value = {
	value: 5,
	symbol: "5",
	name: "Five"
};

const Six : Value = {
	value: 6,
	symbol: "6",
	name: "Six"
};

const Seven : Value = {
	value: 7,
	symbol: "7",
	name: "Seven"
};

const Eight : Value = {
	value: 8,
	symbol: "8",
	name: "Eight"
};

const Nine : Value = {
	value: 9,
	symbol: "9",
	name: "Nine"
};

const Ten : Value = {
	value: 10,
	symbol: "10",
	name: "Ten"
};

const Jack : Value = {
	value: 11,
	symbol: "J",
	name: "Jack"
};

const Queen : Value = {
	value: 12,
	symbol: "Q",
	name: "Queen"
};

const King : Value = {
	value: 13,
	symbol: "K",
	name: "King"
};


// Export enum
export const Values : { [key: string] : Value } = {
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