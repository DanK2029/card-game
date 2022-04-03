import {
	Container,
	Point,
	utils
} from 'pixi.js';

import { Player } from '../character/player/player'
import { Card } from '../card/card'
import { CardQueue } from '../card/cardQueue';
import { Enemy, EnemySet } from '../character/enemy/enemy'
import { eventManager } from '../utils/eventEmitter';

import { boundsOverlap } from '../utils/math';

/**
 * Fight - An event where the player attempts to defeat a set of enemies
 */
class Fight extends Container {

	private _player: Player;
	private _enemies: EnemySet;

	private _isPlayerTurn: boolean;

	private _drawPile: CardQueue;
	private _hand: CardQueue;
	private _discardPile: CardQueue;

	private _handCardPositions: Point[];

	/**
	 * Creates a fight event between a player and a set of enemies
	 * 
	 * @param {Player} player - The player character
	 * @param {EnemySet} enemies - The set of enemies the player must defeat
	 */
	constructor(player: Player, enemies: EnemySet) {
		super();
		this._player = player;
		this._enemies = enemies;
		this._isPlayerTurn = true;

		this._drawPile = new CardQueue();
		this._hand = new CardQueue();
		this._discardPile = new CardQueue();

		this._handCardPositions = Array.from(
			{
				length: this._player.maxHandSize
			},
			(_, i) => {
				const cardWidth: number = 150;
				return new Point(
					10 + (i * (cardWidth + 10)),
					700
				);
			}
		);

		this.sortableChildren = true;

		eventManager.addListener('death', this.fightOverCheck);

		this.initFight();
		this.initContainer();
	}

	get player(): Player { return this._player; }

	/**
	 * Calls the card's play callback function at the specified index in the player's hand and removes that card from the player's hand.
	 * 
	 * @param {number} index - The index of the card in the players hand array to be played.
	 */
	playCardInHand(index: number): void {
		let card: Card = this._hand.removeFromIndex(index);
		this.removeChild(card);
		card.playCallback(this, this._enemies);
		this.repositionHand();
		this._discardPile.addToBack(card);
	}

	/**
	 * Called at the start of each fight event. Places each card in the player's deck into the draw pile.
	 */
	initFight(): void {
		this._player.deck.forEach((card: Card) => {

			// card.on('mousemove', () => {
			// 	for (const enemy in this._enemies) {
			// 		console.log(card.name);
			// 		const collision: boolean = boundsOverlap(card._bounds, this._enemies[enemy]._bounds)
			// 		console.log(collision);
			// 	}
			// })

			this._drawPile.addToFront(card);
		});
		this._drawPile.shuffle();
	}

	/**
	 * Checks if all enemies have been defeated returns.
	 * 
	 * @returns {boolean} - True if fight is over false otherwise.
	 */
	private fightOverCheck(): boolean {
		let fightOver: boolean = true;
		for (const enemy in this._enemies) {
			if (!this._enemies[enemy].isDead) {
				fightOver = false;
			}
		}
		console.log('fight over');
		return fightOver;
	}

	/**
	 * Called at the start of the player's turn. Adds the correct number of cards into the player's hand.
	 */
	startTurn(): void {
		this.addCardsToHand();
	}

	/**
	 * Called at the end of the player's turn. Discards the correct number of cards into player's discard pile.
	 */
	endTurn(): void {
		this.discardHand();
	}

	/**
	 * Places cards from the draw pile into the player's hand. The maximum number of cards drawn by the player 
	 * is defined by player's cardsDrawnPerTurn constant. The player will not stop drawing cards if the player's 
	 * hand size is equal to or greater than player's maxHandSize constant. If the player needs to draw a card 
	 * and the draw pile is empty the cards in the discard pile will be shuffled and added to the draw pile and 
	 * the player will continue to draw.
	 */
	addCardsToHand(): void {
		let cardsDrawn: number = 0;
		while (this._hand.size < this._player.maxHandSize && cardsDrawn < this._player.cardsDrawnPerTurn) {
			if (this._drawPile.size > 0) {
				let drawnCard: Card = this._drawPile.removeFromFront();

				drawnCard.zIndex = this._hand.size + 1;

				drawnCard.x = this._handCardPositions[this._hand.size].x;
				drawnCard.y = this._handCardPositions[this._hand.size].y;
				
				this.addCardToHand(drawnCard);

				cardsDrawn++;
			} else {
				this.shuffleDiscardIntoDraw();
			}
		}
	}

	/**
	 * Adds a card to the player's hand.
	 * 
	 * @param {Card} card - The card to add.
	 */
	private addCardToHand(card: Card): void {
		this._hand.addToBack(card);
		card.on('mouseup', () => {
			const index: number = this._hand.getCardIndex(card);
			const end: Point = this._handCardPositions[index];
			const start: Point = card.position;

			this.playCardInHand(index);

			// let time: number = 0;
			// const lerpCallBack: TickerCallback<any> = (dt: number) => {
			// 	time += 0.05;

			// 	const lerpedPoint: Point = lerpPoint(start, end, time);
			// 	card.position.set(lerpedPoint.x, lerpedPoint.y);
			// 	const dist: number = pointDistance(start, end);
				
			// 	if (dist < 0.001) {
			// 		Ticker.shared.remove(lerpCallBack)
			// 	}
			// };
			// Ticker.shared.add(lerpCallBack);
		});
		this.addChild(card);
	}

	/**
	 * After a card is discarded or added to the player's hand the cards positions need to be updated.
	 */
	private repositionHand(): void {
		this._hand.cards.forEach((card: Card, index: number) => {
			const newPosition: Point = this._handCardPositions[index];
			card.position.set(newPosition.x, newPosition.y)
		});
	}

	/**
	 * Removes the cards from the player's hand array and adds them to the discard pile.
	 */
	discardHand(): void {
		while (this._hand.size > 0) {
			this._discardPile.addToFront(this._hand.removeFromFront());
		}
	}

	/**
	 * Removes all cards from the discard pile and adds them to the draw pile. 
	 * The positions of the cards in the draw pile are then randomized.
	 */
	shuffleDiscardIntoDraw(): void {
		while (this._discardPile.size > 0) {
			this._drawPile.addToFront(this._discardPile.removeFromFront());
		}
		this._drawPile.shuffle();
	}

	/**
	 * Called when the fight is created. Handled all PIXI graphics specifics.
	 */
	private initContainer(): void {
		this._player.position.set(10, 10);
		this.addChild(this._player);

		let enemyX = 500;
		for (let enemy in this._enemies) {
			let curEnemy: Enemy = this._enemies[enemy];
			curEnemy.position.set(enemyX, 10);
			this.addChild(curEnemy);
		}

		// draw hand
		this.addCardsToHand();
	}
}

export { Fight }