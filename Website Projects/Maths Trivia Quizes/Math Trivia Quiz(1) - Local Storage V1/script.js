// Game State
let gameState = {
    currentTopic: null,
    difficulty: 1,
    timeRemaining: 60,
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    isPlaying: false,
    timerInterval: null,
    currentQuestion: null,
    currentCorrectAnswer: null
};

// DOM Elements
const elements = {
    highScore: document.getElementById('highScore'),
    currentTopicName: document.getElementById('currentTopicName'),
    chooseTopicBtn: document.getElementById('chooseTopicBtn'),
    topicModal: document.getElementById('topicModal'),
    topicOptions: document.querySelectorAll('.topic-option'),
    difficultyLevel: document.getElementById('difficultyLevel'),
    timerValue: document.getElementById('timerValue'),
    timerDisplay: document.getElementById('timerDisplay'),
    questionText: document.getElementById('questionText'),
    answersGrid: document.getElementById('answersGrid'),
    answerBtns: document.querySelectorAll('.answer-btn'),
    totalQuestions: document.getElementById('totalQuestions'),
    correctAnswers: document.getElementById('correctAnswers'),
    tryAgainBtn: document.getElementById('tryAgainBtn'),
    resultsModal: document.getElementById('resultsModal'),
    resultTotal: document.getElementById('resultTotal'),
    resultCorrect: document.getElementById('resultCorrect'),
    resultIncorrect: document.getElementById('resultIncorrect'),
    resultScore: document.getElementById('resultScore'),
    closeModalBtn: document.getElementById('closeModalBtn')
};

// Question Generators for Different Topics
const questionGenerators = {
    addition: (difficulty) => {
        const max = 10 * difficulty;
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        return {
            question: `${a} + ${b} = ?`,
            answer: a + b
        };
    },
    subtraction: (difficulty) => {
        const max = 10 * difficulty;
        const a = Math.floor(Math.random() * max) + 10;
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        return {
            question: `${a} - ${b} = ?`,
            answer: a - b
        };
    },
    multiplication: (difficulty) => {
        const max = 5 + difficulty * 2;
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        return {
            question: `${a} × ${b} = ?`,
            answer: a * b
        };
    },
    division: (difficulty) => {
        const max = 5 + difficulty * 2;
        const b = Math.floor(Math.random() * max) + 1;
        const answer = Math.floor(Math.random() * max) + 1;
        const a = b * answer;
        return {
            question: `${a} ÷ ${b} = ?`,
            answer: answer
        };
    },
    mixed: (difficulty) => {
        const operations = ['addition', 'subtraction', 'multiplication', 'division'];
        const randomOp = operations[Math.floor(Math.random() * operations.length)];
        return questionGenerators[randomOp](difficulty);
    },
    fractions: (difficulty) => {
        const denominator = Math.floor(Math.random() * (5 + difficulty)) + 2;
        const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
        const whole = Math.floor(Math.random() * (3 + difficulty)) + 1;
        const answer = Math.round((numerator / denominator) * whole * 100) / 100;
        return {
            question: `${numerator}/${denominator} of ${whole} = ?`,
            answer: answer
        };
    }
};

// Initialize
function init() {
    loadHighScore();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    elements.chooseTopicBtn.addEventListener('click', openTopicModal);
    elements.topicOptions.forEach(btn => {
        btn.addEventListener('click', (e) => selectTopic(e.target.dataset.topic));
    });
    elements.answerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => checkAnswer(parseInt(e.target.dataset.answer)));
    });
    elements.tryAgainBtn.addEventListener('click', resetGame);
    elements.closeModalBtn.addEventListener('click', closeResultsModal);
}

// Load High Score from Local Storage
function loadHighScore() {
    const scores = JSON.parse(localStorage.getItem('mathQuizScores')) || [];
    const highScore = scores.length > 0 ? Math.max(...scores) : 0;
    elements.highScore.textContent = highScore;
}

// Save Score to Local Storage
function saveScore(score) {
    const scores = JSON.parse(localStorage.getItem('mathQuizScores')) || [];
    scores.push(score);
    localStorage.setItem('mathQuizScores', JSON.stringify(scores));
    loadHighScore();
}

// Open Topic Modal
function openTopicModal() {
    elements.topicModal.classList.add('active');
}

// Select Topic
function selectTopic(topic) {
    gameState.currentTopic = topic;
    elements.currentTopicName.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
    elements.topicModal.classList.remove('active');
    startGame();
}

// Start Game
function startGame() {
    gameState.isPlaying = true;
    gameState.difficulty = 1;
    gameState.timeRemaining = 60;
    gameState.totalQuestions = 0;
    gameState.correctAnswers = 0;
    gameState.incorrectAnswers = 0;
    
    updateUI();
    generateQuestion();
    startTimer();
}

// Start Timer
function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        elements.timerValue.textContent = gameState.timeRemaining;
        
        if (gameState.timeRemaining <= 10) {
            elements.timerDisplay.classList.add('warning');
        }
        
        if (gameState.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

// Generate Question
function generateQuestion() {
    if (!gameState.currentTopic || !gameState.isPlaying) return;
    
    const questionData = questionGenerators[gameState.currentTopic](gameState.difficulty);
    gameState.currentQuestion = questionData.question;
    gameState.currentCorrectAnswer = questionData.answer;
    
    elements.questionText.textContent = questionData.question;
    
    // Generate wrong answers
    const answers = [questionData.answer];
    while (answers.length < 4) {
        let wrongAnswer;
        if (gameState.currentTopic === 'fractions') {
            wrongAnswer = Math.round((questionData.answer + (Math.random() * 4 - 2)) * 100) / 100;
        } else {
            wrongAnswer = questionData.answer + Math.floor(Math.random() * 20 - 10);
        }
        
        if (wrongAnswer > 0 && !answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }
    
    // Shuffle answers
    answers.sort(() => Math.random() - 0.5);
    
    // Update answer buttons
    elements.answerBtns.forEach((btn, index) => {
        btn.textContent = answers[index];
        btn.disabled = false;
        btn.classList.remove('correct', 'incorrect');
        btn.dataset.value = answers[index];
    });
}

// Check Answer
function checkAnswer(buttonIndex) {
    if (!gameState.isPlaying) return;
    
    const selectedBtn = elements.answerBtns[buttonIndex];
    const selectedAnswer = parseFloat(selectedBtn.dataset.value);
    const isCorrect = selectedAnswer === gameState.currentCorrectAnswer;
    
    gameState.totalQuestions++;
    
    // Disable all buttons
    elements.answerBtns.forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        gameState.correctAnswers++;
        gameState.difficulty++;
        selectedBtn.classList.add('correct');
    } else {
        gameState.incorrectAnswers++;
        selectedBtn.classList.add('incorrect');
        
        // Show correct answer
        elements.answerBtns.forEach(btn => {
            if (parseFloat(btn.dataset.value) === gameState.currentCorrectAnswer) {
                btn.classList.add('correct');
            }
        });
    }
    
    updateUI();
    
    // Generate next question after delay
    setTimeout(() => {
        if (gameState.isPlaying) {
            generateQuestion();
        }
    }, 1500);
}

// Update UI
function updateUI() {
    elements.totalQuestions.textContent = gameState.totalQuestions;
    elements.correctAnswers.textContent = gameState.correctAnswers;
    elements.timerValue.textContent = gameState.timeRemaining;
    
    // Update difficulty display
    let difficultyText = 'Easy';
    if (gameState.difficulty > 7) {
        difficultyText = 'Expert';
    } else if (gameState.difficulty > 5) {
        difficultyText = 'Hard';
    } else if (gameState.difficulty > 3) {
        difficultyText = 'Medium';
    }
    elements.difficultyLevel.textContent = difficultyText;
}

// End Game
function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    elements.timerDisplay.classList.remove('warning');
    
    // Calculate score
    const score = gameState.correctAnswers;
    
    // Save score
    saveScore(score);
    
    // Show results modal
    showResultsModal();
}

// Show Results Modal
function showResultsModal() {
    elements.resultTotal.textContent = gameState.totalQuestions;
    elements.resultCorrect.textContent = gameState.correctAnswers;
    elements.resultIncorrect.textContent = gameState.incorrectAnswers;
    elements.resultScore.textContent = gameState.correctAnswers;
    
    // Draw chart
    drawResultsChart();
    
    elements.resultsModal.classList.add('active');
}

// Draw Results Chart
function drawResultsChart() {
    const canvas = document.getElementById('resultsChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;
    
    const correct = gameState.correctAnswers;
    const incorrect = gameState.incorrectAnswers;
    const total = correct + incorrect;
    
    if (total === 0) {
        ctx.font = '20px Segoe UI';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No questions answered', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Draw bar chart
    const barWidth = 80;
    const spacing = 100;
    const maxHeight = 180;
    const baseY = 200;
    
    // Correct answers bar
    const correctHeight = (correct / total) * maxHeight;
    ctx.fillStyle = '#43e97b';
    ctx.fillRect(spacing, baseY - correctHeight, barWidth, correctHeight);
    
    // Incorrect answers bar
    const incorrectHeight = (incorrect / total) * maxHeight;
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(spacing + barWidth + 60, baseY - incorrectHeight, barWidth, incorrectHeight);
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Segoe UI';
    ctx.textAlign = 'center';
    
    // Correct label
    ctx.fillText(`Correct: ${correct}`, spacing + barWidth / 2, baseY + 25);
    
    // Incorrect label
    ctx.fillText(`Incorrect: ${incorrect}`, spacing + barWidth + 60 + barWidth / 2, baseY + 25);
    
    // Percentage labels on bars
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Segoe UI';
    if (correctHeight > 30) {
        ctx.fillText(`${Math.round((correct / total) * 100)}%`, spacing + barWidth / 2, baseY - correctHeight / 2);
    }
    if (incorrectHeight > 30) {
        ctx.fillText(`${Math.round((incorrect / total) * 100)}%`, spacing + barWidth + 60 + barWidth / 2, baseY - incorrectHeight / 2);
    }
}

// Close Results Modal
function closeResultsModal() {
    elements.resultsModal.classList.remove('active');
}

// Reset Game
function resetGame() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.isPlaying = false;
    gameState.currentTopic = null;
    gameState.difficulty = 1;
    gameState.timeRemaining = 60;
    gameState.totalQuestions = 0;
    gameState.correctAnswers = 0;
    gameState.incorrectAnswers = 0;
    
    elements.currentTopicName.textContent = 'Select a Topic';
    elements.questionText.textContent = 'Select a topic to begin!';
    elements.timerDisplay.classList.remove('warning');
    
    elements.answerBtns.forEach(btn => {
        btn.textContent = 'A';
        btn.disabled = false;
        btn.classList.remove('correct', 'incorrect');
    });
    
    updateUI();
    elements.resultsModal.classList.remove('active');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
