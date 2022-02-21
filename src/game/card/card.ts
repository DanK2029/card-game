import { v4 as uuidv4 } from 'uuid';

import { Fight } from '../fight/fight'
import { EnemySet } from '../enemy/enemy';

enum CardType {
	ATTACK,
	SKILL,
	POWER
}

type PlayCallback = (fight: Fight, target?: EnemySet) => void;

class Card {

	private _name: string;
	private _type: CardType;
	private _description: string;
	private _playCallback: PlayCallback;
	private _cost: number;
	private _upgraded: boolean;
	private _id: string;

	constructor(name: string, type: CardType, cost: number, description: string, playCallback: PlayCallback) {
		this._name = name;
		this._type = type;
		this._description = description;
		this._playCallback = playCallback;
		this._cost = cost;
		this._upgraded = false;
		this._id = uuidv4();
	}

	play(fight: Fight, target?: EnemySet) {
		this._playCallback(fight, target);
	}

	get name(): string { return this._name; }
	set name(name: string) { this._name = name; }

	get type(): CardType { return this._type; }
	set type(type: CardType) { this._type = type; }

	get description(): string { return this._description; }
	set description(description: string) { this._description = description; }

	get playCallback(): PlayCallback { return this._playCallback; }
	set playCallback(playCallback: PlayCallback) { this._playCallback = playCallback; }

	get cost(): number { return this._cost; }
	set cost(cost: number) { this._cost = cost; }

	get upgraded(): boolean { return this._upgraded; }
	set upgraded(upgraded: boolean) { this._upgraded = upgraded; }

	get id(): string { return this._id; }

	copy(): Card {
		let copy: Card = new Card(
			this._name,
			this._type,
			this._cost,
			this._description,
			this._playCallback
		);

		return copy;
	}
}

class CardQueue {

	private _cards: Card[];

	constructor() {
		this._cards = [];
	}

	addToFront(card: Card) {
		this._cards.unshift(card);
	}

	addToBack(card: Card) {
		this._cards.push(card);
	}

	private getRandomInt(min: number, max: number) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	}

	addToRandomPosition(card: Card) {
		const randomPosition: number = this.getRandomInt(0, this._cards.length + 1);
		this._cards.splice(randomPosition, 0, card);
	}

	shuffle() {
		this._cards.sort(() => Math.random() - 0.5);
	}

	removeFromFront(): Card {
		return this._cards.shift();
	}

	removeFromBack(): Card {
		return this._cards.pop();
	}

	removeFromIndex(index: number): Card {
		return this._cards.splice(index, 1)[0];
	}

	get size(): number {
		return this._cards.length;
	}
}

export { Card, CardType, PlayCallback, CardQueue };