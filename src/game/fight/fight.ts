import { Player } from '../player/player'
import { Card, CardQueue } from '../card/card'
import { Enemy, EnemySet } from '../enemy/enemy'

class Fight {

	private _player: Player;
	private _enemies: EnemySet;

	private _isPlayerTurn: boolean;

	private _drawPile: CardQueue;
	private _hand: CardQueue;
	private _discardPile: CardQueue;

	constructor(player: Player, enemies: EnemySet) {
		this._player = player;
		this._enemies = enemies;
		this._isPlayerTurn = true;

		this._drawPile = new CardQueue();
		this._hand = new CardQueue();
		this._discardPile = new CardQueue();

		this.initFight();
	}

	get player(): Player { return this._player; }

	playCardInHand(index: number, target: EnemySet) {
		let card: Card = this._hand.removeFromIndex(index);
		card.playCallback(this, target);
		this._discardPile.addToBack(card);
	}

	initFight(): void {
		this._player.deck.forEach((card: Card) => {
			this._drawPile.addToFront(card);
		});
		this._drawPile.shuffle();
	}

	startTurn(): void {
		this.drawCards();
	}

	endTurn(): void {
		this.discardHand();
	}

	drawCards(): void {
		let cardsDrawn: number = 0;
		while (this._hand.size < this._player.maxHandSize && cardsDrawn < this._player.cardsDrawnPerTurn) {
			if (this._drawPile.size > 0) {
				this._hand.addToBack(this._drawPile.removeFromFront());
				cardsDrawn++;
			} else {
				this.shuffleDiscardIntoDraw();
			}
		}
	}

	discardHand(): void {
		while (this._hand.size > 0) {
			this._discardPile.addToFront(this._hand.removeFromFront());
		}
	}

	shuffleDiscardIntoDraw(): void {
		while (this._discardPile.size > 0) {
			this._drawPile.addToFront(this._discardPile.removeFromFront());
		}
		this._drawPile.shuffle();
	}
}

export { Fight }