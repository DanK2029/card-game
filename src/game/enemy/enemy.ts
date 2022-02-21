import { v4 as uuidv4 } from 'uuid';
import {
	Texture,
	Sprite,
	Container,
	Graphics,
	Loader,
	Text
} from 'pixi.js';

type EnemySet = {
	[key: string]: Enemy;
}

type GuiProperties = {
	backgroundColor: number,
	healthColor: number,
	blockColor: number,
	blockRadius: number,
	spriteWidth: number;
	spriteHeight: number;
	boarderWidth: number;
	boarderHeight: number;
	healthBarRadius: number;
	heatlhBarThickness: number;
	nameHeight: number;
}


class Enemy {

	private _name: string;
	private _id: string;
	private _health: number;
	private _maxHealth: number;
	private _block: number;
	private _isDead: boolean;

	private _container: Container;

	private _guiProps: GuiProperties;

	constructor(name: string, health: number, maxHealth: number) {
		this._name = name;
		this._id = uuidv4();
		this._health = 50;
		this._maxHealth = 50;
		this._block = 0;
		this._isDead = false;
		this._container = new Container();
		this._container.name = name;

		this._guiProps = {
			backgroundColor: 0x555555,
			healthColor: 0xCC0000,
			blockColor: 0x888888,
			blockRadius: 30,
			spriteWidth: undefined,
			spriteHeight: undefined,
			boarderWidth: 20,
			boarderHeight: 10,
			healthBarRadius: 10,
			heatlhBarThickness: 20,
			nameHeight: 40,
		}

		this.initSprite();
	}

	get name(): string { return this._name; }
	set name(name: string) { this._name = name; }

	get id(): string { return this._id; }

	get block(): number { return this._block; }
	set block(block: number) { this._block = block; }

	get isDead(): boolean { return this._isDead; }

	get container(): Container { return this._container; }

	recieveDamage(damage: number): void {
		if (this._isDead) return;
		this._health -= damage;
		this.updateHealthBar();
		if (this._health <= 0) {
			this._isDead = true;
			this.die();
		}
	}

	gainBlock(block: number): void {
		this._block += block;
		console.log(`Gained ${block} block`);
		this.updateHealthBar();
	}

	resetBlock(): void {
		this._block = 0;
		this.updateHealthBar();
	}

	private die(): void {
		console.log(`Enemy ${this._name}:${this._id} died`);
		this._container.destroy();
	}

	private initSprite(): void {
		const loader: Loader = new Loader();
		
		loader.add(`texture_${this.name}`, `assets/textures/${this.name}.png`);
		loader.load((loader, resources) => {
			let texture: Texture = resources[`texture_${this.name}`].texture as Texture;
			let sprite: Sprite = new Sprite(texture);
			sprite.name = `sprite_${this.name}`;
			sprite.y = this._guiProps.nameHeight;
			this._container.addChild(sprite);

			this.drawHealthBar();
			this.drawName();
		});
	}

	private drawName(): void {
		const sprite: Sprite = this.container.getChildByName(`sprite_${this.name}`) as Sprite;
		const nameText: Text = new Text(this.name, 
			{
				fontFamily: 'Arial',
				fontSize: 36,
				fill: 0xFFFFFF,
				align: 'center'
			}
		);
		nameText.name = 'name_text';
		nameText.anchor.x = 0.5;
		nameText.x = sprite.width/2;
		
		this._container.addChild(nameText);
	}

	private drawBlock(): void {
		let blockShield = new Graphics();
		blockShield.name = 'block_shield';
		const shieldHeight: number = this._guiProps.nameHeight 
			+ this._guiProps.spriteHeight 
			+ this._guiProps.boarderHeight
			+ this._guiProps.heatlhBarThickness/2;

		blockShield.beginFill(this._guiProps.blockColor);
		blockShield.lineStyle(0, this._guiProps.blockColor);
		blockShield.drawCircle(
			this._guiProps.boarderWidth,
			shieldHeight,
			this._guiProps.blockRadius
		)
		this._container.addChild(blockShield);

		const blockText: Text = new Text(this.block.toString(), 
			{
				fontFamily: 'Arial',
				fontSize: 24,
				fill: 0xFFFFFF,
				align: 'center'
			}
		);
		blockText.name = 'block_text';
		blockText.anchor.x = 0.5;
		blockText.anchor.y = 0.5;
		blockText.x = this._guiProps.boarderWidth;
		blockText.y = shieldHeight;
		
		this.container.addChild(blockText);
	 }

	private drawHealthBar(): void {
		const sprite: Sprite = this.container.getChildByName(`sprite_${this.name}`) as Sprite;
		this._guiProps.spriteWidth = sprite.width;
		this._guiProps.spriteHeight = sprite.height;

		const props: GuiProperties = this._guiProps;
		
		let healthBarBack: Graphics = new Graphics();
		healthBarBack.name = 'health_bar_back';

		const healthBarColor: number = this._block > 0
			? props.blockColor
			: props.healthColor;

		const healthBarY: number = props.nameHeight + props.spriteHeight + props.boarderHeight;
		const healthBarWidth: number = props.spriteWidth - (2 * props.boarderWidth);

		healthBarBack.beginFill(healthBarColor);
		healthBarBack.lineStyle(0, healthBarColor);
		healthBarBack.drawRoundedRect(
			props.boarderWidth,
			healthBarY,
			healthBarWidth,
			props.heatlhBarThickness,
			this._guiProps.healthBarRadius
		);

		this._container.addChild(healthBarBack);

		let healthBar: Graphics = new Graphics();
		healthBar.name = 'health_bar';

		healthBar.beginFill(props.healthColor);
		healthBar.lineStyle(0, props.healthColor);
		healthBar.drawRoundedRect(
			props.boarderWidth,
			healthBarY,
			healthBarWidth,
			props.heatlhBarThickness,
			this._guiProps.healthBarRadius
		);

		this._container.addChild(healthBar);

		let healthText: Text = new Text(`${this._health}/${this._maxHealth}`,
			{
				fontFamily: 'Arial',
				fontSize: 22,
				fill: 0xFFFFFF,
				align: 'center'
			}
		);
		healthText.name = 'health_text';
		healthText.anchor.x = 0.5;
		healthText.anchor.y = 0.1;
		healthText.x = sprite.width/2;
		healthText.y = healthBarY;

		this._container.addChild(healthText);
	}

	updateHealthBar(): void {
		const healthBar: Graphics = this._container.getChildByName('health_bar') as Graphics;
		if (!healthBar) {
			console.error(`Trying to update enemy ${this.name}:${this.id} healthbar before it is rendered`);
		} else {
			healthBar.clear();
	
			const props: GuiProperties = this._guiProps;
	
			const healthRatio: number = this._health / this._maxHealth;
			const healthBarWidth: number = props.spriteWidth * healthRatio;

			const healthBarColor: number = this._block > 0
				? props.blockColor
				: props.healthColor;

			healthBar.beginFill(healthBarColor);
			healthBar.lineStyle(0, healthBarColor);
			
			healthBar.drawRoundedRect(
				props.boarderWidth,
				props.nameHeight + props.spriteHeight + props.boarderHeight,
				Math.max(healthBarWidth - (2 * props.boarderWidth), 0),
				props.heatlhBarThickness,
				this._guiProps.healthBarRadius
			);

			let healthText: Text = this._container.getChildByName('health_text') as Text;
			healthText.text = `${this._health}/${this._maxHealth}`;

			if (this._block > 0) {
				this.drawBlock();
			} else {
				this._container.getChildByName('block_shield').destroy();
				this._container.getChildByName('block_text').destroy();
			}
		}
	}

	copy(): Enemy {
		let copy: Enemy = new Enemy(
			this._name,
			this._health,
			this._maxHealth
		);
		return copy;
	}
}

export { Enemy, EnemySet }