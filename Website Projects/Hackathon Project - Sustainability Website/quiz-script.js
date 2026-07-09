// Quiz Data and Configuration
const quizData = [
    // Diet Questions (2 questions)
    {
        category: "Diet",
        icon: "restaurant",
        question: "How often do you consume meat and dairy products?",
        options: [
            { text: "Daily - meat and dairy in most meals", score: 5 },
            { text: "Several times a week", score: 4 },
            { text: "Occasionally - few times a month", score: 3 },
            { text: "Rarely - mostly plant-based", score: 2 },
            { text: "Never - fully vegan/vegetarian", score: 1 }
        ]
    },
    {
        category: "Diet",
        icon: "restaurant",
        question: "How much food do you typically waste?",
        options: [
            { text: "Significant amount - often throw away leftovers", score: 5 },
            { text: "Moderate amount - some food goes bad", score: 4 },
            { text: "Small amount - occasionally waste food", score: 3 },
            { text: "Very little - plan meals carefully", score: 2 },
            { text: "Almost none - use everything I buy", score: 1 }
        ]
    },

    // Transport Questions (2 questions)
    {
        category: "Transport",
        icon: "directions_car",
        question: "What is your primary mode of transportation?",
        options: [
            { text: "Personal car for most trips", score: 5 },
            { text: "Mix of car and public transport", score: 4 },
            { text: "Mostly public transport", score: 3 },
            { text: "Cycling and walking with some public transport", score: 2 },
            { text: "Primarily walking and cycling", score: 1 }
        ]
    },
    {
        category: "Transport",
        icon: "flight",
        question: "How often do you fly for travel?",
        options: [
            { text: "Multiple international flights per year", score: 5 },
            { text: "1-2 international flights annually", score: 4 },
            { text: "Occasional domestic flights", score: 3 },
            { text: "Rarely fly - prefer ground transport", score: 2 },
            { text: "Never or almost never fly", score: 1 }
        ]
    },

    // Energy Questions (2 questions)
    {
        category: "Energy",
        icon: "power",
        question: "How do you heat and cool your home?",
        options: [
            { text: "High energy use - AC/heating frequently", score: 5 },
            { text: "Moderate energy use", score: 4 },
            { text: "Conscious about energy - adjust temperature", score: 3 },
            { text: "Minimal use - natural climate control", score: 2 },
            { text: "Renewable energy sources", score: 1 }
        ]
    },
    {
        category: "Energy",
        icon: "lightbulb",
        question: "How conscious are you about electricity usage?",
        options: [
            { text: "Don't think about it - leave devices on", score: 5 },
            { text: "Somewhat conscious", score: 4 },
            { text: "Turn off lights and devices when not using", score: 3 },
            { text: "Very conscious - unplug devices", score: 2 },
            { text: "Extremely mindful - track energy usage", score: 1 }
        ]
    },

    // Water Questions (2 questions)
    {
        category: "Water",
        icon: "water_drop",
        question: "How long are your typical showers?",
        options: [
            { text: "Long showers (15+ minutes)", score: 5 },
            { text: "Moderate length (10-15 minutes)", score: 4 },
            { text: "Standard showers (5-10 minutes)", score: 3 },
            { text: "Quick showers (under 5 minutes)", score: 2 },
            { text: "Very quick or skip days", score: 1 }
        ]
    },
    {
        category: "Water",
        icon: "local_drink",
        question: "How do you primarily consume water?",
        options: [
            { text: "Mostly bottled water", score: 5 },
            { text: "Mix of bottled and tap water", score: 4 },
            { text: "Mostly tap water", score: 3 },
            { text: "Filtered tap water", score: 2 },
            { text: "Reusable bottle with filtered water", score: 1 }
        ]
    },

    // Waste Questions (2 questions)
    {
        category: "Waste",
        icon: "delete",
        question: "How do you handle waste and recycling?",
        options: [
            { text: "Don't separate - everything in trash", score: 5 },
            { text: "Basic recycling when convenient", score: 4 },
            { text: "Regular recycling habits", score: 3 },
            { text: "Careful sorting and composting", score: 2 },
            { text: "Minimal waste - reuse and compost everything", score: 1 }
        ]
    },
    {
        category: "Waste",
        icon: "shopping_bag",
        question: "What type of bags do you use for shopping?",
        options: [
            { text: "Always use store plastic bags", score: 5 },
            { text: "Sometimes bring reusable bags", score: 4 },
            { text: "Usually bring reusable bags", score: 3 },
            { text: "Always bring reusable bags", score: 2 },
            { text: "Use reusable bags and avoid packaging", score: 1 }
        ]
    },

    // Consumer Habits Questions (2 questions)
    {
        category: "Consumer Habits",
        icon: "shopping_cart",
        question: "How often do you buy new clothing?",
        options: [
            { text: "Very frequently - following trends", score: 5 },
            { text: "Regularly - several times a month", score: 4 },
            { text: "Occasionally - when needed", score: 3 },
            { text: "Rarely - only when necessary", score: 2 },
            { text: "Almost never - repair and reuse", score: 1 }
        ]
    },
    {
        category: "Consumer Habits",
        icon: "devices",
        question: "How often do you replace electronic devices?",
        options: [
            { text: "Frequently - like latest technology", score: 5 },
            { text: "Every 2-3 years", score: 4 },
            { text: "Every 4-5 years", score: 3 },
            { text: "Only when broken", score: 2 },
            { text: "Use devices until completely unusable", score: 1 }
        ]
    },

    // Digital Lifestyle Questions (2 questions)
    {
        category: "Digital Lifestyle",
        icon: "computer",
        question: "How much time do you spend on digital devices daily?",
        options: [
            { text: "Excessive use - 10+ hours", score: 5 },
            { text: "Heavy use - 7-10 hours", score: 4 },
            { text: "Moderate use - 4-7 hours", score: 3 },
            { text: "Light use - 2-4 hours", score: 2 },
            { text: "Minimal use - under 2 hours", score: 1 }
        ]
    },
    {
        category: "Digital Lifestyle",
        icon: "cloud",
        question: "How do you manage your digital storage and cloud usage?",
        options: [
            { text: "Don't think about it - unlimited storage", score: 5 },
            { text: "Use cloud storage freely", score: 4 },
            { text: "Moderate cloud usage", score: 3 },
            { text: "Conscious about digital storage", score: 2 },
            { text: "Minimize digital footprint and storage", score: 1 }
        ]
    },

    // Community Questions (2 questions)
    {
        category: "Community",
        icon: "groups",
        question: "How involved are you in environmental community activities?",
        options: [
            { text: "Not involved at all", score: 5 },
            { text: "Occasionally participate", score: 4 },
            { text: "Sometimes join environmental events", score: 3 },
            { text: "Regularly participate in eco-activities", score: 2 },
            { text: "Actively lead environmental initiatives", score: 1 }
        ]
    },
    {
        category: "Community",
        icon: "volunteer_activism",
        question: "How do you influence others toward sustainability?",
        options: [
            { text: "Don't discuss environmental topics", score: 5 },
            { text: "Rarely mention sustainability", score: 4 },
            { text: "Sometimes share eco-friendly tips", score: 3 },
            { text: "Regularly advocate for sustainability", score: 2 },
            { text: "Actively educate and inspire others", score: 1 }
        ]
    }
];

// Quiz State
let currentQuestion = 0;
let answers = [];
let quizChart = null;

// DOM Elements
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressPercentage = document.getElementById('progressPercentage');
const questionCard = document.getElementById('questionCard');
const completionCard = document.getElementById('completionCard');
const categoryBadge = document.getElementById('categoryBadge');
const categoryIcon = document.getElementById('categoryIcon');
const categoryName = document.getElementById('categoryName');
const questionNumber = document.getElementById('questionNumber');
const questionTitle = document.getElementById('questionTitle');
const answerOptions = document.getElementById('answerOptions');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const completeBtn = document.getElementById('completeBtn');
const resultsModal = document.getElementById('resultsModal');
const closeResults = document.getElementById('closeResults');
const scorePercentage = document.getElementById('scorePercentage');
const scoreLabel = document.getElementById('scoreLabel');
const scoreDescription = document.getElementById('scoreDescription');
const learnMoreBtn = document.getElementById('learnMoreBtn');

// Initialize Quiz
function initializeQuiz() {
    answers = new Array(quizData.length).fill(null);
    currentQuestion = 0;
    displayQuestion();
    updateProgress();
    updateNavigation();
}

// Display Current Question
function displayQuestion() {
    const question = quizData[currentQuestion];
    
    // Update category badge
    categoryIcon.textContent = question.icon;
    categoryName.textContent = question.category;
    
    // Update question number and title
    questionNumber.textContent = currentQuestion + 1;
    questionTitle.textContent = question.question;
    
    // Clear and populate answer options
    answerOptions.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'answer-option';
        optionElement.textContent = option.text;
        optionElement.onclick = () => selectAnswer(index);
        
        // Mark as selected if previously chosen
        if (answers[currentQuestion] === index) {
            optionElement.classList.add('selected');
        }
        
        answerOptions.appendChild(optionElement);
    });
}

// Handle Answer Selection
function selectAnswer(optionIndex) {
    answers[currentQuestion] = optionIndex;
    
    // Update visual selection
    const options = answerOptions.querySelectorAll('.answer-option');
    options.forEach((option, index) => {
        option.classList.toggle('selected', index === optionIndex);
    });
    
    // Enable next button
    updateNavigation();
}

// Navigation Functions
function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        displayQuestion();
        updateProgress();
        updateNavigation();
    } else {
        // This is the last question, show completion
        showCompletion();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
        updateProgress();
        updateNavigation();
    }
}

function updateNavigation() {
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = answers[currentQuestion] === null;
    
    // Update next button text for last question
    if (currentQuestion === quizData.length - 1) {
        nextBtn.innerHTML = '<span>Finish</span><span class="material-icons">check_circle</span>';
    } else {
        nextBtn.innerHTML = '<span>Next</span><span class="material-icons">arrow_forward</span>';
    }
}

// Update Progress Bar and Dots
function updateProgress() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
    progressPercentage.textContent = `${Math.round(progress)}%`;
    
    // Update progress dots
    updateProgressDots();
}

// Create and update progress dots
function updateProgressDots() {
    const progressDotsContainer = document.getElementById('progressDots');
    if (!progressDotsContainer) return;
    
    // Clear existing dots
    progressDotsContainer.innerHTML = '';
    
    // Create a dot for each question
    for (let i = 0; i < quizData.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        
        // Mark as completed if we've answered this question
        if (i < currentQuestion) {
            dot.classList.add('completed');
        }
        // Mark as active if this is the current question
        else if (i === currentQuestion) {
            dot.classList.add('active');
        }
        
        // Add click handler to jump to specific question
        dot.addEventListener('click', () => {
            if (i <= currentQuestion) {
                // Allow going back to answered questions
                navigateToQuestion(i);
            }
        });
        
        progressDotsContainer.appendChild(dot);
    }
}

// Show Completion Screen
function showCompletion() {
    questionCard.classList.add('hidden');
    completionCard.classList.remove('hidden');
    
    // Update progress to 100%
    progressFill.style.width = '100%';
    progressText.textContent = `Quiz Complete!`;
    progressPercentage.textContent = '100%';
}

// Calculate Results
function calculateResults() {
    const totalPossibleScore = quizData.length * 5; // Maximum 5 points per question
    let totalScore = 0;
    const categoryScores = {};
    const categoryCounts = {};
    
    // Calculate scores by category
    answers.forEach((answerIndex, questionIndex) => {
        if (answerIndex !== null) {
            const question = quizData[questionIndex];
            const score = question.options[answerIndex].score;
            totalScore += score;
            
            if (!categoryScores[question.category]) {
                categoryScores[question.category] = 0;
                categoryCounts[question.category] = 0;
            }
            
            categoryScores[question.category] += score;
            categoryCounts[question.category]++;
        }
    });
    
    // Convert to percentages (lower percentage = better for environment)
    const overallPercentage = Math.round((totalScore / totalPossibleScore) * 100);
    
    const categoryPercentages = {};
    Object.keys(categoryScores).forEach(category => {
        const maxCategoryScore = categoryCounts[category] * 5;
        categoryPercentages[category] = Math.round((categoryScores[category] / maxCategoryScore) * 100);
    });
    
    return {
        overall: overallPercentage,
        categories: categoryPercentages,
        totalScore,
        maxScore: totalPossibleScore
    };
}

// Get Score Label and Description
function getScoreInfo(percentage) {
    if (percentage <= 20) {
        return {
            label: "Eco Champion",
            description: "Outstanding! You have an exceptionally low environmental footprint. You're already living a highly sustainable lifestyle."
        };
    } else if (percentage <= 40) {
        return {
            label: "Green Warrior",
            description: "Excellent! You have a low environmental footprint with great sustainability practices. Keep up the fantastic work!"
        };
    } else if (percentage <= 60) {
        return {
            label: "Eco-Conscious",
            description: "Good job! You're on the right track with moderate environmental impact. There's room for improvement in some areas."
        };
    } else if (percentage <= 80) {
        return {
            label: "Getting Started",
            description: "You're beginning your sustainability journey. There are many opportunities to reduce your environmental footprint."
        };
    } else {
        return {
            label: "Room to Grow",
            description: "Your environmental impact is quite high. Small changes in daily habits can make a significant difference!"
        };
    }
}

// Display Results
function showResults() {
    const results = calculateResults();
    const scoreInfo = getScoreInfo(results.overall);
    
    // Update score display
    scorePercentage.textContent = `${results.overall}%`;
    scoreLabel.textContent = scoreInfo.label;
    scoreDescription.textContent = scoreInfo.description;
    
    // Update score circle color based on performance
    const scoreCircle = document.getElementById('scoreCircle');
    if (results.overall <= 20) {
        scoreCircle.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    } else if (results.overall <= 40) {
        scoreCircle.style.background = 'linear-gradient(135deg, #53DB04 0%, #23FA8B 100%)';
    } else if (results.overall <= 60) {
        scoreCircle.style.background = 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)';
    } else {
        scoreCircle.style.background = 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)';
    }
    
    // Create pie chart
    createResultsChart(results.categories);
    
    // Show modal
    resultsModal.classList.remove('hidden');
}

// Create Results Chart
function createResultsChart(categoryData) {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (quizChart) {
        quizChart.destroy();
    }
    
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];
    
    quizChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}% impact`;
                        }
                    }
                }
            }
        }
    });
}

// Event Listeners
prevBtn.addEventListener('click', prevQuestion);
nextBtn.addEventListener('click', nextQuestion);
completeBtn.addEventListener('click', showResults);
closeResults.addEventListener('click', () => {
    resultsModal.classList.add('hidden');
});

learnMoreBtn.addEventListener('click', () => {
    // Save quiz results to localStorage for dashboard
    const results = calculateResults();
    localStorage.setItem('ecoQuizResults', JSON.stringify(results));
    
    // Navigate to dashboard
    window.location.href = 'dashboard.html';
});

// Close modal when clicking overlay
resultsModal.addEventListener('click', (e) => {
    if (e.target === resultsModal || e.target.classList.contains('modal-overlay')) {
        resultsModal.classList.add('hidden');
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (resultsModal.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevQuestion();
        } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
            nextQuestion();
        } else if (e.key >= '1' && e.key <= '5') {
            const optionIndex = parseInt(e.key) - 1;
            if (optionIndex < quizData[currentQuestion].options.length) {
                selectAnswer(optionIndex);
            }
        }
    } else if (e.key === 'Escape') {
        resultsModal.classList.add('hidden');
    }
});

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', initializeQuiz);