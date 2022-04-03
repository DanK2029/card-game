import { Enemy } from './enemy'

import { Slime } from './enemies/slime'

// EnemyTypes - An enum with all enemy names.
enum EnemyTypes {
	SLIME = 'slime'
}

// EnemyLibrary - A type that can hold enemies indexed by their name.
type EnemyLibrary = {
	[name: string]: Enemy;
}

// Holds all enemies enemies in the game with their name as their key.
const enemyLibrary: EnemyLibrary = {
	'slime': new Slime(),
}

/**
 * Returns a copy of the specified enemy in the enemy library.
 * 
 * @param {string} enemyName - The name of the requested enemy.
 * @returns {Enemy} - The requested enemy.
 */
function getEnemy(enemyName: EnemyTypes) {
	if (enemyLibrary[enemyName]) {
		return enemyLibrary[enemyName].copy();
	} else {
		console.error(`No enemy with name ${enemyName} defined in enemy library!`);
	}
}

export { getEnemy, EnemyTypes }