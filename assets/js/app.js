/**
 * Main Application Logic
 */

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check authentication status
    if (isLoggedIn()) {
        loadDashboard();
    } else {
        switchView('login');
    }
}

// Change password view and form
document.addEventListener('DOMContentLoaded', function() {
    const changePasswordBtn = document.querySelector('button[onclick="switchView(\'change-password\')"]');
    
    // Create change-password view if needed
    if (!document.getElementById('change-password-view')) {
        const changePasswordHtml = `
            <section id="change-password-view" class="main-view">
                <nav class="navbar">
                    <button onclick="switchView('profile')" class="btn-back">← Back</button>
                    <div class="navbar-title">Change Password</div>
                </nav>
                
                <div class="container form-container">
                    <form id="change-password-form" class="form-section">
                        <div class="form-group">
                            <label for="current-password">Current Password</label>
                            <input 
                                type="password" 
                                id="current-password" 
                                name="current_password" 
                                required
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="new-password">New Password</label>
                            <input 
                                type="password" 
                                id="new-password" 
                                name="new_password" 
                                required
                            >
                            <div class="password-strength" id="change-password-strength"></div>
                            <small class="form-hint">
                                Password must contain uppercase, lowercase, numbers, and special characters
                            </small>
                        </div>
                        
                        <div class="form-group">
                            <label for="confirm-password">Confirm New Password</label>
                            <input 
                                type="password" 
                                id="confirm-password" 
                                name="confirm_password" 
                                required
                            >
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block">
                            Change Password
                        </button>
                        <div class="form-error" id="change-password-error" style="display: none;"></div>
                    </form>
                </div>
            </section>
        `;
        
        document.getElementById('app').insertAdjacentHTML('beforeend', changePasswordHtml);
        setupChangePasswordForm();
    }
});

// Setup change password form
function setupChangePasswordForm() {
    const form = document.getElementById('change-password-form');
    if (!form) return;
    
    setupPasswordStrengthMeter('new-password', 'change-password-strength');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const validator = new FormValidator('change-password-form');
        if (!validator.validate({
            'current_password': ['required'],
            'new_password': ['required', 'min:12'],
            'confirm_password': ['required', 'match:new_password']
        })) {
            validator.displayErrors();
            return;
        }
        
        clearFormErrors('change-password-form');
        
        try {
            const current = document.getElementById('current-password').value;
            const newPass = document.getElementById('new-password').value;
            const confirm = document.getElementById('confirm-password').value;
            
            const response = await API.changePassword(current, newPass, confirm);
            if (response.success) {
                showToast('Password changed successfully!', 'success');
                form.reset();
                setTimeout(() => {
                    switchView('profile');
                }, 1000);
            } else {
                showToast(response.message || 'Password change failed', 'error');
            }
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        }
    });
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showToast('An unexpected error occurred', 'error');
});

// Handle network errors
window.addEventListener('offline', function() {
    showToast('Connection lost. Please check your internet.', 'error');
});

window.addEventListener('online', function() {
    showToast('Connection restored', 'success');
});

// Page visibility handling
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && isLoggedIn()) {
        // Refresh data when page becomes visible
        if (document.querySelector('.main-view.active')) {
            const activeView = document.querySelector('.main-view.active').id;
            if (activeView === 'dashboard-view') {
                loadDashboard();
            }
        }
    }
});

// Auto-logout on inactivity (optional security feature)
let inactivityTimeout;
const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutes

function resetInactivityTimer() {
    if (!isLoggedIn()) return;
    
    clearTimeout(inactivityTimeout);
    
    inactivityTimeout = setTimeout(() => {
        showToast('Session expired due to inactivity', 'warning');
        logout();
    }, INACTIVITY_TIME);
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);

// Initialize inactivity timer
if (isLoggedIn()) {
    resetInactivityTimer();
}

// Beneficiaries view (optional enhancement)
function setupBeneficiariesView() {
    // Create beneficiaries view if needed
    if (!document.getElementById('beneficiaries-view')) {
        const beneficiariesHtml = `
            <section id="beneficiaries-view" class="main-view">
                <nav class="navbar">
                    <button onclick="switchView('dashboard')" class="btn-back">Back</button>
                    <div class="navbar-title">Manage Beneficiaries</div>
                </nav>
                
                <div class="container">
                    <button class="btn btn-primary" onclick="showAddBeneficiaryForm()">Add Beneficiary</button>
                    <div id="beneficiaries-list" class="beneficiaries-list">
                        <p class="loading">Loading beneficiaries...</p>
                    </div>
                </div>
            </section>
        `;
        
        document.getElementById('app').insertAdjacentHTML('beforeend', beneficiariesHtml);
    }
}

// Add this to DOMContentLoaded
document.addEventListener('DOMContentLoaded', setupBeneficiariesView);
