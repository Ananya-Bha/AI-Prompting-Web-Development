const words = ['apple', 'beach', 'chair', 'dance', 'eagle', 'flame', 'grape', 'house', 'igloo', 'juice', 'mango'];
let targetWord = '';
let guessCount = 0;
const maxGuesses = 6;

const gameBoard = document.getElementById('game-board');
const guessInput = document.getElementById('guess-input');
const submitGuess = document.getElementById('submit-guess');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-game');

function initializeGame() {
    targetWord = words[Math.floor(Math.random() * words.length)];
    guessCount = 0;
    gameBoard.innerHTML = '';
    message.textContent = '';
    guessInput.value = '';
    guessInput.disabled = false;
    submitGuess.disabled = false;
    restartButton.style.display = 'none';
}

function createRow() {
    const row = document.createElement('div');
    row.style.display = 'contents';
    for (let i = 0; i < 5; i++) {
        const letterBox = document.createElement('div');
        letterBox.classList.add('letter-box');
        row.appendChild(letterBox);
    }
    gameBoard.appendChild(row);
    return row;
}

function checkGuess(guess) {
    const row = createRow();
    const letterBoxes = row.children;
    const targetLetters = targetWord.split('');

    for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        const letterBox = letterBoxes[i];
        letterBox.textContent = letter;

        if (letter === targetLetters[i]) {
            letterBox.classList.add('correct');
            targetLetters[i] = null;
        } else if (targetLetters.includes(letter)) {
            letterBox.classList.add('present');
            targetLetters[targetLetters.indexOf(letter)] = null;
        } else {
            letterBox.classList.add('absent');
        }
    }

    guessCount++;

    if (guess === targetWord) {
        message.textContent = 'Congratulations! You guessed the word!';
        endGame();
    } else if (guessCount === maxGuesses) {
        message.textContent = `Game over! The word was ${targetWord}.`;
        endGame();
    }
}

function endGame() {
    guessInput.disabled = true;
    submitGuess.disabled = true;
    restartButton.style.display = 'inline-block';
}

submitGuess.addEventListener('click', () => {
    const guess = guessInput.value.toLowerCase();
    if (guess.length !== 5) {
        message.textContent = 'Please enter a 5-letter word.';
        return;
    }
    checkGuess(guess);
    guessInput.value = '';
});

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitGuess.click();
    }
});

restartButton.addEventListener('click', initializeGame);

initializeGame();