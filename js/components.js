/*
    Components used for overlay.

    Copyright (c) 2026 itsdanjc.
    Licensed under MIT.
*/

const HIDDEN_CLASSNAME = "hidden";

/**
 * Utility function that, when awaited, pauses execution
 * for the duration specified.
 * @param {number} duration Time to wait in milliseconds.
 * @returns {Promise<null>}
 */
async function sleep(duration) {
    return new Promise(_ => setTimeout(_, duration))
}

/**
 * Represents a card component.
 */
export class Card {
    container;

    constructor(selector){
        this.container = document.querySelector(selector);
    }

    /**
     * Checks whether the card is hidden.
     * @returns {boolean} True if card is hidden, false otherwise.
     */
    isHidden(){
        return this.container.classList.contains(HIDDEN_CLASSNAME);
    }

    /**
     * Hide the card, does nothing if card already hidden.
     * @returns An awaitable promise, that pauses execution, 
     * until all animation has ended.
     */
    async hide(){
        if (this.isHidden())
            return sleep(0);
        
        this.container.classList.add(HIDDEN_CLASSNAME);
        return sleep(0)
    }

    /**
     * Show the card, does nothing if card already shown.
     * @returns An awaitable promise, that pauses execution, 
     * until all animation has ended.
     */
    async show(){
        if (!this.isHidden())
            return sleep(0);

        this.container.classList.remove(HIDDEN_CLASSNAME);
        return sleep(0);
    }
}