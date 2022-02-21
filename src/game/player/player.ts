import { Card } from '../card/card'

class Player {

	private _health: number;
	private _maxHealth: number;

	private _deck: Card[];
	private _cardsDrawnPerTurn;
	private _maxHandSize;

	private _block: number;

	constructor() {
		this._health = 50;
		this._maxHealth = 50;
		this._deck = [];

		this._cardsDrawnPerTurn = 5;
		this._maxHandSize = 10;

		this._block = 0;
	}

	addCard(card: Card): void {
		this._deck.push(card);
	}

	recieveDamage(damage: number) {
		this._health -= damage;
		if (this._health <= 0) {
			this.die();
		}
	}

	addBlock(additionalBlock: number) {
		this._block += additionalBlock;
	}

	resetBlock() {
		this._block = 0;
	}

	private die() {
		console.log('Player died');
	}

	get deck(): Card[] { return this._deck; }

	get maxHandSize(): number { return this._maxHandSize; }
	get cardsDrawnPerTurn(): number { return this._cardsDrawnPerTurn; }
}

export { Player }