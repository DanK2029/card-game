import { Card, CardType, PlayCallback } from '../card';

import { Fight } from '../../fight/fight'
import { Enemy, EnemySet } from '../../enemy/enemy';

export default class Strike extends Card {
	
	constructor() {
		let damage: number = 6;
		const description: string = `Deal ${damage} damage to a target`;
		const playCallback: PlayCallback = (fight: Fight, targets: EnemySet) => {
			console.log(`Doing ${damage} to target`);
			let target: Enemy = Object.values(targets)[0];
			target.recieveDamage(damage);
		};

		super('Strike', CardType.ATTACK, 1, description, playCallback);
	}
}