import { Card, CardType, PlayCallback } from "../card";

import { Fight } from '../../fight/fight'
import { EnemySet } from '../../character/enemy/enemy';

/**
 * Defend - An attack card that gives 5 base block to the player.
 */
export default class Defend extends Card {
	
	constructor() {
		let block: number = 5;
		const description: string = `Gain ${block} block`;
		const playCallback: PlayCallback = (fight: Fight, targets: EnemySet) => {
			console.log('Block played');
			fight.player.addBlock(block);
		};

		super('Defend', CardType.SKILL, 1, description, playCallback);
	}
}