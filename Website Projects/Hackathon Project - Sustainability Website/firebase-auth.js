/* ===========================================
   EcoQuest Firebase Authentication & Data Management
   Handles user login, signup, and data storage
   =========================================== */

// Firebase imports will be available globally from HTML
let auth, db;

// Wait for Firebase to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase references
    setTimeout(() => {
        if (window.firebaseAuth && window.firebaseDB) {
            auth = window.firebaseAuth;
            db = window.firebaseDB;
            initializeAuth();
            console.log('🔥 Firebase Auth & DB ready!');
        } else {
            console.error('❌ Firebase not loaded. Please check your configuration.');
        }
    }, 1000);
});

/* ===========================================
   AUTHENTICATION SYSTEM
   =========================================== */
function initializeAuth() {
    const modal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const userDashboard = document.getElementById('userDashboard');
    
    // Modal controls
    closeModal.addEventListener('click', hideAuthModal);
    modalOverlay.addEventListener('click', hideAuthModal);
    
    // Form switching
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        switchToSignup();
    });
    
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchToLogin();
    });
    
    // Form submissions
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('signupFormElement').addEventListener('submit', handleSignup);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Check authentication state
    window.firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
            showUserDashboard(user);
            hideAuthModal();
        } else {
            hideUserDashboard();
        }
    });
    
    // Update buttons to show auth modal
    updateButtonsForAuth();
}

function showAuthModal() {
    document.getElementById('authModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideAuthModal() {
    document.getElementById('authModal').classList.remove('show');
    document.body.style.overflow = '';
}

function switchToSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('userDashboard').classList.add('hidden');
    document.getElementById('modalTitle').textContent = 'Join EcoQuest Today';
}

function switchToLogin() {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('userDashboard').classList.add('hidden');
    document.getElementById('modalTitle').textContent = 'Welcome Back';
}

/* ===========================================
   AUTHENTICATION HANDLERS
   =========================================== */
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showLoading('Signing in...');
        const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        showMessage('🎉 Welcome back! Successfully signed in.');
        hideLoading();
        
        // Load user data
        await loadUserData(user.uid);
        
    } catch (error) {
        hideLoading();
        showMessage(`❌ ${getErrorMessage(error.code)}`, 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    if (password.length < 6) {
        showMessage('❌ Password must be at least 6 characters long.', 'error');
        return;
    }
    
    try {
        showLoading('Creating account...');
        const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user profile in Firestore
        await createUserProfile(user.uid, name, email);
        
        showMessage('🎉 Account created successfully! Welcome to EcoQuest.');
        hideLoading();
        
    } catch (error) {
        hideLoading();
        showMessage(`❌ ${getErrorMessage(error.code)}`, 'error');
    }
}

async function handleLogout() {
    try {
        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
        await signOut(auth);
        showMessage('👋 Successfully logged out. See you soon!');
        hideAuthModal();
    } catch (error) {
        showMessage('❌ Error logging out. Please try again.', 'error');
    }
}

/* ===========================================
   USER DATA MANAGEMENT
   =========================================== */
async function createUserProfile(uid, name, email) {
    try {
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
        
        const userProfile = {
            name: name,
            email: email,
            createdAt: new Date(),
            carbonSaved: 0,
            waterSaved: 0,
            goals: [],
            quizCompleted: false,
            streak: 0,
            badges: []
        };
        
        await setDoc(doc(db, 'users', uid), userProfile);
        console.log('✅ User profile created successfully');
        
    } catch (error) {
        console.error('❌ Error creating user profile:', error);
    }
}

async function loadUserData(uid) {
    try {
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
        
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            updateDashboardUI(userData);
        }
    } catch (error) {
        console.error('❌ Error loading user data:', error);
    }
}

async function updateUserData(uid, data) {
    try {
        const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
        
        await updateDoc(doc(db, 'users', uid), data);
        console.log('✅ User data updated successfully');
        
    } catch (error) {
        console.error('❌ Error updating user data:', error);
    }
}

/* ===========================================
   UI UPDATES
   =========================================== */
function showUserDashboard(user) {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('userDashboard').classList.remove('hidden');
    document.getElementById('modalTitle').textContent = 'Your EcoQuest Dashboard';
    
    // Update user info
    document.getElementById('userName').textContent = `Welcome back!`;
    document.getElementById('userEmail').textContent = user.email;
}

function hideUserDashboard() {
    document.getElementById('userDashboard').classList.add('hidden');
}

function updateDashboardUI(userData) {
    document.getElementById('userName').textContent = `Welcome, ${userData.name}!`;
    document.getElementById('carbonSaved').textContent = `${userData.carbonSaved} kg CO₂`;
    document.getElementById('waterSaved').textContent = `${userData.waterSaved} liters`;
}

function updateButtonsForAuth() {
    // Update existing buttons to show auth modal
    const startQuizBtn = document.querySelector('.btn-start-quiz');
    const headerBtn = document.querySelector('.btn-header');
    
    if (startQuizBtn) {
        startQuizBtn.onclick = (e) => {
            e.preventDefault();
            showAuthModal();
        };
    }
    
    if (headerBtn) {
        headerBtn.onclick = (e) => {
            e.preventDefault();
            showAuthModal();
        };
    }
}

/* ===========================================
   UTILITY FUNCTIONS
   =========================================== */
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email address.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.'
    };
    
    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
}

function showLoading(message) {
    // Create loading indicator
    const loading = document.createElement('div');
    loading.id = 'loadingIndicator';
    loading.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(83, 219, 4, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 3000;
            font-weight: 500;
        ">
            ${message}
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) {
        loading.remove();
    }
}

// Enhanced message function with error support
function showMessage(messageText, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = messageText;
    
    const bgColor = type === 'error' ? 
        'linear-gradient(135deg, #FF6B6B, #FF8E8E)' : 
        'linear-gradient(135deg, #53DB04, #23FA8B)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 25px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 500;
        max-width: 350px;
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

console.log('🔥 Firebase Auth system loaded!');