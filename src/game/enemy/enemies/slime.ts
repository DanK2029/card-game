import { Enemy } from "../enemy";

export default class Slime extends Enemy {

	constructor() {
		const name: string = 'slime';
		const health: number = 10;
		const maxHealth: number = 10;
		super(name, health, maxHealth);
	}
}