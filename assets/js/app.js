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
                    <div id="beneficiary-form-container" style="display: none;"></div>
                    <div id="beneficiaries-list" class="beneficiaries-list">
                        <p class="loading">Loading beneficiaries...</p>
                    </div>
                </div>
            </section>
        `;
        
        document.getElementById('app').insertAdjacentHTML('beforeend', beneficiariesHtml);
    }

    loadBeneficiariesList();
}

function showAddBeneficiaryForm() {
    const container = document.getElementById('beneficiary-form-container');
    if (!container) return;

    container.style.display = 'block';
    container.innerHTML = `
        <form id="beneficiary-form" class="transaction-form" style="margin-top: 1rem;">
            <div class="form-group">
                <label for="beneficiary-alias-name">Alias Name</label>
                <input type="text" id="beneficiary-alias-name" name="alias_name" placeholder="e.g., Rent, Mom, Salary account" required>
            </div>
            <div class="form-group">
                <label for="beneficiary-lookup-type">Add By</label>
                <select id="beneficiary-lookup-type" name="lookup_type" required onchange="updateBeneficiaryLookupFields()">
                    <option value="phone_number">Phone Number</option>
                    <option value="profile_alias">Profile Alias</option>
                </select>
            </div>
            <div class="form-group">
                <label for="beneficiary-lookup-value" id="beneficiary-lookup-label">Phone Number</label>
                <input type="text" id="beneficiary-lookup-value" name="lookup_value" placeholder="Enter phone number" required>
            </div>
            <div class="form-group">
                <label for="beneficiary-bank-name">Bank Name (Optional)</label>
                <input type="text" id="beneficiary-bank-name" name="bank_name">
            </div>
            <div class="form-group">
                <label for="beneficiary-relationship">Relationship (Optional)</label>
                <input type="text" id="beneficiary-relationship" name="relationship">
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Save Beneficiary</button>
                <button type="button" class="btn btn-secondary" onclick="hideAddBeneficiaryForm()">Cancel</button>
            </div>
            <div class="form-error" id="beneficiary-form-error" style="display: none;"></div>
        </form>
    `;

    updateBeneficiaryLookupFields();

    const form = document.getElementById('beneficiary-form');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const payload = {
            alias_name: (formData.get('alias_name') || '').trim(),
            lookup_type: formData.get('lookup_type'),
            lookup_value: (formData.get('lookup_value') || '').trim(),
            bank_name: (formData.get('bank_name') || '').trim(),
            relationship: (formData.get('relationship') || '').trim()
        };

        try {
            const response = await API.addBeneficiary(payload);
            if (response.success) {
                showToast('Beneficiary added successfully', 'success');
                hideAddBeneficiaryForm();
                loadBeneficiariesList();
                loadDashboard();
            } else {
                showToast(response.message || 'Failed to add beneficiary', 'error');
            }
        } catch (error) {
            showToast('Failed to add beneficiary: ' + error.message, 'error');
        }
    });
}

function updateBeneficiaryLookupFields() {
    const lookupType = document.getElementById('beneficiary-lookup-type');
    const lookupLabel = document.getElementById('beneficiary-lookup-label');
    const lookupInput = document.getElementById('beneficiary-lookup-value');

    if (!lookupType || !lookupLabel || !lookupInput) return;

    if (lookupType.value === 'phone_number') {
        lookupLabel.textContent = 'Phone Number';
        lookupInput.placeholder = 'Enter phone number';
    } else if (lookupType.value === 'profile_alias') {
        lookupLabel.textContent = 'Profile Alias';
        lookupInput.placeholder = 'Enter profile alias';
    }
}

function hideAddBeneficiaryForm() {
    const container = document.getElementById('beneficiary-form-container');
    if (!container) return;

    container.innerHTML = '';
    container.style.display = 'none';
}

async function loadBeneficiariesList() {
    const container = document.getElementById('beneficiaries-list');
    if (!container || !checkAuth()) return;

    try {
        const response = await API.listBeneficiaries();
        if (!response.success) {
            container.innerHTML = '<p class="empty">Failed to load beneficiaries</p>';
            return;
        }

        const beneficiaries = response.data || [];
        if (beneficiaries.length === 0) {
            container.innerHTML = '<p class="empty">No beneficiaries saved</p>';
            return;
        }

        container.innerHTML = beneficiaries.map(beneficiary => `
            <div class="beneficiary-item">
                <strong>${beneficiary.beneficiary_name}</strong>
                <div>${maskAccountNumber(beneficiary.account_number)}</div>
                <small>${beneficiary.bank_name || 'No bank name provided'}</small>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="empty">Failed to load beneficiaries</p>';
    }
}

// Add this to DOMContentLoaded
document.addEventListener('DOMContentLoaded', setupBeneficiariesView);
