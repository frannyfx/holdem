import { Deck } from "./engine/cards/Deck";
import { Player } from "./engine/Player";
import { Table } from "./engine/Table";
import { Action, Type as ActionType} from "./engine/Action";

let table = new Table(9, 2500);
let player1 = new Player("player1", 100000);
let player2 = new Player("player2", 100000);
let player3 = new Player("player3", 100000);

table.addPlayer(player1);
table.addPlayer(player2);
table.addPlayer(player3);

table.startNewHand();
table.getHand()!.takeTurn(player1, {
	type: ActionType.Raise,
	amount: 10000
});

table.getHand()!.takeTurn(player2, {
	type: ActionType.Call
});

table.getHand()!.takeTurn(player3, {
	type: ActionType.Call
});