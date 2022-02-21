import { Card } from './card';

import Strike from './cards/strike';
import Defend from './cards/defend';

type CardLibrary = {
	[name: string]: Card;
}

const cardLibrary: CardLibrary = {
	'Strike': new Strike(),
	'Defend': new Defend(),
}

function getCard(cardName: string) {
	if (cardLibrary[cardName]) {
		return cardLibrary[cardName];
	} else {
		console.error(`No card with name ${cardName} defined in card library!`);
	}
}

export { getCard }