import { Card } from "../cards/Card";

export interface Detection {
	result: Boolean,
	cards?: Card[],
	value?: number
}

