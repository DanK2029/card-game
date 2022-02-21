import * as PIXI from 'pixi.js';

import { getEnemy, EnemyTypes } from './game/enemy/enemyService';

let app: PIXI.Application = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x96B9D0
});
document.body.appendChild(app.view);

const slime = getEnemy(EnemyTypes.SLIME);
slime.container.x = 50;

app.stage.addChild(slime.container);

setTimeout(() => {
    slime.gainBlock(1);
}, 1000);

setTimeout(() => {
    slime.resetBlock();
}, 2000);

setTimeout(() => {
    slime.resetBlock();
}, 2000);
