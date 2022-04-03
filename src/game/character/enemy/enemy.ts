import { utils } from 'pixi.js';

import {Character } from '../character';
import { Player } from '../player/player';

type EnemySet = {
	[key: string]: Enemy;
}

interface ActionNode {
	action: (player: Player, self: Enemy) => void;
	nextActions: ActionNode[]
}

class Enemy extends Character {

	private _curAction: ActionNode;

	constructor(name: string, maxHealth: number, actionNode: ActionNode) {
		super(name, maxHealth);
		this._curAction = actionNode;
	}

	public nextTurn(): void {
		const possibleNextActions: ActionNode[] = this._curAction.nextActions;
		const nextAction: ActionNode = possibleNextActions[
			Math.floor(Math.random() * possibleNextActions.length)
		]
		this._curAction = nextAction;
	}

	public performCurAction(player: Player): void {
		this._curAction.action(player, this);
	}

	public copy(): Enemy {
		let copy: Enemy = new Enemy(this.name, this.maxHealth, this._curAction);
		return copy;
	}
}

export { Enemy, EnemySet, ActionNode }