/**
 * API Communication Layer
 */

const API_BASE = (window.__API_BASE__ || 'https://earpiece-fondly-partake.ngrok-free.dev/index.php/api').replace(/\/$/, '');

class API {
    
    static async request(endpoint, options = {}) {
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = `${API_BASE}${normalizedEndpoint}`;
        const hasBody = Object.prototype.hasOwnProperty.call(options, 'body');
        const isPublicAuthEndpoint = normalizedEndpoint === '/auth/login' || normalizedEndpoint === '/auth/register';
        const headers = {
            'ngrok-skip-browser-warning': 'true'
        };

        if (hasBody && !options.headers?.['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
        
        // Add auth token if available
        const token = !isPublicAuthEndpoint ? getAuthToken() : null;
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            credentials: 'include',
            mode: 'cors',
            ...options,
            headers: { ...headers, ...options.headers }
        };
        
        try {
            const response = await fetch(url, config);
            const contentType = response.headers.get('content-type') || '';
            const rawBody = await response.text();

            if (!contentType.includes('application/json')) {
                throw new Error(`Expected JSON from ${url}, got ${contentType || 'unknown content type'}: ${rawBody.slice(0, 120)}`);
            }

            const data = rawBody ? JSON.parse(rawBody) : {};
            
            // Handle unauthorized
            if (response.status === 401) {
                clearAuthToken();
                clearUserData();
                switchView('login');
                throw new Error('Session expired. Please log in again.');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Authentication
    static async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    }
    
    static async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
    }
    
    static async logout() {
        return this.request('/auth/logout', {
            method: 'POST'
        });
    }
    
    static async getCurrentUser() {
        return this.request('/auth/me', {
            method: 'GET'
        });
    }
    
    // Accounts
    static async listAccounts() {
        return this.request('/accounts', {
            method: 'GET'
        });
    }
    
    static async getAccount(accountId) {
        return this.request(`/accounts/${accountId}`, {
            method: 'GET'
        });
    }
    
    static async deposit(accountId, amount, description) {
        return this.request(`/accounts/${accountId}/deposit`, {
            method: 'POST',
            body: JSON.stringify({ amount, description })
        });
    }
    
    static async withdraw(accountId, amount, description) {
        return this.request(`/accounts/${accountId}/withdraw`, {
            method: 'POST',
            body: JSON.stringify({ amount, description })
        });
    }
    
    static async transfer(fromAccountId, toAccountId, amount, description) {
        return this.request(`/accounts/${fromAccountId}/transfer`, {
            method: 'POST',
            body: JSON.stringify({
                to_account_id: toAccountId,
                amount,
                description
            })
        });
    }
    
    static async closeAccount(accountId) {
        return this.request(`/accounts/${accountId}/close`, {
            method: 'POST'
        });
    }
    
    static async getTransactionHistory(accountId, page = 1, limit = 20) {
        return this.request(`/accounts/${accountId}/history?page=${page}&limit=${limit}`, {
            method: 'GET'
        });
    }
    
    // Transactions
    static async getRecentTransactions(limit = 10) {
        return this.request(`/transactions?limit=${limit}`, {
            method: 'GET'
        });
    }
    
    static async getTransaction(transactionId) {
        return this.request(`/transactions/${transactionId}`, {
            method: 'GET'
        });
    }
    
    // Profile
    static async getProfile() {
        return this.request('/profile', {
            method: 'GET'
        });
    }
    
    static async updateProfile(profileData) {
        return this.request('/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }
    
    static async changePassword(currentPassword, newPassword, confirmPassword) {
        return this.request('/profile/change-password', {
            method: 'POST',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
        });
    }
    
    static async deactivateAccount(password) {
        return this.request('/profile/deactivate', {
            method: 'POST',
            body: JSON.stringify({ password })
        });
    }
    
    // Beneficiaries
    static async listBeneficiaries() {
        return this.request('/beneficiaries', {
            method: 'GET'
        });
    }
    
    static async getBeneficiary(beneficiaryId) {
        return this.request(`/beneficiaries/${beneficiaryId}`, {
            method: 'GET'
        });
    }
    
    static async addBeneficiary(beneficiaryData) {
        return this.request('/beneficiaries', {
            method: 'POST',
            body: JSON.stringify(beneficiaryData)
        });
    }
    
    static async updateBeneficiary(beneficiaryId, data) {
        return this.request(`/beneficiaries/${beneficiaryId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    static async removeBeneficiary(beneficiaryId) {
        return this.request(`/beneficiaries/${beneficiaryId}`, {
            method: 'DELETE'
        });
    }
}
