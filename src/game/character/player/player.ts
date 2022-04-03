import { Card } from '../../card/card'
import { Character } from '../character';

/**
 * Player - A character that is controlled by the player.
 */
class Player extends Character {

	private _deck: Card[];
	private _cardsDrawnPerTurn;
	private _maxHandSize;

	/**
	 * Creates a player entity with a name and max health. A character starts out with full health.
	 * 
	 * @param {string} name - The name of the player character.
	 * @param {string} maxHealth - The maximum amount of health a player can have.
	 */
	constructor(name: string, maxHealth: number) {
		super(name, maxHealth);
		
		this._deck = [];
		this._cardsDrawnPerTurn = 5;
		this._maxHandSize = 10;
	}

	get deck(): Card[] { return this._deck; }
	get maxHandSize(): number { return this._maxHandSize; }
	get cardsDrawnPerTurn(): number { return this._cardsDrawnPerTurn; }
	
	/**
	 * Adds a card to the player's deck.
	 * 
	 * @param {string} card - The card to add to the player's deck.
	 */
	addCard(card: Card): void {
		this._deck.push(card);
	}
}

export { Player }