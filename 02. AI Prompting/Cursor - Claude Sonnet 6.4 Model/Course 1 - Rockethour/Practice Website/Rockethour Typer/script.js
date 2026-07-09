const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const wordCount = document.getElementById('count');

const goatSentences = [
    "Mountain goats are expert climbers.",
    "Goats have rectangular pupils for wide-angle vision.",
    "A baby goat is called a kid.",
    "Goats were one of the first animals to be domesticated.",
    "Some goats can climb trees.",
    "Goats are very social animals.",
    "A group of goats is called a trip or a tribe.",
    "Goats can be taught their name and to come when called."
];

let currentSentence = '';
let totalWordsTyped = 0;
let sentenceElement = null;
let animationId = null;

function getRandomSentence() {
    return goatSentences[Math.floor(Math.random() * goatSentences.length)];
}

function createMovingText() {
    if (!currentSentence) {
        currentSentence = getRandomSentence();
    }
    sentenceElement = document.createElement('div');
    sentenceElement.textContent = currentSentence;
    sentenceElement.style.position = 'absolute';
    sentenceElement.style.top = '-50px';
    sentenceElement.style.width = '100%';
    sentenceElement.style.textAlign = 'center';
    textDisplay.innerHTML = ''; // Clear previous sentence
    textDisplay.appendChild(sentenceElement);

    let position = -50;
    const moveText = () => {
        position += 0.2; // Reduced speed
        sentenceElement.style.top = `${position}px`;
        if (position < textDisplay.offsetHeight - sentenceElement.offsetHeight) {
            animationId = requestAnimationFrame(moveText);
        } else {
            endGame(); // End the game when sentence touches the bottom
        }
    };
    animationId = requestAnimationFrame(moveText);
}

function updateDisplay() {
    const inputText = textInput.value;
    const chars = inputText.split('');
    sentenceElement.innerHTML = currentSentence.split('').map((char, index) => {
        if (index < chars.length) {
            if (char.toLowerCase() === chars[index].toLowerCase()) {
                return `<span class="correct">${char}</span>`;
            }
        }
        return char;
    }).join('');

    // Check if the entire sentence is correctly typed
    if (inputText.toLowerCase() === currentSentence.toLowerCase()) {
        totalWordsTyped += currentSentence.split(/\s+/).length; // Add words from completed sentence
        wordCount.textContent = totalWordsTyped; // Update total words typed
        currentSentence = ''; // Reset current sentence
        textInput.value = ''; // Clear the input
        cancelAnimationFrame(animationId); // Cancel current animation
        setTimeout(createMovingText, 1000); // Create new sentence after a short delay
    }
}

function endGame() {
    cancelAnimationFrame(animationId);
    alert(`Game Over! You typed ${totalWordsTyped} words correctly.`);
    resetGame();
}

function resetGame() {
    totalWordsTyped = 0;
    wordCount.textContent = totalWordsTyped;
    currentSentence = '';
    textInput.value = '';
    createMovingText();
}

textInput.addEventListener('input', updateDisplay);

createMovingText();