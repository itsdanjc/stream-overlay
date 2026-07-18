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
 * Utility function to calculate the total transition
 * duration of an element and its descendants.
 * @param {Element} element Element to calculate styles.
 * @returns {number} Duration in milliseconds.
 */
function getAnimationDuration(element) {
    var duration = 0;

    function parseTimes(str) {
        return str.split(",").map(s => {
            s = s.trim();

            if(s.endsWith("ms")) return parseFloat(s);
            return parseFloat(s) * 1000 // Return in milliseconds.
        })
    }

    for(var child of element.querySelectorAll("*")) {
        const styles = getComputedStyle(child);

        const transDurations = parseTimes(styles.transitionDuration);
        const transDelays = parseTimes(styles.transitionDelay);

        const totals = transDurations.map(
            (d, i) => d + (transDelays[i] || 0)
        )

        duration = Math.max(duration, ...totals);
    }

    return duration;
}

/**
 * Represents a card component.
 */
export class Card {
    container;
    animationDuration;

    constructor(selector){
        this.container = document.querySelector(selector);
        this.animationDuration = getAnimationDuration(this.container);
        console.log(this.animationDuration)
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
        return sleep(this.animationDuration)
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
        return sleep(this.animationDuration);
    }
    
    /**
     * aa
     * @param {{line_1: string, line_2: string, line_3: string}} content
     *  aaa
     */
    async update(content){
        await this.hide();
        const card = this.container;

        card.querySelector(".row-1").innerHTML = content.line_1;
        card.querySelector(".row-2").innerHTML = content.line_2;
        card.querySelector(".row-3").innerHTML = content.line_3;

        await this.show();
    }

}