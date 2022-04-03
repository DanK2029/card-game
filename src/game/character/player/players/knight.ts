import { getCard, CardNames } from "../../../card/cardService";
import { Player } from "../player";

/**
 * Knight - A playable character.
 */
class Knight extends Player {

    constructor() {
        const name: string = 'knight';
        const maxHealth: number = 100;
        super(name, maxHealth);
        this.constructInitialDeck()
    }


    /**
     * Adds the necessary cards to knights starter deck.
     */
    private constructInitialDeck(): void {

        this.addCard(getCard(CardNames.STRIKE));
        this.addCard(getCard(CardNames.STRIKE));
        this.addCard(getCard(CardNames.STRIKE));
        this.addCard(getCard(CardNames.STRIKE));
        this.addCard(getCard(CardNames.STRIKE));
        
        this.addCard(getCard(CardNames.DEFEND));
        this.addCard(getCard(CardNames.DEFEND));
        this.addCard(getCard(CardNames.DEFEND));
        this.addCard(getCard(CardNames.DEFEND));
    }
}

export { Knight }