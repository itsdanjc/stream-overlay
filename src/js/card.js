/*
    Components used for overlay.

    Copyright (c) 2026 itsdanjc.
    Licensed under MIT.
*/

const HIDDEN_CLASSNAME = "hidden";
const NO_URL_DEFAULT = "about:blank"

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

// Types
/**
 * @typedef {Object} CardChildren
 * @property {HTMLImageElement} thumbnail
 * @property {HTMLDivElement} row_1
 * @property {HTMLDivElement} row_2
 * @property {HTMLDivElement} row_3
 */

/**
 * @typedef {Object} CardBody
 * @property {URL | string} thumbnail
 * @property {string} line_1
 * @property {string} line_2
 * @property {string} line_3
 */


/**
 * Represents a card component.
 */
export class Card {
    /** @type {Element} */
    container;

    /** @type {CardChildren} */
    children;

    /** @type {number} */
    animationDuration;

    constructor(selector){
        this.container = document.querySelector(selector);
        this.animationDuration = getAnimationDuration(this.container);
        this.children = {
            thumbnail: this.container.querySelector(".thumbnail-image"),
            row_1: this.container.querySelector(".row-1"),
            row_2: this.container.querySelector(".row-2"),
            row_3: this.container.querySelector(".row-3"),
        };
    }

    /**
     * Checks whether the card is hidden.
     * @returns {boolean} True if card is hidden, false otherwise.
     */
    isHidden(){
        return this.container.classList.contains(HIDDEN_CLASSNAME);
    }

    /**
     * Compare this card's body with an given element.
     * @param {CardBody} body Object to compare against.
     * @returns {boolean} True if match, false otherwise.
     */
    isEqual(body){
        if (body.thumbnail instanceof URL)
            body.thumbnail = body.thumbnail.toJSON();

        return (
            body.line_1 == this.children.row_1.innerHTML &&
            body.line_2 == this.children.row_2.innerHTML &&
            body.line_3 == this.children.row_3.innerHTML &&
            body.thumbnail == this.children.thumbnail.src
        );
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
     * Updates the card content with new content.
     * @param {CardBody} content
     * @returns {Promise<null>}
     */
    update(content){
        // Create image object to preload source.
        const imgPreload = new Image(120, 120);
        imgPreload.classList = this.children.thumbnail.classList;
        imgPreload.src = content.thumbnail ?? NO_URL_DEFAULT;

        const onEvent = async (event) => {
            await this.hide();

            if(event.type == "load"){
                this.container.classList.remove("accent-line");
            } else {
                this.container.classList.add("accent-line");
            }
            
            this.children.thumbnail.replaceWith(imgPreload);
            this.children.thumbnail = imgPreload;
            this.children.row_1.innerHTML = content.line_1;
            this.children.row_2.innerHTML = content.line_2;
            this.children.row_3.innerHTML = content.line_3;
            
            await this.show();
        }

        return new Promise((resolve, reject) => {
            imgPreload.onload = event  => resolve( onEvent(event) );
            imgPreload.onerror = event => resolve( onEvent(event) );
        });
    }

}