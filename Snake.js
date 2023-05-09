export class Snake {
    #headX;
    #headY;
    #id;
    #color;
    #bodyPartCount;
    #body;
    #cords;


    constructor(x, y, id, color) {
        if (!x) throw new Error("X cord was not provided");
        if (!y) throw new Error("Y cord was not provided");
        if (!id) throw new Error("An id was not provided");
        if (!color) throw new Error("Color of the snake was not provided");

        if (typeof x !== "number") throw new TypeError("X cords must be a number");
        if (typeof y !== "number") throw new TypeError("Y cords must be a number");
        if (typeof id !== "number") throw new TypeError("ID must be a number");
        if (typeof color !== "string") throw new TypeError("color must be a string");

        this.#headX = x;
        this.#headY = y;
        this.#id = id;
        this.#color = color;
        this.#bodyPartCount = 1;

        this.#body = {};
        this.#cords = {};

        this.#body[this.#bodyPartCount] = { x: x, y: y };
        this.#cords[`${x},${y}`] = { isPartOfSnake: true };
    }

    /**
     * 
     * @returns the id of the snake
     */
    getID() {
        return this.#id;
    }

    /**
     * 
     * @returns the color of the snake
     */
    getColor() {
        return this.#color;
    }

    /**
     * 
     * @returns the x coordinates of the head of the snake
     */
    getHeadXCords() {
        return this.#headX;
    }

    /**
     * 
     * @returns the y coordinates of the head of the snake
     */
    getHeadYCords() {
        return this.#headY;
    }

    /**
     * 
     * @returns returns the hashmap of the snakes body parts
     */
    getBodyParts() {
        return this.#body;
    }

    /**
     * 
     * @returns the current number of body parts of the coordinates
     */
    getBodyPartsCount(){
        return this.#bodyPartCount;
    }

    /**
     * sets the next head x coordinates for the snakes head x position
     * @param {*} newHeadXCords to be set
     */
    setHeadXCords(newHeadXCords) {
        this.#headX = newHeadXCords;
    }

    /**
     * sets the next head y coordinates for the snakes head y position
     * @param {*} newHeadYCords to bet set
     */
    setHeadYCords(newHeadYCords) {
        this.#headY = newHeadYCords;
    }

    /**
     * 
     * @param {*} x the x cords where the snake should be
     * @param {*} y the y cords where the snake should be
     * @returns true should at the given cords exists a body part of the snake, false if not
     */
    isPartOfSnake(x, y) {
        return this.#cords[`${x},${y}`]?.isPartOfSnake || false;
    }

    /**
     * increases the size of the snake body by adding a new entry inside the hashmap with the new tail cords
     * @param {*} newTailXCord the x cord where the new tail should appear
     * @param {*} newTailYCord the y cord where the new tail should appear
     */
    increaseBodySize(newTailXCord, newTailYCord) {
        if (!newTailXCord && newTailXCord < 0) throw new Error("New tail x cords were not provided");
        if (!newTailYCord && newTailYCord < 0) throw new Error("New tail y cords were not provided");

        if (typeof newTailXCord !== "number") throw new TypeError("new tail x cords must be a number");
        if (typeof newTailYCord !== "number") throw new TypeError("new tail y cords must be a number");

        this.#body[++this.#bodyPartCount] = { x: newTailXCord, y: newTailYCord }
        this.#cords[`${newTailXCord},${newTailYCord}`] = { isPartOfSnake: true };
    }

    /**
     * adjust the given body part to the new given x and y coordinates
     * @param {*} bodyPart to be adjusted
     * @param {*} newXCord to be set
     * @param {*} newYCord to be set
     */
    adjustBodyPartCords(bodyPart, newXCord, newYCord) {
        const oldXCord = this.#body[bodyPart].x;
        const oldYCord = this.#body[bodyPart].y;

        const key = `${oldXCord},${oldYCord}`;
        delete this.#cords[key];

        this.#body[bodyPart] = { x: newXCord, y: newYCord };
        this.#cords[`${newXCord},${newYCord}`] = { isPartOfSnake: true };
    }
}