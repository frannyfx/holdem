import { Deck } from "./engine/cards/Deck";
import { Player } from "./engine/Player";
import { Table } from "./engine/Table";

let table = new Table();
let player = new Player(null, 100);
table.addPlayer(player);