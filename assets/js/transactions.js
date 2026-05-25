/**
 * Transaction and Account Handlers
 */

// Load dashboard data
async function loadDashboard() {
    if (!checkAuth()) return;
    
    try {
        const user = getUserData();
        document.getElementById('user-name').textContent = user.first_name || 'User';
        
        // Load accounts
        const accountsResponse = await API.listAccounts();
        let beneficiaries = [];

        try {
            const beneficiariesResponse = await API.listBeneficiaries();
            if (beneficiariesResponse.success) {
                beneficiaries = beneficiariesResponse.data || [];
            }
        } catch (error) {
            console.warn('Failed to load beneficiaries:', error);
        }

        if (accountsResponse.success) {
            displayAccounts(accountsResponse.data);
            populateAccountSelects(accountsResponse.data, beneficiaries);
        }
        
        // Load recent transactions
        const transResponse = await API.getRecentTransactions(5);
        if (transResponse.success) {
            displayRecentTransactions(transResponse.data);
        }
    } catch (error) {
        showToast('Failed to load dashboard: ' + error.message, 'error');
    }
}

// Display accounts
function displayAccounts(accounts) {
    const container = document.getElementById('accounts-grid');
    
    if (!accounts || accounts.length === 0) {
        container.innerHTML = '<p class="empty">No accounts found</p>';
        return;
    }
    
    container.innerHTML = accounts.map(account => `
        <div class="account-card">
            <div class="account-header">
                <h3>${account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)}</h3>
                <span class="account-status status-${account.status}">${account.status}</span>
            </div>
            <div class="account-body">
                <p class="account-number">${maskAccountNumber(account.account_number)}</p>
                <p class="account-balance">${formatCurrency(account.balance)}</p>
            </div>
            <div class="account-footer">
                <small>Opened: ${formatDate(account.account_opened_date)}</small>
            </div>
        </div>
    `).join('');
}

// Populate account selects and keep cached lists for transfer rendering
let __cachedAccounts = [];
let __cachedBeneficiaries = [];

function populateAccountSelects(accounts, beneficiaries = []) {
    __cachedAccounts = accounts || [];
    __cachedBeneficiaries = beneficiaries || [];

    const accountSelects = [
        'deposit-account',
        'withdraw-account',
        'transfer-from',
        'account-filter'
    ];
    
    accountSelects.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        
        const options = accounts.map(acc => 
            `<option value="${acc.account_id}">${acc.account_type} - ${maskAccountNumber(acc.account_number)}</option>`
        ).join('');
        
        select.innerHTML = `<option value="">Choose an account...</option>${options}`;
    });
    
    // Render transfer-to based on current destination toggle
    updateTransferDestinationType();
}

function renderTransferToOptions(destinationType) {
    const transferTo = document.getElementById('transfer-to');
    if (!transferTo) return;

    if (destinationType === 'my_account') {
        if (__cachedAccounts.length === 0) {
            transferTo.innerHTML = '<option value="">No accounts available</option>';
            return;
        }

        transferTo.innerHTML = `<option value="">Choose destination...</option>` + __cachedAccounts.map(acc =>
            `<option value="${acc.account_id}">${acc.account_type} - ${maskAccountNumber(acc.account_number)}</option>`
        ).join('');
    } else {
        if (__cachedBeneficiaries.length === 0) {
            transferTo.innerHTML = '<option value="">No beneficiaries saved</option>';
            return;
        }

        transferTo.innerHTML = `<option value="">Choose destination...</option>` + __cachedBeneficiaries.map(beneficiary => 
            `<option value="${beneficiary.account_number}">${beneficiary.beneficiary_name} - ${maskAccountNumber(beneficiary.account_number)}</option>`
        ).join('');
    }
}

function updateTransferDestinationType() {
    const radios = document.getElementsByName('transfer_destination_type');
    let destination = 'beneficiary';
    for (const r of radios) if (r.checked) destination = r.value;
    renderTransferToOptions(destination);
}

// Display recent transactions
function displayRecentTransactions(transactions) {
    const container = document.getElementById('recent-transactions');
    
    if (!transactions || transactions.length === 0) {
        container.innerHTML = '<p class="empty">No transactions yet</p>';
        return;
    }
    
    container.innerHTML = transactions.map(trans => `
        <div class="transaction-item">
            <div class="transaction-info">
                <p class="transaction-type">${trans.transaction_type.toUpperCase()}</p>
                <p class="transaction-description">${trans.description || 'Transaction'}</p>
                <p class="transaction-date">${formatDate(trans.created_at)}</p>
            </div>
            <div class="transaction-amount ${trans.transaction_type === 'deposit' || trans.transaction_type === 'transfer' && trans.to_account_id ? 'positive' : 'negative'}">
                ${trans.transaction_type === 'deposit' ? '+' : '-'}${formatCurrency(trans.amount)}
            </div>
        </div>
    `).join('');
}

// Load transaction history
async function loadTransactionHistory() {
    if (!checkAuth()) return;
    
    const accountId = document.getElementById('account-filter').value;
    
    if (!accountId) {
        showToast('Please select an account', 'info');
        return;
    }
    
    try {
        const response = await API.getTransactionHistory(accountId, 1, 50);
        if (response.success) {
            displayTransactionHistory(response.data);
            displayPagination(response.pagination);
        }
    } catch (error) {
        showToast('Failed to load transactions: ' + error.message, 'error');
    }
}

// Display transaction history
function displayTransactionHistory(transactions) {
    const container = document.getElementById('transactions-container');
    
    if (!transactions || transactions.length === 0) {
        container.innerHTML = '<p class="empty">No transactions found</p>';
        return;
    }
    
    container.innerHTML = transactions.map(trans => `
        <div class="transaction-item detailed">
            <div class="transaction-icon">
                ${getTransactionIcon(trans.transaction_type)}
            </div>
            <div class="transaction-details">
                <p class="transaction-type">${trans.transaction_type.toUpperCase()}</p>
                <p class="transaction-description">${trans.description || 'Transaction'}</p>
                <p class="transaction-reference">Ref: ${trans.reference_number}</p>
                <p class="transaction-date">${formatDate(trans.created_at)} ${formatTime(trans.created_at)}</p>
            </div>
            <div class="transaction-status">
                <span class="status status-${trans.status}">${trans.status}</span>
            </div>
            <div class="transaction-amount ${getTransactionAmountClass(trans)}">
                ${getTransactionAmountSign(trans)}${formatCurrency(trans.amount)}
            </div>
        </div>
    `).join('');
}

// Get transaction icon
function getTransactionIcon(type) {
    const icons = {
        'deposit': '💰',
        'withdrawal': '💸',
        'transfer': '↔️',
        'interest': '📈'
    };
    return icons[type] || '📝';
}

// Get transaction amount class
function getTransactionAmountClass(trans) {
    if (trans.transaction_type === 'deposit') return 'positive';
    if (trans.transaction_type === 'withdrawal') return 'negative';
    if (trans.transaction_type === 'transfer') return trans.from_account_id ? 'negative' : 'positive';
    return '';
}

// Get transaction amount sign
function getTransactionAmountSign(trans) {
    if (trans.transaction_type === 'deposit') return '+';
    if (trans.transaction_type === 'withdrawal') return '-';
    if (trans.transaction_type === 'transfer') return trans.from_account_id ? '-' : '+';
    return '';
}

// Display pagination
function displayPagination(pagination) {
    const container = document.getElementById('pagination');
    
    if (pagination.total_pages <= 1) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    let html = '';
    
    for (let i = 1; i <= pagination.total_pages; i++) {
        html += `<button class="btn ${i === pagination.page ? 'active' : ''}" onclick="loadTransactionPage(${i})">${i}</button>`;
    }
    
    container.innerHTML = html;
}

// Setup transaction forms
document.addEventListener('DOMContentLoaded', function() {
    // Create account form
    setupFormValidation('create-account-form', {
        'account_type': ['required']
    }, async (formData) => {
        const accountType = formData.get('account_type');

        try {
            const response = await API.createAccount(accountType);
            if (response.success) {
                showToast('Account created successfully!', 'success');
                document.getElementById('create-account-form').reset();
                setTimeout(() => {
                    switchView('dashboard');
                    loadDashboard();
                }, 1000);
            } else {
                showToast(response.message || 'Account creation failed', 'error');
            }
        } catch (error) {
            showToast('Account creation failed: ' + error.message, 'error');
        }
    });

    // Deposit form
    setupFormValidation('deposit-form', {
        'account_id': ['required'],
        'amount': ['required', 'number']
    }, async (formData) => {
        const accountId = formData.get('account_id');
        const amount = formData.get('amount');
        const description = formData.get('description');
        
        try {
            const response = await API.deposit(accountId, amount, description);
            if (response.success) {
                showToast('Deposit successful!', 'success');
                document.getElementById('deposit-form').reset();
                setTimeout(() => {
                    switchView('dashboard');
                    loadDashboard();
                }, 1000);
            }
        } catch (error) {
            showToast('Deposit failed: ' + error.message, 'error');
        }
    });
    
    // Withdraw form
    setupFormValidation('withdraw-form', {
        'account_id': ['required'],
        'amount': ['required', 'number']
    }, async (formData) => {
        const accountId = formData.get('account_id');
        const amount = formData.get('amount');
        const description = formData.get('description');
        
        try {
            const response = await API.withdraw(accountId, amount, description);
            if (response.success) {
                showToast('Withdrawal successful!', 'success');
                document.getElementById('withdraw-form').reset();
                setTimeout(() => {
                    switchView('dashboard');
                    loadDashboard();
                }, 1000);
            }
        } catch (error) {
            showToast('Withdrawal failed: ' + error.message, 'error');
        }
    });
    
    // Transfer form
    setupFormValidation('transfer-form', {
        'from_account_id': ['required'],
        'to_account_id': ['required'],
        'amount': ['required', 'number']
    }, async (formData) => {
        const fromAccountId = formData.get('from_account_id');
        const toAccountValue = formData.get('to_account_id');
        const amount = formData.get('amount');
        const description = formData.get('description');

        // Determine destination type
        const radios = document.getElementsByName('transfer_destination_type');
        let destination = 'beneficiary';
        for (const r of radios) if (r.checked) destination = r.value;

        try {
            let response;
            if (destination === 'my_account') {
                // toAccountValue is account_id (numeric)
                response = await API.transfer(fromAccountId, toAccountValue, amount, description);
            } else {
                // beneficiary account_number
                response = await API.transfer(fromAccountId, toAccountValue, amount, description);
            }

            if (response.success) {
                showToast('Transfer successful!', 'success');
                document.getElementById('transfer-form').reset();
                setTimeout(() => {
                    switchView('dashboard');
                    loadDashboard();
                }, 1000);
            }
        } catch (error) {
            showToast('Transfer failed: ' + error.message, 'error');
        }
    });
});

// Update transfer balance display
function updateTransferBalance() {
    const select = document.getElementById('transfer-from');
    // Logic can be enhanced to fetch and display balance
}

// Load profile
async function loadProfile() {
    if (!checkAuth()) return;
    
    try {
        const response = await API.getProfile();
        if (response.success) {
            const user = response.data;
            document.getElementById('profile-first-name').value = user.first_name || '';
            document.getElementById('profile-last-name').value = user.last_name || '';
            const aliasField = document.getElementById('profile-alias-name');
            if (aliasField) {
                aliasField.value = user.alias_name || '';
            }
            document.getElementById('profile-email').value = user.email;
            document.getElementById('profile-phone').value = user.phone_number || '';
            document.getElementById('profile-city').value = user.city || '';
            document.getElementById('profile-state').value = user.state || '';
        }
    } catch (error) {
        showToast('Failed to load profile: ' + error.message, 'error');
    }
}

// Setup profile form
document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(profileForm);
                const profileData = Object.fromEntries(formData);
                
                const response = await API.updateProfile(profileData);
                if (response.success) {
                    showToast('Profile updated successfully!', 'success');
                } else {
                    showToast(response.message || 'Update failed', 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        });
    }
});

// Load accounts into Manage Accounts view
async function loadManageAccounts() {
    if (!checkAuth()) return;

    const container = document.getElementById('manage-accounts-list');
    if (!container) return;

    console.debug('loadManageAccounts: started');

    try {
        const response = await API.listAccounts();
        console.debug('loadManageAccounts: API.listAccounts response=', response);
        if (!response.success) {
            container.innerHTML = '<p class="empty">Failed to load accounts</p>';
            return;
        }

        const accounts = response.data || [];
        if (accounts.length === 0) {
            container.innerHTML = '<p class="empty">No accounts found</p>';
            return;
        }

        container.innerHTML = accounts.map(acc => `
            <div class="card manage-account-item" role="article">
                <div class="card-body" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;">
                    <div class="manage-account-info">
                        <div class="list-item-title">${acc.account_type.replace('_',' ')} — <span class="account-mask">${maskAccountNumber(acc.account_number)}</span> <span class="badge badge-primary">${acc.status}</span></div>
                        <div class="list-item-subtitle">Balance: ${formatCurrency(acc.balance)}</div>
                    </div>
                    <div class="manage-account-actions" style="display:flex;gap:0.5rem;align-items:center;">
                        <button class="btn ${(acc.status === 'inactive' || acc.status === 'frozen') ? 'btn-success' : 'btn-warning'}" onclick="toggleAccountStatus(${acc.account_id}, '${acc.status}')">${(acc.status === 'inactive' || acc.status === 'frozen') ? 'Activate' : 'Deactivate'}</button>
                        <button class="btn btn-danger" onclick="closeAccount(${acc.account_id})">Close</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="empty">Failed to load accounts</p>';
    }
}

// Close account action
async function closeAccount(accountId) {
    if (!confirm('Are you sure you want to close this account? Balance must be zero.')) return;
    try {
        const response = await API.closeAccount(accountId);
        if (response.success) {
            showToast('Account closed', 'success');
            loadManageAccounts();
            loadDashboard();
        } else {
            showToast(response.message || 'Failed to close account', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// Toggle account status between active and inactive
async function toggleAccountStatus(accountId, currentStatus) {
    const isInactive = currentStatus === 'inactive' || currentStatus === 'frozen';
    const actionLabel = isInactive ? 'activate' : 'deactivate';
    const confirmMessage = isInactive
        ? 'Activate this account again?'
        : 'Deactivate this account? This will mark the account inactive but will not deactivate your user account.';

    if (!confirm(confirmMessage)) return;

    try {
        const response = isInactive
            ? await API.activateAccount(accountId)
            : await API.deactivateAccount(accountId);

        if (response.success) {
            showToast(`Account ${actionLabel}d`, 'success');
            loadManageAccounts();
            loadDashboard();
        } else {
            showToast(response.message || `Failed to ${actionLabel} account`, 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}
