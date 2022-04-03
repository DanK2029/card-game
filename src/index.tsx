import * as PIXI from 'pixi.js';

import { EnemySet } from './game/character/enemy/enemy';

import { Knight } from './game/character/player/players/knight';
import { Slime } from './game/character/enemy/enemies/slime';

import { Fight } from './game/fight/fight'

let app: PIXI.Application = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x96B9D0,
    antialias: true,
});
app.renderer.plugins.interaction.moveWhenInside = true;
document.body.appendChild(app.view);

let knight: Knight = new Knight();
knight.receiveDamage(30);
let slime: Slime = new Slime();

let enemySet: EnemySet = {
    'slime': slime
}

let fight: Fight = new Fight(knight, enemySet);
fight.x = 20;
app.stage.addChild(fight);
