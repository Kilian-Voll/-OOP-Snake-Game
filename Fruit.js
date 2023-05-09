export class Fruit {
    #color;

    constructor() {
        this.#color;

    }

    /**
     * 
     * @returns a String containing the color name of the fruit
     */
    getColor() {
        return this.#color;
    }

    /**
     * 
     * @returns a random color name between red, blue and yellow
     */
    generateRandomFruit() {
        const colors = ['red', 'blue', 'yellow'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        this.#color = colors[randomIndex];
        return this.#color;

    }

}