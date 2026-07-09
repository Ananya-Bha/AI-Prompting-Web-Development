/* ===========================================
   EcoQuest Home - Interactive JavaScript
   Handles smooth scrolling, charts, and animations
   =========================================== */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌱 EcoQuest Home page loaded successfully!');
    
    // Initialize all features
    initializeMobileMenu();
    initializeNavigation();
    initializeCharts();
    initializeScrollAnimations();
    initializeButtonEffects();
    initializeFeatureCards();
});

/* ===========================================
   MOBILE MENU
   =========================================== */
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-active');
            
            // Change icon based on menu state
            const icon = mobileMenuBtn.querySelector('.material-icons');
            if (navMenu.classList.contains('mobile-active')) {
                icon.textContent = 'close';
            } else {
                icon.textContent = 'menu';
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('mobile-active');
                const icon = mobileMenuBtn.querySelector('.material-icons');
                icon.textContent = 'menu';
            });
        });
    }
}

/* ===========================================
   NAVIGATION AND SMOOTH SCROLLING
   =========================================== */
function initializeNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add smooth scrolling to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation state
                updateActiveNavLink(this);
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateNavOnScroll);
}

function updateActiveNavLink(activeLink) {
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current link
    activeLink.classList.add('active');
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100; // Offset for better detection
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (correspondingNavLink) {
                updateActiveNavLink(correspondingNavLink);
            }
        }
    });
}

/* ===========================================
   INTERACTIVE CHARTS
   =========================================== */
function initializeCharts() {
    createWaterUsageChart();
    createCO2EmissionsChart();
}

function createWaterUsageChart() {
    const ctx = document.getElementById('waterUsageChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Toilet', 'Clothes Washer', 'Shower', 'Faucet', 'Leaks', 'Other'],
            datasets: [{
                data: [26.7, 21.7, 16.8, 15.7, 13.7, 5.3],
                backgroundColor: [
                    '#FF6B35', // Toilet - Orange
                    '#4ECDC4', // Clothes Washer - Teal
                    '#FF8E94', // Shower - Pink
                    '#FFE66D', // Faucet - Yellow
                    '#95E1D3', // Leaks - Light Green
                    '#A8E6CF'  // Other - Pale Green
                ],
                borderWidth: 3,
                borderColor: '#FFFFFF',
                hoverBorderWidth: 4,
                hoverBorderColor: '#53DB04'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: 'Roboto'
                        },
                        color: '#333333'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(8, 133, 1, 0.9)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: '#53DB04',
                    borderWidth: 2,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function createCO2EmissionsChart() {
    const ctx = document.getElementById('co2EmissionsChart').getContext('2d');
    
    // Sample data points for the CO2 emissions chart (simplified version)
    const years = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2023];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'United States',
                    data: [19.5, 19.8, 20.2, 19.8, 17.6, 16.5, 15.8, 14.9],
                    borderColor: '#8A2BE2',
                    backgroundColor: 'rgba(138, 43, 226, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Canada',
                    data: [15.5, 16.2, 17.1, 17.8, 16.8, 15.9, 15.2, 14.2],
                    borderColor: '#FF8C00',
                    backgroundColor: 'rgba(255, 140, 0, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'China',
                    data: [2.3, 3.1, 3.8, 5.1, 7.2, 7.8, 7.9, 8.1],
                    borderColor: '#4169E1',
                    backgroundColor: 'rgba(65, 105, 225, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'World Average',
                    data: [4.2, 4.1, 4.2, 4.6, 4.9, 4.8, 4.3, 4.7],
                    borderColor: '#53DB04',
                    backgroundColor: 'rgba(83, 219, 4, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 11,
                            family: 'Roboto'
                        },
                        color: '#333333',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(8, 133, 1, 0.9)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: '#53DB04',
                    borderWidth: 2,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' tonnes CO₂';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        color: '#333333',
                        font: {
                            family: 'Roboto',
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'CO₂ Emissions (tonnes per capita)',
                        color: '#333333',
                        font: {
                            family: 'Roboto',
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    beginAtZero: true
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

/* ===========================================
   SCROLL ANIMATIONS
   =========================================== */
function initializeScrollAnimations() {
    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.content-card, .chart-container, .catcher-section, .feature-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

/* ===========================================
   BUTTON EFFECTS AND INTERACTIONS
   =========================================== */
function initializeButtonEffects() {
    // Get all buttons
    const buttons = document.querySelectorAll('.btn-header, .btn-start-quiz');
    
    buttons.forEach(button => {
        // Hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Click effects
        button.addEventListener('click', function(e) {
            // Prevent default for now (placeholder)
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'translateY(0) scale(0.98)';
            
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            }, 150);
            
            // Check if user is logged in
            const currentUser = localStorage.getItem('ecoquest_current_user');
            
            if (this.classList.contains('btn-start-quiz')) {
                if (currentUser) {
                    // Redirect to quiz if logged in
                    window.location.href = 'quiz.html';
                } else {
                    // Show auth modal if not logged in
                    if (typeof showAuthModal === 'function') {
                        showAuthModal('signup');
                    } else {
                        showMessage('🔐 Please log in to take the quiz.');
                    }
                }
            } else if (this.classList.contains('btn-header')) {
                if (currentUser) {
                    // Show user menu if logged in
                    if (typeof showUserMenu === 'function') {
                        showUserMenu();
                    }
                } else {
                    // Show auth modal if not logged in
                    if (typeof showAuthModal === 'function') {
                        showAuthModal('signup');
                    } else {
                        showMessage('🚀 Get started with your eco-friendly journey!');
                    }
                }
            }
        });
    });
}

/* ===========================================
   FEATURE CARDS INTERACTIONS
   =========================================== */
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        // Add click interactions
        card.addEventListener('click', function() {
            const featureTitle = this.querySelector('.feature-title').textContent;
            const currentUser = localStorage.getItem('ecoquest_current_user');
            
            // Handle different feature cards
            if (featureTitle.includes('Quiz')) {
                if (currentUser) {
                    showMessage('🎯 Taking you to the lifestyle quiz...');
                    setTimeout(() => {
                        window.location.href = 'quiz.html';
                    }, 1000);
                } else {
                    showMessage('� Please log in to take the quiz.');
                    setTimeout(() => {
                        if (typeof showAuthModal === 'function') {
                            showAuthModal('signup');
                        }
                    }, 1500);
                }
            } else if (featureTitle.includes('Dashboard')) {
                if (currentUser) {
                    showMessage('📊 Opening your sustainability dashboard...');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showMessage('🔐 Please log in to access your dashboard.');
                    setTimeout(() => {
                        if (typeof showAuthModal === 'function') {
                            showAuthModal('signup');
                        }
                    }, 1500);
                }
            } else if (featureTitle.includes('Goal')) {
                if (currentUser) {
                    showMessage('🎯 Goal setting available in your dashboard!');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showMessage('🔐 Please log in to set sustainability goals.');
                    setTimeout(() => {
                        if (typeof showAuthModal === 'function') {
                            showAuthModal('signup');
                        }
                    }, 1500);
                }
            } else {
                if (currentUser) {
                    showMessage(`🚀 ${featureTitle} available in your dashboard!`);
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showMessage('🔐 Please log in to access EcoQuest features.');
                    setTimeout(() => {
                        if (typeof showAuthModal === 'function') {
                            showAuthModal('signup');
                        }
                    }, 1500);
                }
            }
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon .material-icons');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotateY(360deg)';
                icon.style.transition = 'transform 0.6s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon .material-icons');
            if (icon) {
                icon.style.transform = 'scale(1) rotateY(0deg)';
            }
        });
    });
}

/* ===========================================
   UTILITY FUNCTIONS
   =========================================== */
function showMessage(messageText) {
    // Create notification
    const notification = document.createElement('div');
    notification.textContent = messageText;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #53DB04, #23FA8B);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 25px;
        box-shadow: 0 4px 20px rgba(83, 219, 4, 0.4);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        animation: slideInRight 0.5s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notifications]')) {
        style.setAttribute('data-notifications', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

/* ===========================================
   HEADER SCROLL EFFECTS
   =========================================== */
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        header.style.background = 'rgba(8, 133, 1, 0.98)';
        header.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(8, 133, 1, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }
});

console.log('✨ All EcoQuest home page features are ready!');