/**
 * Utility Functions
 */

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format time
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
}

// Get query parameter
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Switch between views
function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.auth-view, .main-view, .transaction-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show target view
    const targetView = document.getElementById(viewName + '-view');
    if (targetView) {
        targetView.classList.add('active');
        
        // Load view-specific data
        if (viewName === 'dashboard') {
            loadDashboard();
        } else if (viewName === 'transactions') {
            loadTransactionHistory();
        } else if (viewName === 'profile') {
            loadProfile();
        } else if (viewName === 'manage-accounts') {
            // Load account list for management
            if (typeof loadManageAccounts === 'function') {
                console.debug('switchView: loading manage accounts view');
                loadManageAccounts();
            } else {
                console.debug('switchView: loadManageAccounts not defined yet');
            }
        }
    }
}

// Show loading spinner
function showLoader(element) {
    const loader = element.querySelector('.loader');
    if (loader) {
        loader.style.display = 'inline-block';
    }
}

// Hide loading spinner
function hideLoader(element) {
    const loader = element.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Clear form errors
function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    const errorDiv = form.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    }
}

// Display form errors
function displayFormErrors(errors, formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    clearFormErrors(formId);
    
    for (const [field, messages] of Object.entries(errors)) {
        const errorEl = document.getElementById(`${formId}-${field.replace(/_/g, '-')}-error`);
        if (errorEl && messages.length > 0) {
            errorEl.textContent = messages[0];
        }
    }
}

// Debounce function
function debounce(func, wait) {
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

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('auth_token');
}

// Check session and redirect if needed
function checkAuth() {
    if (!isLoggedIn()) {
        switchView('login');
        return false;
    }
    return true;
}

// Get stored token
function getAuthToken() {
    return localStorage.getItem('auth_token');
}

// Store token
function setAuthToken(token) {
    localStorage.setItem('auth_token', token);
}

// Remove token
function clearAuthToken() {
    localStorage.removeItem('auth_token');
}

// Get user data from storage
function getUserData() {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
}

// Store user data
function setUserData(data) {
    localStorage.setItem('user_data', JSON.stringify(data));
}

// Clear user data
function clearUserData() {
    localStorage.removeItem('user_data');
}

// Validate email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate password strength
function getPasswordStrength(password) {
    let strength = 2;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    
    
    return strength;
}

// Get password strength label
function getPasswordStrengthLabel(strength) {
    if (strength < 2) return 'Weak';
    if (strength < 3) return 'Fair';
    if (strength < 4) return 'Good';
    if (strength < 5) return 'Strong';
    return 'Very Strong';
}

// Get password strength color
function getPasswordStrengthColor(strength) {
    if (strength < 2) return '#d32f2f';
    if (strength < 3) return '#f57c00';
    if (strength < 4) return '#fbc02d';
    if (strength < 5) return '#689f38';
    return '#388e3c';
}

// Mask account number
function maskAccountNumber(accountNumber) {
    if (!accountNumber) return '';
    const visible = accountNumber.slice(-4);
    return '*'.repeat(accountNumber.length - 4) + visible;
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard', 'success', 2000);
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}
