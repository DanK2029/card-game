import { 
    Graphics,
    Container,
    Text
} from 'pixi.js';

/**
 * HealthBar - Displays the current block and health of the character as well as their max health.
 */
class HealthBar extends Container {
    
    private _health: number;
    private _maxHealth: number;

    private _block: number;

    private _healthColor: number;
    private _backgroundColor: number;
    private _cornerRadius: number;

    private _blockColor: number;
    private _blockRadius: number;

    /**
     * Creates a health bar to be displayed in fights.
     * 
     * @param {number} health - The amound of health the character has.
     * @param {number} maxHealth - The maximum amount of health a character can have.
     * @param {number} width - The width in pixels of the health bar.
     * @param {number} height - The height in pixels of the health bar.
     */
    constructor(health: number, maxHealth: number, width: number, height: number) {
        super();
        
        this._health = health;
        this._maxHealth = maxHealth;

        this._height = height;
        this._width = width;

        this._block = 0;

        this._healthColor = 0xFF0000;
        this._backgroundColor = 0x555555;
        this._cornerRadius = 5;

        this._blockColor = 0x777777;
        this._blockRadius = 10;

        this.sortableChildren = true;

        this.initContainer();
    }

    get health(): number { return this._health; }
    set health(health: number) { this._health = health; }

    get maxHealth(): number { return this._maxHealth; }
    set maxHealth(maxHealth: number) { this._maxHealth = maxHealth; }

    get height(): number { return this._height; }
    set height(height: number) { this._height = height; }

    get width(): number { return this._width; }
    set width(width: number) { this._width = width; }

    get block(): number { return this._block; }
    set block(block: number) { this._block = block; }

    /**
     * Updates the graphics of the health bar with the current values.
     */
    public update(): void {
        const text: Text = this.getChildByName('health_text') as Text;
        text.text = `${this._health} / ${this._maxHealth}`;

        const curHealthColor: number = this.block > 0 
            ? this._blockColor
            : this._healthColor;

        const health: Graphics = this.getChildByName('health') as Graphics;
        health.clear();
        health.beginFill(curHealthColor);
        health.tint = 0xDDDDDD;
        health.lineStyle(0, curHealthColor);
        health.drawRoundedRect(0, text.height, 
            this.getHealthRatio() * this.width, this.height, this._cornerRadius);
        
        let blockShield: Graphics = this.getChildByName('block_shield') as Graphics;
        blockShield.visible = this.block > 0;
        let blockText: Text = blockShield.getChildByName('block_text') as Text;
        blockText.text = `${this._block}`;

    }

    /**
     * Increases the amount of health in the health bar. You cannot add negative health. The health bar's current
     * health cannot be greater than its max health.
     * 
     * @param {number} healthGained - The amount of health to increase by.
     * @returns {number} - The new current health.
     */
    public addHealth(healthGained: number): number {
        if (healthGained <= 0) {
            throw new Error('Health gained is less than 0!');
        }

        this._health += healthGained;
        if (this._health > this._maxHealth) {
            this._health = this._maxHealth;
        }

        this.update();
        return this._health;
    }

    /**
     * Decreases the amount of health in the health bar. You cannot subtract negative health. The health bar's
     * current health cannot be less than zero.
     * 
     * @param {number} healthRemoved - The amount of health to decrease by. 
     * @returns {number} - The new current health.
     */
    public subtractHealth(healthRemoved: number): number {
        if (healthRemoved <= 0) {
            throw new Error('Health removed is less than 0!');
        }

        this._health -= healthRemoved;
        if (this._health < 0) {
            this._health = 0;
        }

        this.update();
        return this._health;
    }

    /**
     * Adds and draws block on the healthbar. 
     * 
     * @param {number} blockGained - The amount of block to increase by.
     * @returns {number} - The new current block.
     */
    public addBlock(blockGained: number): number {
        if (blockGained < 0) {
            throw new Error('Block gained less than 0!');
        }

        this._block += blockGained;

        this.update();
        return this._block;
    }

	/**
	 * Called when the fight is created. Handled all PIXI graphics specifics.
	 */
    private initContainer(): void {
        // Adds text above health bar to display exact current health and max health values
        let healthText: Text = new Text(
            `${this._health} / ${this._maxHealth}`,
            {
                fontSize: 20,
                fill: ["white"],
                strokeThickness: 3,
            }
        );
        healthText.name = 'health_text';
        healthText.anchor.x = 0.5;
        healthText.x = this.width/2;
        healthText.zIndex = 3;
        this.addChild(healthText);

        const barHeight: number = healthText.height;
        const curHealthColor: number = this.block > 0 ? this._blockColor : this._healthColor;

        // Adds rectangle taht represents the max health of the character
        let background: Graphics = this.rectangle(0, barHeight, this.width, this.height, this._cornerRadius, this._backgroundColor);
        background.name = 'background';
        background.zIndex = 1;
        this.addChild(background);

        // Adds rectangle that represents the current health of the character
        let health: Graphics = this.rectangle(0, barHeight, this.getHealthRatio() * this.width, this.height, this._cornerRadius, curHealthColor);
        health.name = 'health';
        health.zIndex = 2;
        this.addChild(health);

        // Adds the block shield 
        let blockShield: Graphics = this.circle(0, barHeight + this.height/2 , this.height, this._blockColor);
        blockShield.name = 'block_shield';
        blockShield.zIndex = 3;
        blockShield.visible = this._block > 0;

        let blockText: Text = new Text(
            `${this._block}`,
            {
                fontSize: 20,
                fill: ["white"],
                strokeThickness: 3,
            }
        );
        blockText.name = 'block_text';
        blockText.anchor.x = 0.5;
        blockText.anchor.y = 0.5;
        blockText.y = barHeight + this.height/2;
        blockText.zIndex = 3;
        blockShield.addChild(blockText);

        this.addChild(blockShield);
    }

    /**
     * Helper function that creates a PIXI rounded rectangle at the specified position, dimensions, and color.
     * 
     * @param {number} x - The x position of the top left corner of the rectangle on the screen in pixels.
     * @param {number} y - The y position of the top left corner of the rectangle on the screen in pixels.
     * @param {number} width - The width of the rectangle in pixels.
     * @param {number} height - The height of the rectangle in pixels.
     * @param {number} radius - The radius of the rounded corners of the rectangle.
     * @param {number} color - The color of the rectangle in hex format e.g. 0xFF0066. 
     * @returns {Graphics} - The PIXI graphics that represent the specified rectangle.
     */
    private rectangle(x: number, y: number, width: number, height: number, radius: number, color: number): Graphics {
        let rect: Graphics = new Graphics();
        rect.beginFill(color);
        rect.lineStyle(0, color);
        rect.drawRoundedRect(x, y, width, height, radius);
        return rect;
    }

    /**
     * Helper function that creates a PIXI circle at the specified position, dimensions, and color.
     * 
     * @param {number} x - The x position of the center of the circle on the screen in pixels.
     * @param {number} y - The y position of the center of the circle on the screen in pixels.
     * @param {number} radius - The radius of the cirlce.
     * @param {number} color - The color of the cirlce.
     * @returns {Graphics} - The PIxi graphics that represents the specified circle.
     */
    private circle(x: number, y: number, radius: number, color: number): Graphics {
        let circle: Graphics = new Graphics();
        circle.beginFill(color);
        circle.lineStyle(0, color);
        circle.drawCircle(x, y, radius);
        return circle;
    }

    /**
     * Helper function that gets the ratio of current health to maximum health.
     * Cannot be less than 0 or greater than 1.
     * 
     * @returns {number} - current health to max health ratio
     */
    private getHealthRatio(): number {
        if (this._health > this._maxHealth) {
            throw new Error('Current health creater than max health!');
        }

        if (this._maxHealth === 0) {
            throw new Error('Max health is zero!');
        }
        
        const healthRatio: number = this._health / this._maxHealth;

        if (healthRatio < 0) {
            throw new Error('Current health or max health less than zero!')
        }

        return healthRatio;
    }
}

export { HealthBar }