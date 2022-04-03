import {
    Container,
    Loader,
    LoaderResource,
    Texture,
    Sprite,
    Text,
    utils,
} from "pixi.js";
import { v4 as uuidv4 } from 'uuid';

import { eventManager } from "../utils/eventEmitter";
import { HealthBar } from "./healthbar";

/**
 * Character - Either an enempy or a playable character within the game. A character has
 * health and can perform actions within a fight.
 */
class Character extends Container {

	private _id: string;
	private _health: number;
	private _maxHealth: number;
	private _block: number;
	private _isDead: boolean;

    private _healthBar: HealthBar;

    /**
     * Create a character entity with a max health and name. A character starts out with full health.
     * 
     * @param {string} name - The name of the character.
     * @param {number} maxHealth - The maximum health value a character can have.
     */
    constructor(name: string, maxHealth: number) {
        super()
        this.name = name;
        
        this._id = uuidv4();
        this._health = maxHealth;
        this._maxHealth = maxHealth;
        this._block = 0;
        this._isDead = false;

        this.interactive = true;

        this.initContainer();
    }

    get id(): string { return this._id; }
    get health(): number { return this._health; }
    get maxHealth(): number { return this._maxHealth; }
    get block(): number { return this._block; }
    get isDead(): boolean { return this._isDead; }
    
    /**
     * Called when the character is created. Handled all PIXI graphics specifics.
     */
    private initContainer(): void {
        const loader: Loader = new Loader();
        loader.add(`texture_${this.name}`, `assets/textures/${this.name}.png`);
        loader.load((loader: Loader, resources: {[key: string]: LoaderResource}) => {
            let texture: Texture = resources[`texture_${this.name}`].texture as Texture;
			let sprite: Sprite = new Sprite(texture);

            let nameText: Text = new Text(
                this.name,
                {
                    fontSize: 20,
                    fill: ["white"],
                    strokeThickness: 3,
                }
            );
            nameText.anchor.x = 0.5;
            nameText.x = sprite.width/2;
            this.addChild(nameText);

			sprite.name = `sprite_${this.name}`;
            sprite.y = nameText.height;
            
            this._healthBar = new HealthBar(this._health, this._maxHealth, sprite.width, 20);
            this._healthBar.y = sprite.y + sprite.height;

            this.addChild(sprite);
            this.addChild(this._healthBar);
        });
    }

    /**
     * Adds block to the character.
     * 
     * @param {string} blockGained - The amound of block gained. 
     */
    addBlock(blockGained: number): void {
        this._block += blockGained;
        this._healthBar.addBlock(blockGained);
    }

    /**
     * Reduces the health of a character. If the reduced health is equal to or less than zero
     * the character will die. If a character has more than zero block the character's health 
     * will reduce by block - damage. 
     * 
     * @param {number} damage - The amound of damage the character will recieve.
     */
    receiveDamage(damage: number): void {
        const blockAfterDamage: number = this._block - damage;
        if (blockAfterDamage <= 0) {
            // take damage with negative block
            this._block = 0;
            this._health += blockAfterDamage;
            this._healthBar && this._healthBar.subtractHealth(Math.abs(blockAfterDamage));
            if (this._health <= 0) {
                this.die();
            }
        } else {
            this._block = blockAfterDamage;
        }
    }

    /**
     * Function called when the character dies.
     */
    die(): void {
        if (this.parent) {
            this.parent.removeChild(this);
            eventManager.emit('death');
        }
    }
}

export { Character }