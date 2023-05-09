import { Fruit } from "./Fruit.js";
import { Snake } from "./Snake.js";

export class GameBoardCanvas {
    #boardWidth;
    #boardHeight;
    #canvas;
    #ctx;
    #fieldSize;
    #squareSize;
    #gameField;
    #idCounter;
    #score;

    constructor(boardWidth, boardHeight, fieldSize, canvas) {
        if (!boardWidth) throw new Error("Board width was not provided");
        if (!fieldSize) throw new Error("Field size was not provided");
        if (!boardHeight) throw new Error("Board height was not provided");
        if (!canvas) throw new Error("canvas was not provided");

        if (typeof boardHeight !== 'number') throw new TypeError('boardHeight must be a number');
        if (typeof boardWidth !== 'number') throw new TypeError('boardWidth must be a number');
        if (typeof fieldSize !== 'number') throw new TypeError('fieldSize must be a number');

        this.#boardWidth = boardWidth;
        this.#boardHeight = boardHeight;
        this.#canvas = canvas;
        this.#ctx = this.#canvas.getContext("2d");

        this.#fieldSize = fieldSize
        this.#squareSize = boardWidth / fieldSize;
        this.snakeActive = false;
        this.#score = 0;


        this.#gameField = [];
        this.#idCounter = 0;

        this.createGameField();
        this.resetScore()
    }

    resetScore(){
        const score = document.querySelector('.points');
        score.innerHTML = 0;
    }

    /**
     * Inits the game field and draws it on the canvas
     */
    createGameField() {

        /**
         * initialize the game field with the given field size
         */
        const initGameField = () => {
            let snake = null;
            let fruit = null;
            for (let i = 0; i < this.#fieldSize; ++i) {
                const row = [];
                for (let j = 0; j < this.#fieldSize; ++j) {
                    const x = i * this.#squareSize;
                    const y = j * this.#squareSize;
                    row.push({ x, y, snake, fruit })
                }
                this.#gameField.push(row);
            }
        }

        /**
         * sets the width and height of the canvas and draws the game field on it
         */
        const drawGameField = () => {
            this.#canvas.width = this.#boardWidth;
            this.#canvas.height = this.#boardHeight;
            for (let i = 0; i < this.#fieldSize; ++i) {
                for (let j = 0; j < this.#fieldSize; ++j) {
                    const square = this.#gameField[i][j];
                    this.#ctx.moveTo(square.x, square.y);
                    this.#ctx.lineTo(square.x + this.#squareSize, square.y);
                    this.#ctx.lineTo(square.x + this.#squareSize, square.y + this.#squareSize);
                    this.#ctx.lineTo(square.x, square.y + this.#squareSize);
                    this.#ctx.stroke();
                }
            }
        }

        initGameField();
        drawGameField();
    }

    /**
     * moves the snake to the given place on the canvas and checks the movement according to the game rules
     * @param {*} x the horizontal coordinates the snake should be placed at
     * @param {*} y the vertical coordinates the snake should be placed at
     * @param {*} snake the snake that should be moved
     */
    moveSnake(x, y, snake) {
        if (!x && x < 0) throw new Error("X cord was not provided");
        if (!y && y < 0) throw new Error("Y cord was not provided");

        if (typeof x !== "number") throw new TypeError("X cords must be a number");
        if (typeof y !== "number") throw new TypeError("Y cords must be a number");

        const snakeParts = snake.getBodyParts();
        const currentHeadXCords = snake.getHeadXCords();
        const currentHeadYCords = snake.getHeadYCords();
        const lastBodyPartCords = snakeParts[snake.getBodyPartsCount()].x;
        const lastBodyPartYCords = snakeParts[snake.getBodyPartsCount()].y;

        /**
         * sets the color on the given position on the canvas to the snakes color
         * @param {*} x cord on the game field
         * @param {*} y cord on the game field
         */
        const placeSnakeBodyPart = (x, y) => {
            const square = this.#gameField[x][y];
            this.#ctx.fillStyle = snake.getColor();
            this.#ctx.fillRect(square.x + 3, square.y + 3, this.#squareSize - 6, this.#squareSize - 6);
        }

        /**
         * sets the color on the given position on the canvas to white
         * @param {*} x cord on the game field
         * @param {*} y cord on the game field
         */
        const clearField = (x, y) => {
            const square = this.#gameField[x][y];
            this.#ctx.fillStyle = "white";
            this.#ctx.fillRect(square.x + 3, square.y + 3, this.#squareSize - 6, this.#squareSize - 6);
        }


        /**
        * 
        * @param {*} x cord on the game field
        * @param {*} y cord on the game field
        * @returns true should the coordinates be inside the game field, false otherwise
        */
        const checkBoundaries = (x, y) => {
            if (x < this.#fieldSize && y < this.#fieldSize && x > -1 && y > -1) return true;
            return false
        }

        /**
         * updates the snakes entire body position on the field and draws it on the field
         * @param {*} x the new head's x position
         * @param {*} y the new head's y position
         */
        const updateSnakePosition = (x, y) => {
            snake.setHeadXCords(x);
            snake.setHeadYCords(y);
            let adjustX = x;
            let adjustY = y;

            for (let snakePart in snakeParts) {
                const current = snakeParts[snakePart];
                this.#gameField[x][y].snake = snake;
                placeSnakeBodyPart(adjustX, adjustY);
                snake.adjustBodyPartCords(snakePart, adjustX, adjustY);
                adjustX = current.x;
                adjustY = current.y;
            }
            clearField(lastBodyPartCords, lastBodyPartYCords);
            this.#gameField[lastBodyPartCords][lastBodyPartYCords].snake = null;
        }

        const increaseScore = (fruitColor) => {
            /* if (fruitColor === 'red') this.#score += 100;
            else if (fruitColor === 'yellow') this.#score += 50;
            else if (fruitColor === 'blue') this.#score += 10; */
            this.#score += 100;
            const scoreBoard = document.querySelector('.points');
            scoreBoard.innerHTML = this.#score;
        }

        /**
         * increases the size of the snakes body and updates it
         */
        const eatFruitAndGrow = () => {
            snake.increaseBodySize(currentHeadXCords, currentHeadYCords);
            snake.setHeadXCords(x);
            snake.setHeadYCords(y);
            updateSnakePosition(x, y);
            clearField(lastBodyPartCords, lastBodyPartYCords);
            increaseScore(this.#gameField[x][y].fruit.getColor());
            this.#gameField[x][y].fruit = null;
        }

        /**
         * changes the color of the snakes body in an short interval 
         */
        const explodeSnake = () => {
            const colors = ["yellow", "orange", "red", "black"];
            let size = this.#squareSize - 6;

            /**
             * colors the given body part of the snake into the given color
             * @param {*} bodyPart to be colored
             * @param {*} color the index number of the color inside the colors array
             */
            const drawExplosion = (bodyPart, color) => {
                const square = this.#gameField[snakeParts[bodyPart].x][snakeParts[bodyPart].y];
                this.#ctx.fillStyle = colors[color];
                this.#ctx.fillRect(square.x + 3, square.y + 3, size, size);
            }

            /**
             * calls the drawExplosion method in an interval for the entire snake body parts
             * @param {*} i the index number of the color inside the colors array
             */
            const transition = (i) => {
                for (let bodyPart in snakeParts) {
                    setTimeout(() => drawExplosion(bodyPart, i), 100 * bodyPart);
                }
            }

            for (let color = 0; color < colors.length; color++) {
                setTimeout(() => transition(color), 200 * color);
            }

        }


        const gameOver = () => {
            const message = document.querySelector('.game-over');
            message.classList.add('game-over-visible')
        }

        // check if the snake is not going out of bounds
        if (checkBoundaries(x, y)) {

            // check if the field the snake is moving to is empty
            if (this.squareFieldPropertiesEmpty(x, y)) {
                updateSnakePosition(x, y)

                // check if there is a fruit
            } else if (this.#gameField[x][y].fruit !== null) {
                if (snake.getBodyPartsCount() === (this.#fieldSize * this.#fieldSize)) {
                    const message = document.querySelector('.game-over');
                    message.innerHTML = "You Won!";
                    message.style.color = "yellow";
                }
                eatFruitAndGrow();
                this.addFruit();

                // check if there is a snake
            } else if (this.#gameField[x][y].snake !== null) {
                snake.setHeadXCords(-1);
                snake.setHeadYCords(-1);
                explodeSnake();
                gameOver();
                this.snakeActive = false
            }
        } else {
            snake.setHeadXCords(-1);
            snake.setHeadYCords(-1);
            explodeSnake();
            gameOver();
            this.snakeActive = false;
        }

    }

    /**
     * Adds a Snake on the canvas on random cords
     * @returns the snake that was created
     */
    addSnake() {
        const randomX = Math.floor(Math.random() * this.#fieldSize);
        const randomY = Math.floor(Math.random() * this.#fieldSize);
        const snake = new Snake(randomX, randomY, ++this.#idCounter, "green");
        /**
         * places the created snake at the determined position on the canvas
         */
        const placeSnakeOnCanvas = () => {
            const square = this.#gameField[randomX][randomY];
            this.#ctx.fillStyle = snake.getColor();
            this.#ctx.fillRect(square.x + 3, square.y + 3, this.#squareSize - 6, this.#squareSize - 6);
        }

        if (this.squareFieldPropertiesEmpty(randomX, randomY)) {
            const square = this.#gameField[randomX][randomY];
            square.snake = snake.getColor();
            placeSnakeOnCanvas();
        } else {
            this.addSnake();
        }


        return snake;
    }

    /**
     * Adds a Fruit with a random color and cords on the canvas 
     */
    addFruit() {
        const randomX = Math.floor(Math.random() * this.#fieldSize);
        const randomY = Math.floor(Math.random() * this.#fieldSize);
        const fruit = new Fruit();

        /**
         * draws the fruit on the canvas on the before determined position
         */
        const placeFruitOnCanvas = () => {
            const square = this.#gameField[randomX][randomY];
            const centerX = square.x + this.#squareSize / 2;
            const centerY = square.y + this.#squareSize / 2;
            const radius = this.#squareSize / 3;
            this.#ctx.beginPath();
            this.#ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            this.#ctx.fillStyle = fruit.generateRandomFruit();
            this.#ctx.fill();
        }

        if (this.squareFieldPropertiesEmpty(randomX, randomY)) {
            const square = this.#gameField[randomX][randomY];
            square.fruit = fruit;
            placeFruitOnCanvas();
        } else {
            this.addFruit();
        }
    }

    /**
     * 
     * @param {*} x the x cord to be checked 
     * @param {*} y the y cord to be checked
     * @returns true should the square field be empty, false if not
     */
    squareFieldPropertiesEmpty(x, y) {
        const square = this.#gameField[x][y];
        if (square.fruit === null && square.snake === null) return true;
        return false;
    }

}
