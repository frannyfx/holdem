export enum Type {
	Fold = 0,
	Check = 1,
	Call = 2,
	Raise = 3
};

export interface Action {
	type: Type,
	amount?: number
};