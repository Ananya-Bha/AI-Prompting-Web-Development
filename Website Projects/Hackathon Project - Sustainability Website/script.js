/* ===========================================
   EcoQuest - Interactive JavaScript
   Handles animations, hover effects, and user interactions
   =========================================== */

// Wait for the DOM to be fully loaded before running any JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌱 EcoQuest website loaded successfully!');
    
    // Initialize all interactive features
    initializeButtonEffects();
    initializeScrollAnimations();
    initializeHeaderEffects();
    initializeImageCardEffects();
    initializeTeamInfoButton();
});

/* ===========================================
   BUTTON EFFECTS AND ANIMATIONS
   =========================================== */
function initializeButtonEffects() {
    // Get all buttons that need special effects
    const allButtons = document.querySelectorAll('.btn-learn-more, .btn-primary');
    
    allButtons.forEach(button => {
        // Add hover effect with smooth transitions
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 10px 30px rgba(83, 219, 4, 0.5)';
            
            // Add a subtle glow effect
            this.style.filter = 'brightness(1.1)';
        });
        
        // Remove hover effect when mouse leaves
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 6px 20px rgba(83, 219, 4, 0.4)';
            this.style.filter = 'brightness(1)';
        });
        
        // Add wave effect when clicked
        button.addEventListener('click', function(e) {
            // Prevent default action for now (placeholder)
            e.preventDefault();
            
            // Add wave animation class
            this.classList.add('wave-effect');
            
            // Create ripple effect
            createRippleEffect(e, this);
            
            // Remove wave effect after animation
            setTimeout(() => {
                this.classList.remove('wave-effect');
            }, 300);
            
            // Show a fun message (placeholder for future functionality)
            showClickMessage();
        });
    });
}

/* ===========================================
   RIPPLE EFFECT FOR BUTTONS
   =========================================== */
function createRippleEffect(event, button) {
    // Create a ripple element
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    // Style the ripple
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    // Add ripple to button
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
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
    
    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.hero-title, .hero-description, .btn-hero-learn-more, .image-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

/* ===========================================
   HEADER SCROLL EFFECTS
   =========================================== */
function initializeHeaderEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class for styling
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

/* ===========================================
   HERO ICON INTERACTIONS
   =========================================== */
function initializeImageCardEffects() {
    const heroIcon = document.querySelector('.hero-icon');
    
    if (heroIcon) {
        // Add hover effect for the hero icon
        heroIcon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.boxShadow = '0 8px 25px rgba(83, 219, 4, 0.5)';
        });
        
        heroIcon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '0 4px 15px rgba(83, 219, 4, 0.3)';
        });
        
        // Add click effect
        heroIcon.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

/* ===========================================
   UTILITY FUNCTIONS
   =========================================== */
function showClickMessage(customMessage) {
    // Create a temporary message element
    const message = document.createElement('div');
    message.textContent = customMessage || '🌱 Great choice! More features coming soon!';
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.background = 'linear-gradient(135deg, #53DB04, #23FA8B)';
    message.style.color = 'white';
    message.style.padding = '1rem 1.5rem';
    message.style.borderRadius = '25px';
    message.style.boxShadow = '0 4px 15px rgba(83, 219, 4, 0.3)';
    message.style.zIndex = '10000';
    message.style.fontWeight = '500';
    message.style.animation = 'slideInRight 0.5s ease';
    
    // Add to page
    document.body.appendChild(message);
    
    // Remove after 3 seconds
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 500);
    }, 3000);
}

/* ===========================================
   CSS ANIMATIONS (Added via JavaScript)
   =========================================== */
function addCustomAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
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
        
        .header.scrolled {
            background: rgba(8, 133, 1, 0.98);
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
        }
    `;
    document.head.appendChild(style);
}

// Initialize custom animations
addCustomAnimations();

/* ===========================================
   PERFORMANCE OPTIMIZATIONS
   =========================================== */
// Throttle scroll events for better performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Any scroll-based animations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

/* ===========================================
   ACCESSIBILITY ENHANCEMENTS
   =========================================== */
// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Allow Enter key to activate buttons
    if (e.key === 'Enter' && e.target.classList.contains('btn-learn-more')) {
        e.target.click();
    }
});

// Add focus indicators for better accessibility
const focusableElements = document.querySelectorAll('button, a, input, textarea');
focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #CFFFEB';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

console.log('✨ All EcoQuest animations and interactions are ready!');

/* ===========================================
   TEAM INFO BUTTON AND POPUP - HOVER FUNCTIONALITY
   =========================================== */
function initializeTeamInfoButton() {
    const teamBtn = document.getElementById('teamInfoBtn');
    const teamPopup = document.getElementById('teamPopup');
    
    if (teamBtn && teamPopup) {
        // Show popup on button hover
        teamBtn.addEventListener('mouseenter', function() {
            teamPopup.classList.add('show');
        });
        
        // Hide popup when leaving button area
        teamBtn.addEventListener('mouseleave', function() {
            // Add a small delay to allow moving to popup
            setTimeout(() => {
                if (!teamPopup.matches(':hover') && !teamBtn.matches(':hover')) {
                    teamPopup.classList.remove('show');
                }
            }, 100);
        });
        
        // Keep popup open when hovering over it
        teamPopup.addEventListener('mouseenter', function() {
            teamPopup.classList.add('show');
        });
        
        // Hide popup when leaving popup area
        teamPopup.addEventListener('mouseleave', function() {
            teamPopup.classList.remove('show');
        });
    }
}
