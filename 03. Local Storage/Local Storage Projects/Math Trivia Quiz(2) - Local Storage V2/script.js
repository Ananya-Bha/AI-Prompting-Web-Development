// ==================== GAME STATE ====================
let gameState = {
    currentTopic: null,
    difficulty: 'Easy',
    difficultyLevel: 1,
    consecutiveCorrect: 0,
    timeRemaining: 60,
    questionsDone: 0,
    questionsCorrect: 0,
    isPlaying: false,
    timerInterval: null,
    currentQuestion: null,
    currentChoices: [],
    correctAnswer: null,
    questionsHistory: [] // Store all questions with answers
};

// ==================== TOPIC CONFIGURATIONS ====================
const topicNames = {
    addition: '➕ Addition & Subtraction',
    multiplication: '✖️ Multiplication & Division',
    indices: '🔢 Indices (Powers)',
    percentages: '💯 Percentages',
    fractions: '🍕 Fractions',
    squareroots: '√ Square Roots'
};

// ==================== DOM ELEMENTS ====================
const elements = {
    currentTopicDisplay: document.getElementById('currentTopicDisplay'),
    difficultyDisplay: document.getElementById('difficultyDisplay'),
    timerDisplay: document.getElementById('timerDisplay'),
    questionText: document.getElementById('questionText'),
    choicesContainer: document.getElementById('choicesContainer'),
    questionsDone: document.getElementById('questionsDone'),
    questionsCorrect: document.getElementById('questionsCorrect'),
    startBtn: document.getElementById('startBtn'),
    tryAgainBtn: document.getElementById('tryAgainBtn'),
    leaderboardBtn: document.getElementById('leaderboardBtn'),
    moreTopicsBtn: document.getElementById('moreTopicsBtn'),
    
    // Modals
    topicsModal: document.getElementById('topicsModal'),
    resultsModal: document.getElementById('resultsModal'),
    leaderboardModal: document.getElementById('leaderboardModal'),
    
    // Close buttons
    closeTopicsModal: document.getElementById('closeTopicsModal'),
    closeResultsModal: document.getElementById('closeResultsModal'),
    closeLeaderboardModal: document.getElementById('closeLeaderboardModal'),
    closeResultsBtn: document.getElementById('closeResultsBtn'),
    
    // Results elements
    totalAnswered: document.getElementById('totalAnswered'),
    totalCorrect: document.getElementById('totalCorrect'),
    totalWrong: document.getElementById('totalWrong'),
    correctList: document.getElementById('correctList'),
    wrongList: document.getElementById('wrongList'),
    highScoreMessage: document.getElementById('highScoreMessage'),
    
    // Leaderboard elements
    overallScores: document.getElementById('overallScores'),
    topicScoresContainer: document.getElementById('topicScoresContainer')
};

// ==================== QUESTION GENERATORS ====================
const questionGenerators = {
    addition: (difficulty) => {
        let max, min;
        switch(difficulty) {
            case 1: max = 20; min = 1; break;
            case 2: max = 50; min = 10; break;
            case 3: max = 100; min = 20; break;
            case 4: max = 500; min = 50; break;
            default: max = 1000; min = 100;
        }
        
        const isAddition = Math.random() > 0.5;
        const a = Math.floor(Math.random() * (max - min + 1)) + min;
        const b = Math.floor(Math.random() * (max - min + 1)) + min;
        
        if (isAddition) {
            return { question: `${a} + ${b} = ?`, answer: a + b };
        } else {
            const larger = Math.max(a, b);
            const smaller = Math.min(a, b);
            return { question: `${larger} - ${smaller} = ?`, answer: larger - smaller };
        }
    },
    
    multiplication: (difficulty) => {
        let maxA, maxB;
        switch(difficulty) {
            case 1: maxA = 10; maxB = 10; break;
            case 2: maxA = 12; maxB = 12; break;
            case 3: maxA = 15; maxB = 12; break;
            case 4: maxA = 20; maxB = 15; break;
            default: maxA = 25; maxB = 20;
        }
        
        const isMultiplication = Math.random() > 0.3;
        const a = Math.floor(Math.random() * maxA) + 2;
        const b = Math.floor(Math.random() * maxB) + 2;
        
        if (isMultiplication) {
            return { question: `${a} × ${b} = ?`, answer: a * b };
        } else {
            const product = a * b;
            return { question: `${product} ÷ ${a} = ?`, answer: b };
        }
    },
    
    indices: (difficulty) => {
        let bases, powers;
        switch(difficulty) {
            case 1: bases = [2, 3, 4, 5]; powers = [2]; break;
            case 2: bases = [2, 3, 4, 5, 6]; powers = [2, 3]; break;
            case 3: bases = [2, 3, 4, 5, 6, 7]; powers = [2, 3]; break;
            case 4: bases = [2, 3, 4, 5, 6, 7, 8]; powers = [2, 3, 4]; break;
            default: bases = [2, 3, 4, 5, 6, 7, 8, 9, 10]; powers = [2, 3, 4];
        }
        
        const base = bases[Math.floor(Math.random() * bases.length)];
        const power = powers[Math.floor(Math.random() * powers.length)];
        const answer = Math.pow(base, power);
        
        // Limit answer to reasonable numbers
        if (answer > 10000) {
            return questionGenerators.indices(Math.max(1, difficulty - 1));
        }
        
        return { question: `${base}^${power} = ?`, answer: answer };
    },
    
    percentages: (difficulty) => {
        let percentages, numbers;
        switch(difficulty) {
            case 1: percentages = [10, 50, 25]; numbers = [100, 200, 50]; break;
            case 2: percentages = [10, 20, 25, 50, 75]; numbers = [100, 200, 80, 120]; break;
            case 3: percentages = [5, 10, 15, 20, 25, 30, 50]; numbers = [100, 200, 150, 250, 300]; break;
            case 4: percentages = [5, 10, 15, 20, 25, 30, 40, 50, 60]; numbers = [50, 80, 120, 150, 200, 250]; break;
            default: percentages = [5, 10, 12, 15, 20, 25, 30, 35, 40, 50]; numbers = [40, 60, 80, 120, 150, 200, 250, 300];
        }
        
        const percent = percentages[Math.floor(Math.random() * percentages.length)];
        const number = numbers[Math.floor(Math.random() * numbers.length)];
        const answer = (percent / 100) * number;
        
        return { question: `${percent}% of ${number} = ?`, answer: answer };
    },
    
    fractions: (difficulty) => {
        let denominators;
        switch(difficulty) {
            case 1: denominators = [2, 4]; break;
            case 2: denominators = [2, 3, 4, 5]; break;
            case 3: denominators = [2, 3, 4, 5, 6, 8]; break;
            case 4: denominators = [2, 3, 4, 5, 6, 8, 10]; break;
            default: denominators = [2, 3, 4, 5, 6, 8, 10, 12];
        }
        
        const d1 = denominators[Math.floor(Math.random() * denominators.length)];
        const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
        
        // Generate a whole number to multiply with the fraction
        const multiplier = Math.floor(Math.random() * 10) + 2;
        const answer = (n1 / d1) * multiplier;
        
        if (Number.isInteger(answer)) {
            return { question: `${n1}/${d1} × ${multiplier} = ?`, answer: answer };
        } else {
            // Simplify to get whole number
            const newMultiplier = d1 * Math.floor(Math.random() * 3 + 1);
            return { question: `${n1}/${d1} × ${newMultiplier} = ?`, answer: (n1 / d1) * newMultiplier };
        }
    },
    
    squareroots: (difficulty) => {
        let perfectSquares;
        switch(difficulty) {
            case 1: perfectSquares = [4, 9, 16, 25]; break;
            case 2: perfectSquares = [4, 9, 16, 25, 36, 49]; break;
            case 3: perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81]; break;
            case 4: perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121]; break;
            default: perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
        }
        
        const square = perfectSquares[Math.floor(Math.random() * perfectSquares.length)];
        const answer = Math.sqrt(square);
        
        return { question: `√${square} = ?`, answer: answer };
    }
};

// ==================== GENERATE CHOICES ====================
function generateChoices(correctAnswer) {
    const choices = [correctAnswer];
    const range = Math.max(5, Math.ceil(correctAnswer * 0.3));
    
    while (choices.length < 4) {
        let wrongAnswer;
        const variation = Math.floor(Math.random() * range) + 1;
        
        if (Math.random() > 0.5) {
            wrongAnswer = correctAnswer + variation;
        } else {
            wrongAnswer = Math.max(0, correctAnswer - variation);
        }
        
        // Make sure it's a reasonable number
        if (correctAnswer % 1 === 0) {
            wrongAnswer = Math.round(wrongAnswer);
        } else {
            wrongAnswer = Math.round(wrongAnswer * 100) / 100;
        }
        
        if (!choices.includes(wrongAnswer) && wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
            choices.push(wrongAnswer);
        }
    }
    
    // Shuffle choices
    return choices.sort(() => Math.random() - 0.5);
}

// ==================== GAME FUNCTIONS ====================
function generateQuestion() {
    if (!gameState.currentTopic) return;
    
    const generator = questionGenerators[gameState.currentTopic];
    const { question, answer } = generator(gameState.difficultyLevel);
    
    gameState.currentQuestion = question;
    gameState.correctAnswer = answer;
    gameState.currentChoices = generateChoices(answer);
    
    displayQuestion();
}

function displayQuestion() {
    elements.questionText.textContent = gameState.currentQuestion;
    
    const choiceButtons = elements.choicesContainer.querySelectorAll('.btn-choice');
    choiceButtons.forEach((btn, index) => {
        btn.textContent = gameState.currentChoices[index];
        btn.className = 'btn btn-choice';
        btn.disabled = false;
    });
}

function handleAnswer(selectedIndex) {
    if (!gameState.isPlaying) return;
    
    const selectedAnswer = gameState.currentChoices[selectedIndex];
    const isCorrect = selectedAnswer === gameState.correctAnswer;
    const choiceButtons = elements.choicesContainer.querySelectorAll('.btn-choice');
    
    // Disable all buttons
    choiceButtons.forEach(btn => btn.disabled = true);
    
    // Record question history
    gameState.questionsHistory.push({
        question: gameState.currentQuestion,
        userAnswer: selectedAnswer,
        correctAnswer: gameState.correctAnswer,
        isCorrect: isCorrect
    });
    
    // Visual feedback
    choiceButtons[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
    
    if (!isCorrect) {
        // Show correct answer
        const correctIndex = gameState.currentChoices.indexOf(gameState.correctAnswer);
        choiceButtons[correctIndex].classList.add('show-correct');
    }
    
    // Update stats
    gameState.questionsDone++;
    elements.questionsDone.textContent = gameState.questionsDone;
    
    if (isCorrect) {
        gameState.questionsCorrect++;
        gameState.consecutiveCorrect++;
        elements.questionsCorrect.textContent = gameState.questionsCorrect;
        
        // Increase difficulty after 3 consecutive correct answers
        if (gameState.consecutiveCorrect >= 3 && gameState.difficultyLevel < 5) {
            gameState.difficultyLevel++;
            gameState.consecutiveCorrect = 0;
            updateDifficultyDisplay();
        }
    } else {
        gameState.consecutiveCorrect = 0;
        // Decrease difficulty on wrong answer (but not below 1)
        if (gameState.difficultyLevel > 1) {
            gameState.difficultyLevel--;
            updateDifficultyDisplay();
        }
    }
    
    // Next question after brief delay
    setTimeout(() => {
        if (gameState.isPlaying) {
            generateQuestion();
        }
    }, 800);
}

function updateDifficultyDisplay() {
    const difficultyNames = ['Easy', 'Medium', 'Hard', 'Expert', 'Master'];
    gameState.difficulty = difficultyNames[gameState.difficultyLevel - 1];
    elements.difficultyDisplay.textContent = gameState.difficulty;
}

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        elements.timerDisplay.textContent = `${gameState.timeRemaining}s`;
        
        // Warning when time is low
        if (gameState.timeRemaining <= 10) {
            elements.timerDisplay.parentElement.classList.add('warning');
        }
        
        if (gameState.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

function startGame() {
    if (!gameState.currentTopic) {
        alert('Please select a topic first! 📚');
        return;
    }
    
    // Reset game state
    gameState.difficultyLevel = 1;
    gameState.consecutiveCorrect = 0;
    gameState.timeRemaining = 60;
    gameState.questionsDone = 0;
    gameState.questionsCorrect = 0;
    gameState.isPlaying = true;
    gameState.questionsHistory = [];
    
    // Update UI
    elements.questionsDone.textContent = '0';
    elements.questionsCorrect.textContent = '0';
    elements.timerDisplay.textContent = '60s';
    elements.timerDisplay.parentElement.classList.remove('warning');
    updateDifficultyDisplay();
    
    // Disable start button
    elements.startBtn.disabled = true;
    
    // Start game
    generateQuestion();
    startTimer();
}

function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    
    // Disable choice buttons
    const choiceButtons = elements.choicesContainer.querySelectorAll('.btn-choice');
    choiceButtons.forEach(btn => btn.disabled = true);
    
    // Save score and show results
    saveScore();
    showResults();
}

function resetGame() {
    // Stop any running game
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Reset state
    gameState.difficultyLevel = 1;
    gameState.consecutiveCorrect = 0;
    gameState.timeRemaining = 60;
    gameState.questionsDone = 0;
    gameState.questionsCorrect = 0;
    gameState.isPlaying = false;
    gameState.questionsHistory = [];
    
    // Update UI
    elements.questionsDone.textContent = '0';
    elements.questionsCorrect.textContent = '0';
    elements.timerDisplay.textContent = '60s';
    elements.timerDisplay.parentElement.classList.remove('warning');
    updateDifficultyDisplay();
    elements.questionText.textContent = 'Select a topic and press Start to begin! 🚀';
    
    // Reset choice buttons
    const choiceButtons = elements.choicesContainer.querySelectorAll('.btn-choice');
    choiceButtons.forEach(btn => {
        btn.textContent = '-';
        btn.className = 'btn btn-choice';
        btn.disabled = false;
    });
    
    // Enable start button if topic is selected
    elements.startBtn.disabled = !gameState.currentTopic;
}

// ==================== LOCAL STORAGE FUNCTIONS ====================
function saveScore() {
    const score = {
        topic: gameState.currentTopic,
        topicName: topicNames[gameState.currentTopic],
        score: gameState.questionsCorrect,
        totalQuestions: gameState.questionsDone,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
    };
    
    // Get existing scores
    let allScores = JSON.parse(localStorage.getItem('mathTriviaScores')) || [];
    allScores.push(score);
    
    // Keep only top 50 scores overall
    allScores.sort((a, b) => b.score - a.score);
    allScores = allScores.slice(0, 50);
    
    localStorage.setItem('mathTriviaScores', JSON.stringify(allScores));
    
    // Update high score per topic
    let topicHighScores = JSON.parse(localStorage.getItem('mathTriviaTopicHighScores')) || {};
    if (!topicHighScores[gameState.currentTopic] || score.score > topicHighScores[gameState.currentTopic].score) {
        topicHighScores[gameState.currentTopic] = score;
        return true; // New high score
    }
    
    localStorage.setItem('mathTriviaTopicHighScores', JSON.stringify(topicHighScores));
    return false;
}

function getOverallLeaderboard() {
    let allScores = JSON.parse(localStorage.getItem('mathTriviaScores')) || [];
    return allScores.sort((a, b) => b.score - a.score).slice(0, 10);
}

function getTopicHighScores() {
    return JSON.parse(localStorage.getItem('mathTriviaTopicHighScores')) || {};
}

// ==================== MODAL FUNCTIONS ====================
function showTopicsModal() {
    elements.topicsModal.classList.add('active');
}

function hideTopicsModal() {
    elements.topicsModal.classList.remove('active');
}

function showResults() {
    const correctQuestions = gameState.questionsHistory.filter(q => q.isCorrect);
    const wrongQuestions = gameState.questionsHistory.filter(q => !q.isCorrect);
    
    // Update summary stats
    elements.totalAnswered.textContent = gameState.questionsDone;
    elements.totalCorrect.textContent = gameState.questionsCorrect;
    elements.totalWrong.textContent = gameState.questionsDone - gameState.questionsCorrect;
    
    // Populate correct answers list
    elements.correctList.innerHTML = correctQuestions.map(q => `
        <li>
            <span class="question-text">${q.question}</span>
            <span class="answer-text correct-answer">Your answer: ${q.userAnswer} ✓</span>
        </li>
    `).join('') || '<li>No correct answers</li>';
    
    // Populate wrong answers list
    elements.wrongList.innerHTML = wrongQuestions.map(q => `
        <li>
            <span class="question-text">${q.question}</span>
            <span class="answer-text wrong-answer">Your answer: ${q.userAnswer} ✗</span>
            <span class="answer-text correct-answer">Correct: ${q.correctAnswer}</span>
        </li>
    `).join('') || '<li>No wrong answers - Perfect! 🎉</li>';
    
    // Check for high score
    const topicHighScores = getTopicHighScores();
    const currentTopicHigh = topicHighScores[gameState.currentTopic];
    
    if (!currentTopicHigh || gameState.questionsCorrect > currentTopicHigh.score) {
        elements.highScoreMessage.textContent = '🎉 NEW HIGH SCORE! 🎉';
        elements.highScoreMessage.classList.add('show');
    } else {
        elements.highScoreMessage.classList.remove('show');
    }
    
    // Create chart
    createResultsChart(gameState.questionsCorrect, gameState.questionsDone - gameState.questionsCorrect);
    
    elements.resultsModal.classList.add('active');
}

function hideResults() {
    elements.resultsModal.classList.remove('active');
    resetGame();
}

function showLeaderboard() {
    // Populate overall leaderboard
    const overallScores = getOverallLeaderboard();
    elements.overallScores.innerHTML = overallScores.map((score, index) => `
        <tr>
            <td>${index + 1}${index === 0 ? ' 🥇' : index === 1 ? ' 🥈' : index === 2 ? ' 🥉' : ''}</td>
            <td>${score.topicName}</td>
            <td>${score.score}/${score.totalQuestions}</td>
            <td>${score.date}</td>
        </tr>
    `).join('') || '<tr><td colspan="4">No scores yet! Play a game to get on the leaderboard! 🎮</td></tr>';
    
    // Populate topic high scores
    const topicHighScores = getTopicHighScores();
    elements.topicScoresContainer.innerHTML = Object.keys(topicNames).map(topic => {
        const highScore = topicHighScores[topic];
        return `
            <div class="topic-score-section">
                <h4>${topicNames[topic]}</h4>
                ${highScore ? `
                    <p><span>High Score:</span> <span>${highScore.score}/${highScore.totalQuestions}</span></p>
                    <p><span>Date:</span> <span>${highScore.date}</span></p>
                ` : '<p>No high score yet</p>'}
            </div>
        `;
    }).join('');
    
    elements.leaderboardModal.classList.add('active');
}

function hideLeaderboard() {
    elements.leaderboardModal.classList.remove('active');
}

// ==================== CHART FUNCTION ====================
let resultsChart = null;

function createResultsChart(correct, wrong) {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (resultsChart) {
        resultsChart.destroy();
    }
    
    resultsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Correct ✅', 'Wrong ❌'],
            datasets: [{
                data: [correct, wrong],
                backgroundColor: [
                    'rgba(56, 239, 125, 0.8)',
                    'rgba(244, 92, 67, 0.8)'
                ],
                borderColor: [
                    'rgba(56, 239, 125, 1)',
                    'rgba(244, 92, 67, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = correct + wrong;
                            const percentage = total > 0 ? Math.round((context.raw / total) * 100) : 0;
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ==================== EVENT LISTENERS ====================
// Topic selection buttons
document.querySelectorAll('.btn-topic-select').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove selected class from all
        document.querySelectorAll('.btn-topic-select').forEach(b => b.classList.remove('selected'));
        
        // Add selected class to clicked button
        btn.classList.add('selected');
        
        // Update game state
        gameState.currentTopic = btn.dataset.topic;
        elements.currentTopicDisplay.textContent = topicNames[gameState.currentTopic];
        
        // Enable start button
        elements.startBtn.disabled = false;
        
        // Close modal
        hideTopicsModal();
        
        // Reset game if one was in progress
        if (gameState.isPlaying) {
            resetGame();
        }
    });
});

// Choice buttons
document.querySelectorAll('.btn-choice').forEach((btn, index) => {
    btn.addEventListener('click', () => handleAnswer(index));
});

// Control buttons
elements.startBtn.addEventListener('click', startGame);
elements.tryAgainBtn.addEventListener('click', resetGame);
elements.leaderboardBtn.addEventListener('click', showLeaderboard);
elements.moreTopicsBtn.addEventListener('click', showTopicsModal);

// Modal close buttons
elements.closeTopicsModal.addEventListener('click', hideTopicsModal);
elements.closeResultsModal.addEventListener('click', hideResults);
elements.closeResultsBtn.addEventListener('click', hideResults);
elements.closeLeaderboardModal.addEventListener('click', hideLeaderboard);

// Leaderboard tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.leaderboard-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}Leaderboard`).classList.add('active');
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === elements.topicsModal) hideTopicsModal();
    if (e.target === elements.resultsModal) hideResults();
    if (e.target === elements.leaderboardModal) hideLeaderboard();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (!gameState.isPlaying) return;
    
    const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
    if (keyMap.hasOwnProperty(e.key)) {
        handleAnswer(keyMap[e.key]);
    }
});

// ==================== INITIALIZATION ====================
console.log('🧮 Math Trivia Game Loaded! Good luck! 🎯');
