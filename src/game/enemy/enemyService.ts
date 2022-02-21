import { Enemy } from './enemy'

import Slime from './enemies/slime'

enum EnemyTypes {
	SLIME = 'slime'
}

type EnemyLibrary = {
	[name: string]: Enemy;
}

const enemyLibrary: EnemyLibrary = {
	'slime': new Slime(),
}

function getEnemy(enemyName: EnemyTypes) {
	if (enemyLibrary[enemyName]) {
		return enemyLibrary[enemyName].copy();
	} else {
		console.error(`No enemy with name ${enemyName} defined in enemy library!`);
	}
}

export { getEnemy, EnemyTypes }