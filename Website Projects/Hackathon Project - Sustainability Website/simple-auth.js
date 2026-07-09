/* =============================================
   EcoQuest Simple Authentication System
   Local storage only - no database complexity
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    initializeSimpleAuth();
    console.log('✅ Simple Authentication ready!');
});

/* =============================================
   AUTHENTICATION SYSTEM
   ============================================= */
function initializeSimpleAuth() {
    const modal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const showForgotPassword = document.getElementById('showForgotPassword');
    const backToLogin = document.getElementById('backToLogin');
    
    // Modal controls
    if (closeModal) closeModal.addEventListener('click', hideAuthModal);
    if (modalOverlay) modalOverlay.addEventListener('click', hideAuthModal);
    
    // Form switching
    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            switchToSignup();
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchToLogin();
        });
    }
    
    if (showForgotPassword) {
        showForgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            switchToForgotPassword();
        });
    }
    
    if (backToLogin) {
        backToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            switchToLogin();
        });
    }

    // Home page button listeners
    setupHomePageButtons();

    // Form submissions
    setupFormSubmissions();

    // Check if user is already logged in
    checkExistingLogin();
    
    // Initial UI setup
    updateInitialUI();
}

// Add function to update initial UI state
function updateInitialUI() {
    const user = getCurrentUser();
    
    // Update dashboard icon state - disable if not logged in
    const dashboardIcon = document.getElementById('dashboardIcon');
    if (dashboardIcon) {
        if (user) {
            dashboardIcon.classList.remove('disabled', 'hidden');
        } else {
            dashboardIcon.classList.add('disabled');
            dashboardIcon.classList.remove('hidden');
        }
    }
    
    // Update header button based on login state
    const headerBtn = document.querySelector('.btn-header');
    if (headerBtn) {
        if (user) {
            headerBtn.innerHTML = `
                <span>${user.name}</span>
                <span class="material-icons">account_circle</span>
            `;
            headerBtn.onclick = (e) => {
                e.preventDefault();
                showUserProfileMenu(user);
            };
        } else {
            headerBtn.innerHTML = `
                <span>Get Started</span>
                <span class="material-icons">arrow_forward</span>
            `;
        }
    }
    
    // Update home page auth buttons if they exist
    const homeLoginBtn = document.getElementById('homeLoginBtn');
    const homeSignupBtn = document.getElementById('homeSignupBtn');
    
    if (homeLoginBtn && homeSignupBtn && user) {
        // User is logged in, replace auth buttons with dashboard button
        const authButtonsContainer = document.querySelector('.auth-buttons');
        if (authButtonsContainer) {
            authButtonsContainer.innerHTML = `
                <div class="welcome-user">
                    <span class="welcome-text">Welcome back, ${user.name}!</span>
                    <button class="btn-back-dashboard" onclick="goToDashboard()">
                        <span>Back to Dashboard</span>
                        <span class="material-icons">dashboard</span>
                    </button>
                </div>
            `;
        }
         } else if (homeLoginBtn && homeSignupBtn && !user) {
         // User is not logged in, show login/signup buttons
         const authButtonsContainer = document.querySelector('.auth-buttons');
         if (authButtonsContainer) {
             authButtonsContainer.innerHTML = `
                 <button class="btn-login" id="homeLoginBtn">
                     <span>Log In</span>
                     <span class="material-icons">login</span>
                 </button>
                 <button class="btn-signup" id="homeSignupBtn">
                     <span>Sign Up</span>
                     <span class="material-icons">person_add</span>
                 </button>
             `;
             
             // Re-attach event listeners for the new buttons
             const newHomeLoginBtn = document.getElementById('homeLoginBtn');
             const newHomeSignupBtn = document.getElementById('homeSignupBtn');
             
             if (newHomeLoginBtn) {
                 newHomeLoginBtn.addEventListener('click', (e) => {
                     e.preventDefault();
                     showAuthModal('login');
                 });
             }
             
             if (newHomeSignupBtn) {
                 newHomeSignupBtn.addEventListener('click', (e) => {
                     e.preventDefault();
                     showAuthModal('signup');
                 });
             }
         }
         
         // Show helper text when user is not logged in
         const helperText = document.querySelector('.auth-helper-text');
         if (helperText) {
             helperText.style.display = 'block';
         }
     }
     
     // Hide helper text when user is logged in
     if (user) {
         const helperText = document.querySelector('.auth-helper-text');
         if (helperText) {
             helperText.style.display = 'none';
         }
     }
}

/* =============================================
   SETUP FUNCTIONS
   ============================================= */
function setupHomePageButtons() {
    // Home page login button
    const homeLoginBtn = document.getElementById('homeLoginBtn');
    if (homeLoginBtn) {
        homeLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('login');
        });
    }
    
    // Home page signup button
    const homeSignupBtn = document.getElementById('homeSignupBtn');
    if (homeSignupBtn) {
        homeSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal('signup');
        });
    }
    
    // Header "Get Started" button - always show auth modal when not logged in
    const headerBtn = document.querySelector('.btn-header');
    if (headerBtn) {
        headerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (currentUser) {
                // If logged in, show profile menu
                showUserProfileMenu(currentUser);
            } else {
                // If not logged in, show signup modal
                showAuthModal('signup');
            }
        });
    }
}

function setupFormSubmissions() {
    // Login form
    const loginFormElement = document.getElementById('loginFormElement');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupFormElement = document.getElementById('signupFormElement');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', handleSignup);
    }
    
    // Forgot password form
    const forgotPasswordFormElement = document.getElementById('forgotPasswordFormElement');
    if (forgotPasswordFormElement) {
        forgotPasswordFormElement.addEventListener('submit', handleForgotPassword);
    }
}
/* =============================================
   FORM SWITCHING
   ============================================= */
function switchToSignup() {
    hideAllForms();
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('modalTitle').textContent = 'Join EcoQuest Today';
    clearMessages();
}

function switchToLogin() {
    hideAllForms();
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('modalTitle').textContent = 'Welcome Back';
    clearMessages();
}

function switchToForgotPassword() {
    hideAllForms();
    document.getElementById('forgotPasswordForm').classList.remove('hidden');
    document.getElementById('modalTitle').textContent = 'Reset Password';
    clearMessages();
}

function hideAllForms() {
    const forms = ['loginForm', 'signupForm', 'forgotPasswordForm', 'passwordResetForm'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) form.classList.add('hidden');
    });
}

/* =============================================
   AUTHENTICATION HANDLERS
   ============================================= */
async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    
    // Simple validation
    if (!name || !email || !password) {
        showMessage('❌ Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('❌ Please enter a valid email address.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('❌ Password must be at least 6 characters long.', 'error');
        return;
    }
    
    try {
        showLoading('Creating your account...');
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const existingUsers = getUsers();
        if (existingUsers.find(user => user.email === email)) {
            hideLoading();
            showMessage('❌ An account with this email already exists.', 'error');
            return;
        }
        
        // Create new user
        const user = {
            id: Date.now(),
            name,
            email,
            password, // In real app, this would be hashed
            created: new Date().toISOString()
        };
        
        // Save user
        existingUsers.push(user);
        localStorage.setItem('ecoquest_users', JSON.stringify(existingUsers));
        
        // Log user in
        loginUser(user);
        
        hideLoading();
        showMessage('🎉 Account created successfully! Welcome to EcoQuest!');
        
        setTimeout(() => {
            hideAuthModal();
            
            // Enable dashboard icon if we're on home page
            const dashboardIcon = document.getElementById('dashboardIcon');
            if (dashboardIcon) {
                dashboardIcon.classList.remove('hidden', 'disabled');
            }
            
            // Show quiz start modal immediately
            showQuizStartModal();
        }, 1500);
        
    } catch (error) {
        hideLoading();
        showMessage('❌ Something went wrong. Please try again.', 'error');
        console.error('Signup error:', error);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    // Simple validation
    if (!email || !password) {
        showMessage('❌ Please fill in all fields.', 'error');
        return;
    }
    
    try {
        showLoading('Signing you in...');
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find user
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            hideLoading();
            showMessage('❌ Invalid email or password.', 'error');
            return;
        }
        
        // Log user in
        loginUser(user);
        
        hideLoading();
        showMessage('🎉 Welcome back to EcoQuest!');
        
        setTimeout(() => {
            hideAuthModal();
            
            // Enable dashboard icon if we're on home page
            const dashboardIcon = document.getElementById('dashboardIcon');
            if (dashboardIcon) {
                dashboardIcon.classList.remove('hidden', 'disabled');
            }
            
            // Show quiz start modal immediately
            showQuizStartModal();
        }, 1500);
        
    } catch (error) {
        hideLoading();
        showMessage('❌ Something went wrong. Please try again.', 'error');
        console.error('Login error:', error);
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotPasswordEmail').value.trim();
    
    // Simple validation
    if (!email) {
        showMessage('❌ Please enter your email address.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('❌ Please enter a valid email address.', 'error');
        return;
    }
    
    try {
        showLoading('Sending reset instructions...');
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if user exists (optional validation)
        const users = getUsers();
        const userExists = users.find(u => u.email === email);
        
        hideLoading();
        
        if (userExists) {
            showMessage('✅ Password reset instructions sent to your email!');
            // In a real app, this would send an actual email
            setTimeout(() => {
                hideAuthModal();
                showNotification('📧 Check your email for reset instructions (placeholder functionality)');
            }, 2000);
        } else {
            showMessage('⚠️ If an account exists with this email, you\'ll receive reset instructions.');
            setTimeout(() => {
                hideAuthModal();
            }, 2000);
        }
        
    } catch (error) {
        hideLoading();
        showMessage('❌ Something went wrong. Please try again.', 'error');
        console.error('Forgot password error:', error);
    }
}

/* =============================================
   USER MANAGEMENT
   ============================================= */
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('ecoquest_users') || '[]');
    } catch {
        return [];
    }
}

function loginUser(user) {
    // Store user session
    localStorage.setItem('ecoquest_current_user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString()
    }));
    
    // Update UI
    updateUIForLoggedInUser(user);
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('ecoquest_current_user'));
    } catch {
        return null;
    }
}

function logoutUser() {
    localStorage.removeItem('ecoquest_current_user');
    updateUIForLoggedOutUser();
}

function checkExistingLogin() {
    const user = getCurrentUser();
    if (user) {
        // Don't auto-login on page load - require user to login again
        // updateUIForLoggedInUser(user);
    } else {
        // Make sure dashboard icon is disabled if user is not logged in
        const dashboardIcon = document.getElementById('dashboardIcon');
        if (dashboardIcon) {
            dashboardIcon.classList.add('disabled');
            dashboardIcon.classList.remove('hidden');
        }
    }
}

/* =============================================
   UI UPDATES
   ============================================= */
function updateUIForLoggedInUser(user) {
    // Update header button if exists
    const headerBtn = document.querySelector('.btn-header');
    if (headerBtn) {
        headerBtn.innerHTML = `
            <span>${user.name}</span>
            <span class="material-icons">account_circle</span>
        `;
        headerBtn.onclick = (e) => {
            e.preventDefault();
            // Show user menu with edit profile and logout options
            showUserProfileMenu(user);
        };
    }

    // Update home page auth buttons if they exist
    const homeLoginBtn = document.getElementById('homeLoginBtn');
    const homeSignupBtn = document.getElementById('homeSignupBtn');
    
    if (homeLoginBtn && homeSignupBtn) {
        // Replace the auth buttons with a welcome message and dashboard button
        const authButtonsContainer = document.querySelector('.auth-buttons');
        if (authButtonsContainer) {
            authButtonsContainer.innerHTML = `
                <div class="welcome-user">
                    <span class="welcome-text">Welcome back, ${user.name}!</span>
                    <button class="btn-back-dashboard" onclick="goToDashboard()">
                        <span>Back to Dashboard</span>
                        <span class="material-icons">dashboard</span>
                    </button>
                </div>
            `;
        }
    }
    
    // Enable dashboard icon in header
    const dashboardIcon = document.getElementById('dashboardIcon');
    if (dashboardIcon) {
        dashboardIcon.classList.remove('hidden', 'disabled');
    }
}

// Add function to show user profile menu
function showUserProfileMenu(user) {
    // Remove existing menu if any
    const existingMenu = document.getElementById('userProfileMenu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create profile menu
    const menu = document.createElement('div');
    menu.id = 'userProfileMenu';
    menu.innerHTML = `
        <div class="profile-menu-header">
            <span class="material-icons">account_circle</span>
            <div>
                <div class="profile-menu-name">${user.name}</div>
                <div class="profile-menu-email">${user.email}</div>
            </div>
        </div>
        <div class="profile-menu-divider"></div>
        <div class="profile-menu-item" onclick="showEditProfileModal()">
            <span class="material-icons">edit</span>
            <span>Edit Profile</span>
        </div>
        <div class="profile-menu-item" onclick="handleUserLogout()">
            <span class="material-icons">logout</span>
            <span>Logout</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('profileMenuStyles')) {
        const style = document.createElement('style');
        style.id = 'profileMenuStyles';
        style.textContent = `
            #userProfileMenu {
                position: fixed;
                top: 70px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                z-index: 2000;
                min-width: 250px;
                padding: 1rem;
                animation: dropdownSlideDown 0.3s ease-out;
            }
            
            .profile-menu-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.5rem 0;
            }
            
            .profile-menu-header .material-icons {
                font-size: 2.5rem;
                color: #53DB04;
            }
            
            .profile-menu-name {
                font-weight: 600;
                color: #333;
                font-size: 1rem;
            }
            
            .profile-menu-email {
                color: #666;
                font-size: 0.85rem;
            }
            
            .profile-menu-divider {
                height: 1px;
                background: #e0e0e0;
                margin: 0.75rem 0;
            }
            
            .profile-menu-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #333;
            }
            
            .profile-menu-item:hover {
                background: rgba(83, 219, 4, 0.1);
                color: #53DB04;
            }
            
            .profile-menu-item .material-icons {
                font-size: 1.2rem;
            }
            
            @keyframes dropdownSlideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeProfileMenu(e) {
            if (!menu.contains(e.target) && !headerBtn.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeProfileMenu);
            }
        });
    }, 0);
}

// Add edit profile modal function
window.showEditProfileModal = function() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('editProfileModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create edit profile modal
    const modal = document.createElement('div');
    modal.id = 'editProfileModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Edit Profile</h2>
                <button onclick="closeEditProfileModal()" style="background: none; border: none; cursor: pointer;">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="editProfileForm">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="editProfileName" value="${user.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="editProfileEmail" value="${user.email}" required>
                    </div>
                    <div class="form-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                        <button type="button" class="btn-cancel" onclick="closeEditProfileModal()">Cancel</button>
                        <button type="submit" class="btn-save">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('editProfileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newName = document.getElementById('editProfileName').value.trim();
        const newEmail = document.getElementById('editProfileEmail').value.trim();
        
        if (!newName || !newEmail) {
            showNotification('❌ Please fill in all fields.', 'error');
            return;
        }
        
        // Update user in localStorage
        const users = getUsers();
        const updatedUsers = users.map(u => {
            if (u.email === user.email) {
                return { ...u, name: newName, email: newEmail };
            }
            return u;
        });
        localStorage.setItem('ecoquest_users', JSON.stringify(updatedUsers));
        
        // Update current user session
        localStorage.setItem('ecoquest_current_user', JSON.stringify({
            ...user,
            name: newName,
            email: newEmail
        }));
        
        closeEditProfileModal();
        showNotification('✅ Profile updated successfully!');
        
        // Update UI
        updateUIForLoggedInUser({ ...user, name: newName, email: newEmail });
        
        // Reload to reflect changes
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });
};

window.closeEditProfileModal = function() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.remove();
    }
};

// Handle dashboard icon click - check if user is logged in
window.handleDashboardClick = function() {
    const user = getCurrentUser();
    const dashboardIcon = document.getElementById('dashboardIcon');
    
    if (!user || !dashboardIcon) {
        // User is not logged in - show notification
        showNotification('🔒 Please log in or sign up to access your dashboard', 'info');
        return;
    }
    
    // Check if button is disabled
    if (dashboardIcon.classList.contains('disabled')) {
        showNotification('🔒 Please log in or sign up to access your dashboard', 'info');
        return;
    }
    
    // User is logged in and button is enabled - go to dashboard
    window.location.href = 'dashboard.html';
};

// Make goToDashboard global
window.goToDashboard = function() {
    window.location.href = 'dashboard.html';
};

function updateUIForLoggedOutUser() {
    // Reset header button
    const headerBtn = document.querySelector('.btn-header');
    if (headerBtn) {
        headerBtn.innerHTML = `
            <span>Get Started</span>
            <span class="material-icons">arrow_forward</span>
        `;
    }
    
    // Disable dashboard icon
    const dashboardIcon = document.getElementById('dashboardIcon');
    if (dashboardIcon) {
        dashboardIcon.classList.add('disabled');
        dashboardIcon.classList.remove('hidden');
    }
    
    // Reset home page auth buttons - show login/signup buttons
    const authButtonsContainer = document.querySelector('.auth-buttons');
    if (authButtonsContainer) {
        authButtonsContainer.innerHTML = `
            <button class="btn-login" id="homeLoginBtn">
                <span>Log In</span>
                <span class="material-icons">login</span>
            </button>
            <button class="btn-signup" id="homeSignupBtn">
                <span>Sign Up</span>
                <span class="material-icons">person_add</span>
            </button>
        `;
        
        // Re-attach event listeners
        const homeLoginBtn = document.getElementById('homeLoginBtn');
        const homeSignupBtn = document.getElementById('homeSignupBtn');
        
        if (homeLoginBtn) {
            homeLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showAuthModal('login');
            });
        }
        
        if (homeSignupBtn) {
            homeSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showAuthModal('signup');
            });
        }
    }
    
    // Show helper text
    const helperText = document.querySelector('.auth-helper-text');
    if (helperText) {
        helperText.style.display = 'block';
    }

    // Reset quiz button
    const quizBtn = document.querySelector('.btn-start-quiz');
    if (quizBtn) {
        quizBtn.innerHTML = `
            <span>Start Your Journey</span>
            <span class="material-icons">eco</span>
        `;
        quizBtn.onclick = (e) => {
            e.preventDefault();
            showAuthModal();
        };
    }
}

/* =============================================
   MODAL CONTROLS
   ============================================= */
function showAuthModal(formType = 'signup') {
    const modal = document.getElementById('authModal');
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.classList.add('show');
        overlay.classList.add('show');
        
        // Show the requested form
        switch(formType) {
            case 'login':
                switchToLogin();
                break;
            case 'signup':
                switchToSignup();
                break;
            case 'forgot':
                switchToForgotPassword();
                break;
            default:
                switchToSignup();
        }
    }
}

function hideAuthModal() {
    const modal = document.getElementById('authModal');
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.classList.remove('show');
        overlay.classList.remove('show');
        clearMessages();
        clearForms();
    }
}

/* =============================================
   UTILITY FUNCTIONS
   ============================================= */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('authMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';
    } else {
        // Create a temporary notification if no message div exists
        showNotification(message, type);
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Determine background color based on type
    let bgColor = '#53DB04'; // default success
    if (type === 'error') bgColor = '#ff6b6b';
    else if (type === 'info') bgColor = '#0066CC';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 10001;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function clearMessages() {
    const messageDiv = document.getElementById('authMessage');
    if (messageDiv) {
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
    }
}

function clearForms() {
    // Clear signup form
    const signupInputs = ['signupName', 'signupEmail', 'signupPassword'];
    signupInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
    
    // Clear login form
    const loginInputs = ['loginEmail', 'loginPassword'];
    loginInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
}

function showLoading(message) {
    // Create loading overlay
    const loading = document.createElement('div');
    loading.id = 'simpleLoading';
    loading.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        ">
            <div style="
                background: white;
                padding: 2rem 3rem;
                border-radius: 15px;
                display: flex;
                align-items: center;
                gap: 1rem;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
                <span class="material-icons" style="
                    color: #53DB04;
                    font-size: 2rem;
                    animation: spin 1s linear infinite;
                ">eco</span>
                <span style="
                    font-size: 1.2rem;
                    font-weight: 500;
                    color: #333;
                ">${message}</span>
            </div>
        </div>
    `;
    
    // Add spin animation
    if (!document.querySelector('#spinAnimation')) {
        const style = document.createElement('style');
        style.id = 'spinAnimation';
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('simpleLoading');
    if (loading) {
        loading.remove();
    }
}

/* =============================================
   QUIZ START MODAL
   ============================================= */
function showQuizStartModal() {
    // Create quiz start modal
    const quizModal = document.createElement('div');
    quizModal.id = 'quizStartModal';
    quizModal.innerHTML = `
        <div class="quiz-modal-overlay"></div>
        <div class="quiz-modal-content">
            <div class="quiz-modal-header">
                <span class="material-icons quiz-icon">eco</span>
                <h2>Start Your Sustainability Journey!</h2>
            </div>
            <div class="quiz-modal-body">
                <p class="quiz-description">
                    Take our comprehensive lifestyle assessment to discover your environmental impact 
                    and receive personalized tips for a more sustainable future.
                </p>
                <div class="quiz-features">
                    <div class="quiz-feature">
                        <span class="material-icons">quiz</span>
                        <span>16 Quick Questions</span>
                    </div>
                    <div class="quiz-feature">
                        <span class="material-icons">timer</span>
                        <span>5 Minutes</span>
                    </div>
                    <div class="quiz-feature">
                        <span class="material-icons">insights</span>
                        <span>Instant Results</span>
                    </div>
                </div>
            </div>
            <div class="quiz-modal-actions">
                <button class="quiz-start-btn" onclick="startQuizNow()">
                    <span>Start Quiz</span>
                    <span class="material-icons">arrow_forward</span>
                </button>
                <button class="quiz-later-btn" onclick="closeQuizModal()">
                    <span>Maybe Later</span>
                </button>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #quizStartModal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .quiz-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
        }
        
        .quiz-modal-content {
            background: white;
            border-radius: 20px;
            padding: 2.5rem;
            max-width: 500px;
            width: 90%;
            position: relative;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            animation: modalSlideIn 0.4s ease-out;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .quiz-modal-header {
            margin-bottom: 1.5rem;
        }
        
        .quiz-icon {
            font-size: 3rem;
            color: #53DB04;
            margin-bottom: 1rem;
        }
        
        .quiz-modal-header h2 {
            color: #333;
            margin: 0;
            font-size: 1.8rem;
            font-weight: 600;
        }
        
        .quiz-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }
        
        .quiz-features {
            display: flex;
            justify-content: space-around;
            margin-bottom: 2.5rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .quiz-feature {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            color: #53DB04;
            font-weight: 500;
        }
        
        .quiz-feature .material-icons {
            font-size: 2rem;
        }
        
        .quiz-modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .quiz-start-btn {
            background: linear-gradient(135deg, #53DB04, #23FA8B);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(83, 219, 4, 0.4);
        }
        
        .quiz-start-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(83, 219, 4, 0.6);
        }
        
        .quiz-later-btn {
            background: transparent;
            color: #666;
            border: 2px solid #ddd;
            padding: 1rem 2rem;
            border-radius: 30px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .quiz-later-btn:hover {
            background: #f5f5f5;
            border-color: #53DB04;
            color: #53DB04;
        }
        
        @media (max-width: 768px) {
            .quiz-modal-content {
                padding: 2rem;
                margin: 1rem;
            }
            
            .quiz-features {
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .quiz-modal-actions {
                flex-direction: column;
                align-items: center;
            }
            
            .quiz-start-btn,
            .quiz-later-btn {
                width: 100%;
                justify-content: center;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(quizModal);
}

function closeQuizModal() {
    const modal = document.getElementById('quizStartModal');
    if (modal) {
        modal.style.animation = 'modalSlideOut 0.3s ease-in forwards';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function startQuizNow() {
    closeQuizModal();
    // Redirect to quiz page
    window.location.href = 'quiz.html';
}

// Add the slide out animation
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-50px) scale(0.95);
        }
    }
`;
document.head.appendChild(slideOutStyle);
window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;
window.showAuthModal = showAuthModal;
window.showMessage = showMessage;
window.showNotification = showNotification;

// Global logout handler for the home page
window.handleUserLogout = function() {
    if (confirm('Are you sure you want to logout?')) {
        logoutUser();
        showNotification('👋 You have been logged out successfully!');
        // Reload the page to reset the UI
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
};

console.log('🎯 Simple Authentication System loaded!');