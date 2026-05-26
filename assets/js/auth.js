/**
 * Authentication Handlers
 */

// Track submission state to prevent race conditions
let _isSubmitting = false;

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

        // Prevent double-submit
        if (_isSubmitting) return;
        
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
        _isSubmitting = true;
        disableSubmitButton(submitBtn);
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
                showFormError('login-error', response.message || 'Invalid email or password');
                showToast(response.message || 'Login failed', 'error');
            }
        } catch (error) {
            showFormError('login-error', 'Login error: ' + error.message);
            showToast('Login error: ' + error.message, 'error');
        } finally {
            _isSubmitting = false;
            enableSubmitButton(submitBtn);
            hideLoader(submitBtn);
        }
    });
}

// Setup register form
function setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;
    
    // Setup password policy meter
    setupPasswordPolicyMeter('reg-password', 'password-strength');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Prevent double-submit
        if (_isSubmitting) return;
        
        // Client-side validation
        const validator = new FormValidator('register-form');
        if (!validator.validate({
            'first_name': ['required'],
            'last_name': ['required'],
            'email': ['required', 'email'],
            'date_of_birth': ['required'],
            'password': ['required', 'passwordPolicy'],
            'password_confirm': ['required', 'match:password'],
            'terms': ['terms']
        })) {
            validator.displayErrors();
            return;
        }
        
        clearFormErrors('register-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        _isSubmitting = true;
        disableSubmitButton(submitBtn);
        showLoader(submitBtn);
        
        try {
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData);
            // Remove fields the backend doesn't need
            delete userData.terms;
            
            const response = await API.register(userData);
            
            if (response.success) {
                // Show success message
                showRegistrationSuccess(form);
                form.reset();
                
                // Redirect to login after showing success
                setTimeout(() => {
                    hideRegistrationSuccess();
                    switchView('login');
                    // Pre-fill email if we have it
                    const loginEmail = document.getElementById('login-email');
                    if (loginEmail && userData.email) {
                        loginEmail.value = userData.email;
                        loginEmail.focus();
                    }
                }, 2000);
            } else {
                // Display server validation errors on the correct fields
                if (response.errors && Object.keys(response.errors).length > 0) {
                    displayFormErrors(response.errors, 'register-form');
                }

                // Show the general form error banner
                const msg = response.message || 'Registration failed';
                showFormError('register-error', msg);
                showToast(msg, 'error');
            }
        } catch (error) {
            showFormError('register-error', 'Registration error: ' + error.message);
            showToast('Registration error: ' + error.message, 'error');
        } finally {
            _isSubmitting = false;
            enableSubmitButton(submitBtn);
            hideLoader(submitBtn);
        }
    });
}

// Show inline form error
function showFormError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
    }
}

// Show registration success banner
function showRegistrationSuccess(form) {
    let banner = document.getElementById('register-success');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'register-success';
        banner.className = 'form-success';
        banner.style.cssText = 'margin-top: 1rem; padding: 1rem; background: #e8f5e9; border: 1px solid #a5d6a7; border-radius: 0.5rem; color: #2e7d32; text-align: center; font-weight: 600; animation: fadeUp 320ms ease both;';
        form.parentNode.insertBefore(banner, form.nextSibling);
    }
    banner.textContent = '✓ Account created successfully! Redirecting to login...';
    banner.style.display = 'block';

    showToast('Registration successful! Redirecting to login...', 'success');
}

// Hide registration success banner
function hideRegistrationSuccess() {
    const banner = document.getElementById('register-success');
    if (banner) banner.style.display = 'none';
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
    
    const password = prompt('Enter your password to confirm account deactivation. This action permanently disables your profile.');
    if (!password) {
        showToast('Enter your password to continue with account deactivation.', 'warning');
        return;
    }
    
    deactivateAccount(password);
}

// Deactivate account
async function deactivateAccount(password) {
    try {
        const response = await API.deactivateProfile(password);
        
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
