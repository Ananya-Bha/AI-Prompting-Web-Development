// Calculator Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize help modals
    initHelpModals();
    
    // Handle form submission
    const form = document.getElementById('calculator-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

// Initialize help modals (hover shows text, click opens modal)
function initHelpModals() {
    const helpButtons = document.querySelectorAll('.help-button');
    
    helpButtons.forEach(button => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        
        if (!modal) return;
        
        // Show "Don't know how?" text on hover
        button.addEventListener('mouseenter', function() {
            const hoverText = button.querySelector('.help-hover-text');
            if (hoverText) {
                hoverText.style.opacity = '1';
                hoverText.style.visibility = 'visible';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            const hoverText = button.querySelector('.help-hover-text');
            if (hoverText) {
                hoverText.style.opacity = '0';
                hoverText.style.visibility = 'hidden';
            }
        });
        
        // Open modal on click
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal(modal);
        });
    });
    
    // Close modals when clicking close button
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.help-modal');
            closeModal(modal);
        });
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.help-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.help-modal.active').forEach(modal => {
                closeModal(modal);
            });
        }
    });
    
    // Handle app buttons that open nested modals
    const appButtons = document.querySelectorAll('.app-button');
    appButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const appModalId = this.getAttribute('data-app-modal');
            const appModal = document.getElementById(appModalId);
            if (appModal) {
                // Close current modal first
                const currentModal = this.closest('.help-modal');
                if (currentModal) {
                    closeModal(currentModal);
                }
                // Open the nested app modal
                setTimeout(() => {
                    openModal(appModal);
                }, 150); // Small delay for smooth transition
            }
        });
    });
}

// Open modal
function openModal(modal) {
    if (!modal) return;
    
    // Close all other modals
    document.querySelectorAll('.help-modal').forEach(m => {
        m.classList.remove('active');
    });
    
    // Open this modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close modal
function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        emails: parseFloat(document.getElementById('emails').value) || 0,
        streaming: parseFloat(document.getElementById('streaming').value) || 0,
        gaming: parseFloat(document.getElementById('gaming').value) || 0,
        cloud: parseFloat(document.getElementById('cloud').value) || 0,
        transfer: parseFloat(document.getElementById('transfer').value) || 0
    };
    
    // Calculate CO₂ emissions
    const calculations = calculateEmissions(formData);
    
    // Store results in sessionStorage to pass to results page
    sessionStorage.setItem('calculatorResults', JSON.stringify(calculations));
    sessionStorage.setItem('formData', JSON.stringify(formData));
    
    // Redirect to results page
    window.location.href = 'results.html';
}

// Calculate CO₂ emissions
function calculateEmissions(data) {
    // Emission factors
    const EMAIL_FACTOR = 4;      // g CO₂ per email
    const STREAMING_FACTOR = 55; // g CO₂ per hour
    const GAMING_FACTOR = 35;    // g CO₂ per hour
    const CLOUD_FACTOR = 2;      // g CO₂ per GB per month
    const TRANSFER_FACTOR = 5;   // g CO₂ per GB
    
    // Calculate individual emissions
    const emailCO2 = data.emails * EMAIL_FACTOR;
    const streamingCO2 = data.streaming * STREAMING_FACTOR;
    const gamingCO2 = data.gaming * GAMING_FACTOR;
    const cloudCO2 = data.cloud * CLOUD_FACTOR;
    const transferCO2 = data.transfer * TRANSFER_FACTOR;
    
    // Total in grams
    const totalGrams = emailCO2 + streamingCO2 + gamingCO2 + cloudCO2 + transferCO2;
    
    // Total in kilograms
    const totalKg = totalGrams / 1000;
    
    return {
        email: {
            value: emailCO2,
            input: data.emails,
            factor: EMAIL_FACTOR
        },
        streaming: {
            value: streamingCO2,
            input: data.streaming,
            factor: STREAMING_FACTOR
        },
        gaming: {
            value: gamingCO2,
            input: data.gaming,
            factor: GAMING_FACTOR
        },
        cloud: {
            value: cloudCO2,
            input: data.cloud,
            factor: CLOUD_FACTOR
        },
        transfer: {
            value: transferCO2,
            input: data.transfer,
            factor: TRANSFER_FACTOR
        },
        totalGrams: totalGrams,
        totalKg: totalKg
    };
}

