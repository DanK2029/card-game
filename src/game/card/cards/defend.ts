import { Card, CardType, PlayCallback } from "../card";

import { Fight } from '../../fight/fight'
import { Enemy, EnemySet } from '../../enemy/enemy';

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