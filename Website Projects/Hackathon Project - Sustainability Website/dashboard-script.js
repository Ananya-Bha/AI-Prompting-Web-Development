// Dashboard JavaScript
class EcoDashboard {
    constructor() {
        this.quizResults = null;
        this.savedTips = new Set();
        this.reminders = [];
        this.chart = null;
        this.currentTipCategory = 'all';
        
        this.init();
    }

    init() {
        this.loadQuizResults();
        this.loadUserInfo();
        this.initializeChart();
        this.initializeTips();
        this.initializeReminders();
        this.initializeEventListeners();
        this.updatePerformanceChips();
        this.loadSavedData();
        this.initializeEditProfile();
    }

    // Load and display user information
    loadUserInfo() {
        const currentUser = localStorage.getItem('ecoquest_current_user');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            
            // Update welcome message
            const welcomeTitle = document.getElementById('welcomeTitle');
            const welcomeSubtitle = document.getElementById('welcomeSubtitle');
            const dashboardUserName = document.getElementById('dashboardUserName');
            const dashboardUserEmail = document.getElementById('dashboardUserEmail');
            const profileName = document.getElementById('profileName');
            const profileEmail = document.getElementById('profileEmail');
            const profileEcoScore = document.getElementById('profileEcoScore');
            
            if (welcomeTitle) {
                welcomeTitle.textContent = `Welcome back, ${user.name}!`;
            }
            
            if (welcomeSubtitle) {
                welcomeSubtitle.textContent = `Track your sustainability progress, ${user.name}, and discover new ways to reduce your environmental impact`;
            }
            
            if (dashboardUserName) {
                dashboardUserName.textContent = user.name;
            }
            
            if (dashboardUserEmail) {
                dashboardUserEmail.textContent = user.email;
            }
            
            if (profileName) {
                profileName.textContent = user.name;
            }
            
            if (profileEmail) {
                profileEmail.textContent = user.email;
            }
            
            // Update eco score in profile dropdown
            if (profileEcoScore) {
                profileEcoScore.textContent = `${this.quizResults.overall}%`;
            }
        }
    }

    // Load quiz results from localStorage
    loadQuizResults() {
        const stored = localStorage.getItem('ecoQuizResults');
        if (stored) {
            this.quizResults = JSON.parse(stored);
        } else {
            // Sample data if no quiz taken
            this.quizResults = {
                overall: 45,
                categories: {
                    'Diet': 40,
                    'Transport': 60,
                    'Energy': 35,
                    'Water': 50,
                    'Waste': 45,
                    'Consumer Habits': 55,
                    'Digital Lifestyle': 40,
                    'Community': 30
                }
            };
        }
    }

    // Initialize the main sustainability chart
    initializeChart() {
        const ctx = document.getElementById('sustainabilityChart').getContext('2d');
        
        const categories = Object.keys(this.quizResults.categories);
        const scores = Object.values(this.quizResults.categories);
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
            '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
        ];

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: scores,
                    backgroundColor: colors,
                    borderWidth: 3,
                    borderColor: '#fff',
                    hoverBorderWidth: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '60%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const category = context.label;
                                const score = context.parsed;
                                const advice = this.getCategoryAdvice(category, score);
                                return [
                                    `${category}: ${score}% impact`,
                                    `Tip: ${advice}`
                                ];
                            }
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#53DB04',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });

        // Update center text and legend
        this.updateChartCenter();
        this.createChartLegend();
    }

    getCategoryAdvice(category, score) {
        const advice = {
            'Diet': score > 50 ? 'Try more plant-based meals' : 'Great food choices!',
            'Transport': score > 50 ? 'Consider walking or cycling' : 'Excellent transport habits!',
            'Energy': score > 50 ? 'Switch to LED bulbs' : 'Great energy conservation!',
            'Water': score > 50 ? 'Take shorter showers' : 'Excellent water saving!',
            'Waste': score > 50 ? 'Increase recycling efforts' : 'Amazing waste management!',
            'Consumer Habits': score > 50 ? 'Buy less, choose quality' : 'Thoughtful purchasing!',
            'Digital Lifestyle': score > 50 ? 'Reduce screen time' : 'Balanced digital habits!',
            'Community': score > 50 ? 'Join local eco groups' : 'Great community involvement!'
        };
        return advice[category] || 'Keep up the good work!';
    }

    updateChartCenter() {
        const scoreElement = document.getElementById('overallScore');
        const labelElement = document.getElementById('scoreLabel');
        
        scoreElement.textContent = `${this.quizResults.overall}%`;
        
        let label = '';
        if (this.quizResults.overall <= 20) label = 'Eco Champion';
        else if (this.quizResults.overall <= 40) label = 'Green Warrior';
        else if (this.quizResults.overall <= 60) label = 'Eco-Conscious';
        else if (this.quizResults.overall <= 80) label = 'Getting Started';
        else label = 'Room to Grow';
        
        labelElement.textContent = label;
    }

    createChartLegend() {
        const legendContainer = document.getElementById('chartLegend');
        const categories = Object.keys(this.quizResults.categories);
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
            '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
        ];

        legendContainer.innerHTML = categories.map((category, index) => `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${colors[index]}"></div>
                <span>${category} (${this.quizResults.categories[category]}%)</span>
            </div>
        `).join('');
    }

    updatePerformanceChips() {
        const categories = this.quizResults.categories;
        const scores = Object.values(categories);
        const categoryNames = Object.keys(categories);
        
        // Find best and worst performing areas
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);
        const bestArea = categoryNames[scores.indexOf(minScore)];
        const worstArea = categoryNames[scores.indexOf(maxScore)];
        
        document.getElementById('bestArea').textContent = bestArea;
        document.getElementById('needsWork').textContent = worstArea;
        
        // Weekly trend is simulated
        const trends = ['+5% improvement', '+2% improvement', '-1% needs focus', '+3% improvement'];
        document.getElementById('weeklyTrend').textContent = trends[Math.floor(Math.random() * trends.length)];
    }

    // Initialize eco tips
    initializeTips() {
        this.ecoTips = [
            {
                id: 1,
                category: 'water',
                icon: 'water_drop',
                title: 'Take 5-Minute Showers',
                description: 'Shorter showers can save up to 25 gallons of water per shower session.',
                difficulty: 'easy'
            },
            {
                id: 2,
                category: 'food',
                icon: 'restaurant',
                title: 'Try Meatless Monday',
                description: 'Reducing meat consumption one day per week significantly lowers your carbon footprint.',
                difficulty: 'easy'
            },
            {
                id: 3,
                category: 'transport',
                icon: 'directions_bike',
                title: 'Bike to Work Once a Week',
                description: 'Cycling instead of driving reduces emissions and improves your health.',
                difficulty: 'medium'
            },
            {
                id: 4,
                category: 'energy',
                icon: 'lightbulb',
                title: 'Switch to LED Bulbs',
                description: 'LED bulbs use 75% less energy and last 25 times longer than incandescent bulbs.',
                difficulty: 'easy'
            },
            {
                id: 5,
                category: 'waste',
                icon: 'recycling',
                title: 'Start Composting',
                description: 'Composting organic waste reduces methane emissions and creates nutrient-rich soil.',
                difficulty: 'medium'
            },
            {
                id: 6,
                category: 'consumer',
                icon: 'shopping_bag',
                title: 'Buy Secondhand First',
                description: 'Choose used items before buying new to reduce manufacturing demand.',
                difficulty: 'easy'
            },
            {
                id: 7,
                category: 'digital',
                icon: 'smartphone',
                title: 'Digital Detox Hour',
                description: 'Turn off devices for one hour daily to reduce energy consumption.',
                difficulty: 'easy'
            },
            {
                id: 8,
                category: 'community',
                icon: 'groups',
                title: 'Join Local Cleanup',
                description: 'Participate in community environmental activities to multiply your impact.',
                difficulty: 'medium'
            },
            {
                id: 9,
                category: 'water',
                icon: 'tap',
                title: 'Fix Leaky Faucets',
                description: 'A dripping faucet can waste over 3,000 gallons of water per year.',
                difficulty: 'medium'
            },
            {
                id: 10,
                category: 'energy',
                icon: 'thermostat',
                title: 'Adjust Thermostat 2°F',
                description: 'Small temperature adjustments can reduce energy bills by 10-15%.',
                difficulty: 'easy'
            }
        ];

        this.renderTips();
    }

    renderTips() {
        const container = document.getElementById('tipsGrid');
        const filteredTips = this.currentTipCategory === 'all' 
            ? this.ecoTips 
            : this.ecoTips.filter(tip => tip.category === this.currentTipCategory);

        container.innerHTML = filteredTips.map(tip => `
            <div class="tip-card" data-tip-id="${tip.id}">
                <div class="tip-header">
                    <div class="tip-category">
                        <span class="material-icons">${tip.icon}</span>
                        <span>${tip.category}</span>
                    </div>
                    <button class="tip-save-btn ${this.savedTips.has(tip.id) ? 'saved' : ''}" 
                            onclick="dashboard.toggleSaveTip(${tip.id})">
                        <span class="material-icons">${this.savedTips.has(tip.id) ? 'bookmark' : 'bookmark_border'}</span>
                    </button>
                </div>
                <h3 class="tip-title">${tip.title}</h3>
                <p class="tip-description">${tip.description}</p>
                <div class="tip-actions">
                    <button class="btn-outline" onclick="dashboard.toggleSaveTip(${tip.id})">
                        <span class="material-icons">bookmark</span>
                        <span>${this.savedTips.has(tip.id) ? 'Saved' : 'Save'}</span>
                    </button>
                    <button class="btn-primary" onclick="dashboard.setReminder(${tip.id})">
                        <span class="material-icons">schedule</span>
                        <span>Try This</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    toggleSaveTip(tipId) {
        if (this.savedTips.has(tipId)) {
            this.savedTips.delete(tipId);
        } else {
            this.savedTips.add(tipId);
        }
        this.renderTips();
        this.saveData();
    }

    setReminder(tipId) {
        const tip = this.ecoTips.find(t => t.id === tipId);
        if (tip) {
            document.getElementById('reminderTitle').value = tip.title;
            document.getElementById('reminderDescription').value = tip.description;
            this.showReminderModal();
        }
    }

    // Initialize reminders
    initializeReminders() {
        // Sample reminders
        this.reminders = [
            {
                id: 1,
                title: 'Take 5-minute shower',
                time: '08:00',
                frequency: 'daily',
                active: true,
                nextDue: this.getNextDueDate('daily', '08:00')
            },
            {
                id: 2,
                title: 'Meatless Monday meal prep',
                time: '18:00',
                frequency: 'weekly',
                active: true,
                nextDue: this.getNextDueDate('weekly', '18:00')
            },
            {
                id: 3,
                title: 'Check bike tires',
                time: '07:30',
                frequency: 'weekly',
                active: false,
                nextDue: this.getNextDueDate('weekly', '07:30')
            }
        ];

        this.renderReminders();
    }

    getNextDueDate(frequency, time) {
        const now = new Date();
        const [hours, minutes] = time.split(':').map(Number);
        
        if (frequency === 'daily') {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(hours, minutes, 0, 0);
            return tomorrow;
        } else if (frequency === 'weekly') {
            const nextWeek = new Date(now);
            nextWeek.setDate(nextWeek.getDate() + 7);
            nextWeek.setHours(hours, minutes, 0, 0);
            return nextWeek;
        }
        return new Date();
    }

    renderReminders() {
        const container = document.getElementById('remindersList');
        const activeReminders = this.reminders
            .filter(r => r.active)
            .sort((a, b) => a.nextDue - b.nextDue)
            .slice(0, 3);

        if (activeReminders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">schedule</span>
                    <p>No upcoming reminders</p>
                    <p>Set your first eco-reminder!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = activeReminders.map(reminder => `
            <div class="reminder-item" data-reminder-id="${reminder.id}">
                <div class="reminder-content">
                    <div class="reminder-title">${reminder.title}</div>
                    <div class="reminder-time">${this.formatReminderTime(reminder)}</div>
                </div>
                <div class="reminder-actions">
                    <button class="reminder-btn" onclick="dashboard.snoozeReminder(${reminder.id})" title="Snooze">
                        <span class="material-icons">snooze</span>
                    </button>
                    <button class="reminder-btn" onclick="dashboard.toggleReminder(${reminder.id})" title="Pause">
                        <span class="material-icons">pause</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatReminderTime(reminder) {
        const now = new Date();
        const timeDiff = reminder.nextDue - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) {
            return `In ${days} day${days > 1 ? 's' : ''} at ${reminder.time}`;
        } else if (hours > 0) {
            return `In ${hours} hour${hours > 1 ? 's' : ''} at ${reminder.time}`;
        } else {
            return `Today at ${reminder.time}`;
        }
    }

    snoozeReminder(reminderId) {
        const reminder = this.reminders.find(r => r.id === reminderId);
        if (reminder) {
            // Snooze for 1 hour
            reminder.nextDue = new Date(reminder.nextDue.getTime() + 60 * 60 * 1000);
            this.renderReminders();
            this.saveData();
        }
    }

    toggleReminder(reminderId) {
        const reminder = this.reminders.find(r => r.id === reminderId);
        if (reminder) {
            reminder.active = !reminder.active;
            this.renderReminders();
            this.saveData();
        }
    }

    // Modal functions
    showReminderModal() {
        document.getElementById('reminderModal').classList.remove('hidden');
    }

    hideReminderModal() {
        document.getElementById('reminderModal').classList.add('hidden');
        document.getElementById('reminderForm').reset();
        document.getElementById('weeklyOptions').classList.add('hidden');
    }

    // Event listeners
    initializeEventListeners() {
        // Profile dropdown toggle
        document.getElementById('profileAvatar').addEventListener('click', () => {
            this.toggleProfileDropdown();
        });

        // Close profile dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-profile')) {
                this.hideProfileDropdown();
            }
        });

        // Tip filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTipCategory = btn.dataset.category;
                this.renderTips();
            });
        });

        // Reminder modal
        document.getElementById('addReminderBtn').addEventListener('click', () => {
            this.showReminderModal();
        });

        document.getElementById('closeReminderModal').addEventListener('click', () => {
            this.hideReminderModal();
        });

        document.getElementById('cancelReminder').addEventListener('click', () => {
            this.hideReminderModal();
        });

        // Frequency change handler
        document.getElementById('reminderFrequency').addEventListener('change', (e) => {
            const weeklyOptions = document.getElementById('weeklyOptions');
            if (e.target.value === 'weekly') {
                weeklyOptions.classList.remove('hidden');
            } else {
                weeklyOptions.classList.add('hidden');
            }
        });

        // Reminder form submission
        document.getElementById('reminderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleReminderSubmission();
        });

        // Modal overlay click
        document.getElementById('reminderModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.hideReminderModal();
            }
        });

        // Getting Started modal
        this.initializeGettingStarted();
    }

    // Profile functions
    toggleProfileDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        dropdown.classList.toggle('hidden');
    }

    hideProfileDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        dropdown.classList.add('hidden');
    }

    editProfile() {
        // Placeholder for profile editing functionality
        this.showSuccessAnimation('Profile editing coming soon!');
        this.hideProfileDropdown();
    }

    logout() {
        // Clear user data
        localStorage.removeItem('ecoDashboardData');
        localStorage.removeItem('ecoQuizResults');
        localStorage.removeItem('ecoquest_current_user');
        
        // Show logout animation
        this.showSuccessAnimation('Logged out successfully!');
        
        // Redirect to home page after delay
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
    }

    handleReminderSubmission() {
        const formData = new FormData(document.getElementById('reminderForm'));
        const title = document.getElementById('reminderTitle').value;
        const description = document.getElementById('reminderDescription').value;
        const frequency = document.getElementById('reminderFrequency').value;
        const time = document.getElementById('reminderTime').value;

        const newReminder = {
            id: Date.now(),
            title,
            description,
            time,
            frequency,
            active: true,
            nextDue: this.getNextDueDate(frequency, time)
        };

        this.reminders.push(newReminder);
        this.renderReminders();
        this.saveData();
        this.hideReminderModal();

        // Show success animation
        this.showSuccessAnimation('Reminder set successfully!');

        // Attempt Google Calendar integration
        this.addToGoogleCalendar(newReminder);
    }

    showSuccessAnimation(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <span class="material-icons">check_circle</span>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #53DB04 0%, #23FA8B 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Google Calendar integration (simplified)
    async addToGoogleCalendar(reminder) {
        try {
            // Parse the time to get hours and minutes
            const [hours, minutes] = reminder.time.split(':');
            
            // Create a date for today with the specified time
            const eventDate = new Date();
            eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            // If the time has already passed today, set it for tomorrow
            if (eventDate < new Date()) {
                eventDate.setDate(eventDate.getDate() + 1);
            }
            
            // Format the date for Google Calendar (YYYYMMDDTHHMMSS)
            const year = eventDate.getFullYear();
            const month = String(eventDate.getMonth() + 1).padStart(2, '0');
            const day = String(eventDate.getDate()).padStart(2, '0');
            const hour = String(eventDate.getHours()).padStart(2, '0');
            const minute = String(eventDate.getMinutes()).padStart(2, '0');
            
            const startDate = `${year}${month}${day}T${hour}${minute}00`;
            
            // End time is 30 minutes after start
            const endDate = new Date(eventDate);
            endDate.setMinutes(endDate.getMinutes() + 30);
            const endYear = endDate.getFullYear();
            const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
            const endDay = String(endDate.getDate()).padStart(2, '0');
            const endHour = String(endDate.getHours()).padStart(2, '0');
            const endMinute = String(endDate.getMinutes()).padStart(2, '0');
            const endDateStr = `${endYear}${endMonth}${endDay}T${endHour}${endMinute}00`;
            
            // Create Google Calendar URL
            const details = reminder.description ? ` - ${reminder.description}` : '';
            const title = encodeURIComponent(reminder.title);
            const text = encodeURIComponent(details);
            
            // Handle recurring events based on frequency
            let recurParam = '';
            if (reminder.frequency === 'daily') {
                recurParam = '&recur=RRULE:FREQ=DAILY';
            } else if (reminder.frequency === 'weekly') {
                recurParam = '&recur=RRULE:FREQ=WEEKLY';
            }
            
            const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDateStr}&details=${text}${recurParam}`;
            
            // Open Google Calendar in a new tab
            window.open(calendarUrl, '_blank');
            
            // Show success message
            this.showSuccessAnimation('Opening Google Calendar!');
            
        } catch (error) {
            console.error('Error adding to Google Calendar:', error);
            this.showSuccessAnimation('Failed to open Google Calendar. Please try again.');
        }
    }

    // Data persistence
    saveData() {
        const data = {
            savedTips: Array.from(this.savedTips),
            reminders: this.reminders,
            quizResults: this.quizResults
        };
        localStorage.setItem('ecoDashboardData', JSON.stringify(data));
    }

    loadSavedData() {
        const saved = localStorage.getItem('ecoDashboardData');
        if (saved) {
            const data = JSON.parse(saved);
            this.savedTips = new Set(data.savedTips || []);
            this.reminders = data.reminders || this.reminders;
            
            // Convert date strings back to Date objects
            this.reminders.forEach(reminder => {
                if (typeof reminder.nextDue === 'string') {
                    reminder.nextDue = new Date(reminder.nextDue);
                }
            });
            
            this.renderTips();
            this.renderReminders();
        }
    }

    // Initialize edit profile functionality
    initializeEditProfile() {
        const editForm = document.getElementById('editProfileForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleEditProfile(e));
        }
    }

    // Open edit profile modal
    editProfile() {
        const modal = document.getElementById('editProfileModal');
        const currentUser = localStorage.getItem('ecoquest_current_user');
        
        if (currentUser && modal) {
            const user = JSON.parse(currentUser);
            
            // Populate form with current data
            document.getElementById('editName').value = user.name;
            document.getElementById('editEmail').value = user.email;
            
            // Show modal
            modal.classList.remove('hidden');
        }
    }

    // Close edit profile modal
    closeEditModal() {
        const modal = document.getElementById('editProfileModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Handle edit profile form submission
    handleEditProfile(e) {
        e.preventDefault();
        
        const newName = document.getElementById('editName').value.trim();
        const newEmail = document.getElementById('editEmail').value.trim();
        
        // Validation
        if (!newName || !newEmail) {
            alert('Please fill in all fields.');
            return;
        }
        
        if (!this.isValidEmail(newEmail)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Get current user
        const currentUser = localStorage.getItem('ecoquest_current_user');
        if (!currentUser) return;
        
        const user = JSON.parse(currentUser);
        
        // Update user data
        user.name = newName;
        user.email = newEmail;
        
        // Save updated user data
        localStorage.setItem('ecoquest_current_user', JSON.stringify(user));
        
        // Update users list if it exists
        const users = JSON.parse(localStorage.getItem('ecoquest_users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].name = newName;
            users[userIndex].email = newEmail;
            localStorage.setItem('ecoquest_users', JSON.stringify(users));
        }
        
        // Refresh UI with new data
        this.loadUserInfo();
        
        // Close modal
        this.closeEditModal();
        
        // Show success message
        this.showSuccessAnimation('Profile updated successfully!');
    }

    // Email validation helper
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Initialize Getting Started Modal
    initializeGettingStarted() {
        const modal = document.getElementById('gettingStartedModal');
        const closeBtn = document.getElementById('closeGettingStarted');
        const skipBtn = document.getElementById('skipTourBtn');
        const startBtn = document.getElementById('startTourBtn');
        
        // Check if user has seen the modal before
        const hasSeenGettingStarted = localStorage.getItem('hasSeenGettingStarted');
        
        // Show modal on first visit
        if (!hasSeenGettingStarted) {
            setTimeout(() => {
                modal.classList.remove('hidden');
            }, 500); // Show after 0.5 seconds
        }
        
        // Close button
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeGettingStartedModal();
            });
        }
        
        // Skip button
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                this.closeGettingStartedModal();
            });
        }
        
        // Start tour button (placeholder for future tour functionality)
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.showSuccessAnimation('Interactive tour coming soon!');
                this.closeGettingStartedModal();
            });
        }
        
        // Close on overlay click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    this.closeGettingStartedModal();
                }
            });
        }
    }
    
    closeGettingStartedModal() {
        const modal = document.getElementById('gettingStartedModal');
        modal.classList.add('hidden');
        
        // Mark as seen
        localStorage.setItem('hasSeenGettingStarted', 'true');
    }
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new EcoDashboard();
    window.dashboard = dashboard; // Make it globally accessible
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .empty-state {
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary);
        }
        
        .empty-state .material-icons {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        
        .success-notification {
            animation: slideInRight 0.3s ease;
        }
        
        .tip-card:hover {
            transform: translateY(-5px);
        }
        
        .badge.earned {
            animation: badgePulse 2s infinite;
        }
        
        @keyframes badgePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
});

// Update quiz results link in quiz-script.js
function updateQuizResultsLink() {
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            // Save quiz results to localStorage
            const results = calculateResults();
            localStorage.setItem('ecoQuizResults', JSON.stringify(results));
            
            // Navigate to dashboard
            window.location.href = 'dashboard.html';
        });
    }
}