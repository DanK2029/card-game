import { Card } from './card';

/**
 * A queue of cards that can be drawn from discarded to in a fight.
 */
 class CardQueue {

	private _cards: Card[];

	/**
	 * Creates an empty card queue
	 */
	constructor() {
		this._cards = [];
	}

	get cards(): Card[] { return this._cards; }

	/**
	 * Returns the number of cards in the queue.
	 */
	get size(): number {
		return this._cards.length;
	}

	/**
	 * Adds a card to the front of the card list at position 0.
	 * 
	 * @param {Card} card - The card to add.
	 */
	addToFront(card: Card): void {
		this._cards.unshift(card);
	}

	/**
	 * Adds a card to the back of the lard list at position length - 1.
	 * 
	 * @param {Card} card - The card to add.
	 */
	addToBack(card: Card): void {
		this._cards.push(card);
	}

	/**
	 * Helper function to get a random integer between the ranges of [min, max].
	 * If either min or max are not whole numbers they will be rounded down.
	 * 
	 * @param {number} min - The minimum bounds on the randomly generated number.
	 * @param {number} max - The maximuim bounds on the randomly generated number.
	 * @returns {number} - The randomly generated number.
	 */
	private getRandomInt(min: number, max: number): number {
		min = Math.floor(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	}

	/**
	 * Adds a card to a random position in the queue.
	 * 
	 * @param {Card} card - The card to add.
	 */
	addToRandomPosition(card: Card): void {
		const randomPosition: number = this.getRandomInt(0, this._cards.length + 1);
		this._cards.splice(randomPosition, 0, card);
	}

	/**
	 * Sorts the cards into new random positions.
	 */
	shuffle(): void {
		this._cards.sort(() => Math.random() - 0.5);
	}

	/**
	 * Removed the first card in the queue and returns it.
	 * 
	 * @returns {Card} - The removed card.
	 */
	removeFromFront(): Card {
		return this._cards.shift();
	}

	/**
	 * Removed the last card in the queue and returns it.
	 * 
	 * @returns {Card} - The removed card.
	 */
	removeFromBack(): Card {
		return this._cards.pop();
	}

	/**
	 * Removed the card from the card list at the specified index.
	 * 
	 * @param {number} index - The index of the card to be removed.
	 * @returns {Card} - The removed card.
	 */
	removeFromIndex(index: number): Card {
		return this._cards.splice(index, 1)[0];
	}

	/**
	 * Searches for the index of a card within the card queue.
	 * 
	 * @param {Card} card - The card to search for.
	 */
	getCardIndex(card: Card): number {
		return this._cards.findIndex((c: Card) => {
			return card.id === c.id;
		});
	}
}

export { CardQueue }