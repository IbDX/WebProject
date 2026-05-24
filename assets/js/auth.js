/**
 * Authentication Handlers
 */

// Initialize auth page
function initAuthPage() {
    if (isLoggedIn()) {
        switchView('dashboard');
        loadDashboard();
    } else {
        switchView('login');
    }
    
    setupLoginForm();
    setupRegisterForm();
}

// Setup login form
function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        const validator = new FormValidator('login-form');
        if (!validator.validate({
            'email': ['required', 'email'],
            'password': ['required']
        })) {
            validator.displayErrors();
            return;
        }
        
        clearFormErrors('login-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        showLoader(submitBtn);
        
        try {
            const response = await API.login(email, password);
            
            if (response.success) {
                // Store auth data
                setAuthToken(response.data.token);
                setUserData(response.data.user || response.data);
                
                showToast('Login successful!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    switchView('dashboard');
                    loadDashboard();
                }, 500);
            } else {
                showToast(response.message || 'Login failed', 'error');
            }
        } catch (error) {
            showToast('Login error: ' + error.message, 'error');
        } finally {
            hideLoader(submitBtn);
        }
    });
}

// Setup register form
function setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;
    
    // Setup password strength meter
    setupPasswordStrengthMeter('reg-password', 'password-strength');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const validator = new FormValidator('register-form');
        if (!validator.validate({
            'first_name': ['required'],
            'last_name': ['required'],
            'email': ['required', 'email'],
            'date_of_birth': ['required'],
            'password': ['required', 'min:12'],
            'password_confirm': ['required', 'match:password']
        })) {
            validator.displayErrors();
            return;
        }
        
        clearFormErrors('register-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        showLoader(submitBtn);
        
        try {
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData);
            
            const response = await API.register(userData);
            
            if (response.success) {
                showToast('Registration successful! Redirecting to login...', 'success');
                form.reset();
                
                setTimeout(() => {
                    switchView('login');
                    document.getElementById('login-email').focus();
                }, 1500);
            } else {
                if (response.errors) {
                    displayFormErrors(response.errors, 'register-form');
                } else {
                    showToast(response.message || 'Registration failed', 'error');
                }
            }
        } catch (error) {
            showToast('Registration error: ' + error.message, 'error');
        } finally {
            hideLoader(submitBtn);
        }
    });
}

// Logout
async function logout() {
    if (!confirm('Are you sure you want to log out?')) {
        return;
    }
    
    try {
        await API.logout();
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    // Clear storage
    clearAuthToken();
    clearUserData();
    
    // Redirect to login
    showToast('Logged out successfully', 'success');
    switchView('login');
}

// Confirm deactivation
function confirmDeactivate() {
    if (!confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
        return;
    }
    
    const password = prompt('Enter your password to confirm account deactivation:');
    if (!password) return;
    
    deactivateAccount(password);
}

// Deactivate account
async function deactivateAccount(password) {
    try {
        const response = await API.deactivateAccount(password);
        
        if (response.success) {
            showToast('Account deactivated successfully', 'success');
            
            clearAuthToken();
            clearUserData();
            
            setTimeout(() => {
                switchView('login');
            }, 1000);
        } else {
            showToast(response.message || 'Deactivation failed', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', initAuthPage);
