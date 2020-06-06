import { Card } from "../cards/Card";
import { HandType } from "./HandType";

export interface Detection {
	type: HandType,
	result: Boolean,
	cards?: Card[],
	value?: number
}

