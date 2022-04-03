import { 
	Bounds,
	Container,
	Graphics,
	Text,
	utils
} from 'pixi.js';
import { v4 as uuidv4 } from 'uuid';

import { Fight } from '../fight/fight'
import { EnemySet } from '../character/enemy/enemy';

enum CardType {
	ATTACK,
	SKILL,
	POWER
}

type PlayCallback = (fight: Fight, target?: EnemySet) => void;

/**
 * Card - Represents an action the player can take while in a fight.
 */
class Card extends Container {

	private _type: CardType;
	private _description: string;
	private _playCallback: PlayCallback;
	private _cost: number;
	private _upgraded: boolean;
	private _id: string;
	private _dragging: boolean;

	/**
	 * Creates a card that can be played by the player while in a fight.
	 * 
	 * @param {string} name - The name of the card.
	 * @param {CardType} type - The type of the card: attack, skill, or power.
	 * @param {number} cost - The amount of enery is used to play this card.
	 * @param {string} description - A text that describes what will happen when the player plays this card in a fight.
	 * @param {PlayCallback} playCallback - The function that defines the actions that will occur in game when this card is played.
	 */
	constructor(name: string, type: CardType, cost: number, description: string, playCallback: PlayCallback) {
		super();
		
		this.name = name;
		this._type = type;
		this._description = description;
		this._playCallback = playCallback;
		this._cost = cost;
		this._upgraded = false;
		this._id = uuidv4();

		this.interactive = true;
		this._dragging = false;

		this.initContainer();
	}

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

	/**
	 * Invokes the card's unique callback function that alters either the player or the enemies.
	 * 
	 * @param {Fight} fight - The fight this card was played in.
	 * @param {EnemySet} target - The enemy/enemies that this card will effect.
	 */
	play(fight: Fight, target?: EnemySet) {
		this._playCallback(fight, target);
	}

	/**
	 * Creates a new instance of the card and copies all the properties to the new instance.
	 * 
	 * @returns {Card} - the copied instance of the card
	 */
	copy(): Card {
		let copy: Card = new Card(
			this.name,
			this._type,
			this._cost,
			this._description,
			this._playCallback
		);

		return copy;
	}

	/**
	 * Called when the card is created. Handled all PIXI graphics specifics.
	 */
	private initContainer(): void {

		let offsetX: number = 0;
		let offsetY: number = 0;

		let originalZ: number = -1;

		this.on('mousedown', (event) => {
			offsetX = event.data.global.x - this.x;
			offsetY = event.data.global.y - this.y;

			originalZ = this.zIndex;
			this.zIndex = Infinity;

			this.x = event.data.global.x - offsetX;
			this.y = event.data.global.y - offsetY;

			this._dragging = true;
		});

		
		this.on('mousemove', (event: any) => {
			if (this._dragging) {
				this.x = event.data.global.x - offsetX;
				this.y = event.data.global.y - offsetY;
			}
		});

		this.on('mouseup', (event) => {
			this.x = event.data.global.x - offsetX;
			this.y = event.data.global.y - offsetY;

			this.zIndex = originalZ;

			this._dragging = false;
		});

		let rectangle: Graphics = new Graphics();
		rectangle.beginFill(0xEE4455);
		rectangle.lineStyle(2, 0xAA0011);
		rectangle.drawRoundedRect(0, 0, 150, 200, 5);
		rectangle.endFill();
		rectangle.interactive = true;
		this.addChild(rectangle);

		let name: Text = new Text(this.name);
		name.anchor.x = 0.5;
		name.x = this.width / 2;
		this.addChild(name);

		this._bounds.minX = 0;
		this._bounds.minY = 0;
		this._bounds.maxX = this.width;
		this._bounds.maxY = this.height;
	}
}

export { Card, CardType, PlayCallback };