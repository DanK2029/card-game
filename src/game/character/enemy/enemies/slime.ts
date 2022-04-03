import { Enemy, ActionNode } from "../enemy";
import { Player } from '../../player/player'

class Slime extends Enemy {

	constructor() {
		const name: string = 'slime';
		const maxHealth: number = 10;

		const smallAttack: ActionNode = {
			action: (player: Player, self: Enemy) => {
				const attackDamage: number = 5;
				player.receiveDamage(attackDamage);
			},
			nextActions: []
		}

		const largeAttack: ActionNode = {
			action: (player: Player, self: Enemy) => {
				const attackDamage: number = 10;
				player.receiveDamage(attackDamage);
			},
			nextActions: []
		}

		smallAttack.nextActions = [largeAttack];
		largeAttack.nextActions = [smallAttack];

		super(name, maxHealth, smallAttack);
	}
}

export { Slime }