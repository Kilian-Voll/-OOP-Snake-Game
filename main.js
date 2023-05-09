import { GameBoardCanvas } from "./GameBoardCanvas.js";

window.addEventListener('load', () => {
    const canvas = document.getElementById("game")
    let gameBoard = new GameBoardCanvas(400, 400, 16, canvas);
    let snake = null;

    const start = document.getElementById("start-Button");
    const reset = document.getElementById("reset-Button");
    const message = document.querySelector('.game-over');

    /**
     * 
     * @param {*} event the key input event 
     */
    function keyInputHandler(event) {
        let name = event.key;
        let headX = snake.getHeadXCords();
        let headY = snake.getHeadYCords();

        if (name === "w" || name === "ArrowUp") {
            if (headX !== -1 && headY !== -1)
                gameBoard.moveSnake(headX, --headY, snake);
        }
        else if (name === "s" || name === "ArrowDown") {
            if (headX !== -1 && headY !== -1)
                gameBoard.moveSnake(headX, ++headY, snake);
        }
        else if (name === "a" || name === "ArrowLeft") {
            if (headX !== -1 && headY !== -1)
                gameBoard.moveSnake(--headX, headY, snake);
        }
        else if (name === "d" || name === "ArrowRight") {
            if (headX !== -1 && headY !== -1)
                gameBoard.moveSnake(++headX, headY, snake);
        } else if (name === 'Escape') {
            gameBoard = new GameBoardCanvas(400, 400, 16, canvas);
            document.removeEventListener("keydown", keyInputHandler);
            message.classList.remove('game-over-visible');
        }
    }

    start.addEventListener("click", () => {
        if (!gameBoard.snakeActive) {
            gameBoard = new GameBoardCanvas(400, 400, 16, canvas);
            gameBoard.snakeActive = true;
            message.classList.remove('game-over-visible');
            snake = gameBoard.addSnake();
            gameBoard.addFruit();

            document.addEventListener("keydown", keyInputHandler, false);
        }
    })

    reset.addEventListener("click", () => {
        gameBoard = new GameBoardCanvas(400, 400, 16, canvas);
        document.removeEventListener("keydown", keyInputHandler);
        message.classList.remove('game-over-visible');
    })

})