import { Card } from './card';

import Strike from './cards/strike';
import Defend from './cards/defend';

// CardLibrary - A type that can hold cards indexed by their name.
type CardLibrary = {
	[name: string]: Card;
}

// All card names as string.
enum CardNames {
	STRIKE = 'Strike',
	DEFEND = 'Defend'
}

// Holds all cards in the game in an object with their name as the key.
const cardLibrary: CardLibrary = {
	[CardNames.STRIKE]: new Strike(),
	[CardNames.DEFEND]: new Defend(),
}

/**
 * Returns a copy of the specified card in the card library
 * 
 * @param {string} cardName - The name of the requested card. 
 * @returns {Card} - The requested card.
 */
function getCard(cardName: string) {
	if (cardLibrary[cardName]) {
		return cardLibrary[cardName].copy();
	} else {
		console.error(`No card with name ${cardName} defined in card library!`);
	}
}

export { getCard, CardNames }