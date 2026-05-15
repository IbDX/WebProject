# SecureBank - Secure Web-Based Banking Application

A complete, enterprise-grade secure banking platform built with vanilla HTML5, CSS3, JavaScript, PHP 8+, and MySQL. Features comprehensive security measures, intuitive UI/UX, and full CRUD operations.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [File Structure](#file-structure)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Banking Features
- ✅ **User Registration & Authentication** - Secure password hashing with bcrypt
- ✅ **Multiple Account Types** - Savings, Checking, Money Market accounts
- ✅ **Deposits & Withdrawals** - Real-time balance updates
- ✅ **Fund Transfers** - Between user accounts with audit trails
- ✅ **Transaction History** - Paginated, filterable transaction records
- ✅ **Beneficiary Management** - Save and manage transfer recipients

### Security
- ✅ **PDO Prepared Statements** - Complete SQL injection prevention
- ✅ **CSRF Protection** - Token-based CSRF validation
- ✅ **Session Management** - Secure session handling with IP verification
- ✅ **Password Security** - password_hash() with bcrypt algorithm
- ✅ **Input Sanitization** - Client and server-side validation
- ✅ **Audit Logging** - Complete compliance tracking
- ✅ **Rate Limiting** - Login attempt throttling
- ✅ **Data Encryption** - AES-256 for sensitive data

### User Experience
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Intuitive Navigation** - Clean, corporate interface
- ✅ **Real-time Notifications** - Toast alerts for all actions
- ✅ **Form Validation** - Client and server-side validation
- ✅ **Accessible UI** - WCAG compliant design

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Semantic HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+)
- **Backend**: PHP 8+ with PDO
- **Database**: MySQL 5.7+
- **Security**: bcrypt, AES-256, CSRF tokens, Prepared Statements
- **API**: RESTful JSON API

### Design Patterns
- MVC (Model-View-Controller)
- Middleware pattern for authentication/validation
- Factory pattern for database connections
- Repository pattern for data access

---

## 📦 Requirements

### System Requirements
- PHP 8.0 or higher
- MySQL 5.7 or higher
- Apache with mod_rewrite enabled
- 512 MB RAM minimum
- 100 MB disk space

### PHP Extensions
```
- PDO (PHP Data Objects)
- pdo_mysql
- json
- openssl
- session
```

### Recommended
```
- PHP 8.1+
- MySQL 8.0+
- Apache 2.4+
- HTTPS/SSL Certificate
```

---

## 🚀 Installation

### 1. Download/Extract Files
```bash
cd /var/www/html/
# or your web server root
unzip securebank.zip
cd securebank
```

### 2. Set Permissions
```bash
chmod 750 config/
chmod 750 src/
chmod 750 public/
chmod 640 config/database.php
chmod 644 .htaccess
```

### 3. Install Dependencies
```bash
# No external dependencies required for vanilla setup
# All utilities are built-in
```

### 4. Configure Database
Edit `config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'banking_app_db');
define('DB_USER', 'banking_user');
define('DB_PASSWORD', 'SecurePassword123!');
```

### 5. Import Database Schema
```bash
# Using MySQL CLI
mysql -u banking_user -p banking_app_db < database_schema.sql

# Using phpMyAdmin
# 1. Create database: banking_app_db
# 2. Import: database_schema.sql
```

### 6. Start Application
```
http://localhost/securebank/
```

---

## ⚙️ Configuration

### Environment Setup

Create a `.env` file in the root directory:
```
APP_ENV=production
DB_HOST=localhost
DB_NAME=banking_app_db
DB_USER=banking_user
DB_PASSWORD=your_secure_password
ENCRYPTION_KEY=your_256_bit_key
SESSION_LIFETIME=3600
```

### PHP Configuration

Ensure php.ini has:
```ini
session.cookie_httponly = 1
session.cookie_secure = 1
session.cookie_samesite = Strict
session.gc_maxlifetime = 3600
display_errors = Off
log_errors = On
```

### Apache Configuration

`.htaccess` includes:
- URL rewriting for clean URLs
- Security headers
- Compression
- Caching policies
- Protection of sensitive files

---

## 💾 Database Setup

### Quick Setup

```sql
-- Create database and user
CREATE DATABASE banking_app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'banking_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';
GRANT ALL PRIVILEGES ON banking_app_db.* TO 'banking_user'@'localhost';
FLUSH PRIVILEGES;

-- Import schema
USE banking_app_db;
SOURCE database_schema.sql;
```

### Tables Created
1. **users** - User accounts and profiles
2. **accounts** - Bank accounts with balances
3. **transactions** - Transaction history
4. **sessions** - Session management
5. **audit_logs** - Compliance logging
6. **beneficiaries** - Transfer recipients

### Database Optimization
```sql
-- Add indexes for performance
ALTER TABLE transactions ADD INDEX idx_created_at (created_at);
ALTER TABLE accounts ADD INDEX idx_user_balance (user_id, balance);

-- Run optimization
OPTIMIZE TABLE users, accounts, transactions, sessions, audit_logs, beneficiaries;
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost/api/
```

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-15",
  "phone_number": "(555) 123-4567"
}

Response: 201 Created
{
  "success": true,
  "data": { "user_id": 1 },
  "message": "User registered successfully"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user_id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "token": "session_token_here"
  },
  "message": "Login successful"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { /* user data */ },
    "accounts": [ /* account list */ ]
  }
}
```

### Account Endpoints

#### List Accounts
```
GET /api/accounts
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "account_id": 1,
      "account_number": "ACC123...",
      "account_type": "savings",
      "balance": "5000.00",
      "status": "active"
    }
  ]
}
```

#### Deposit
```
POST /api/accounts/{accountId}/deposit
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 500.00,
  "description": "Paycheck deposit"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "transaction_id": 123,
    "reference_number": "TXN-1234567890-abc123",
    "new_balance": "5500.00"
  }
}
```

#### Withdraw
```
POST /api/accounts/{accountId}/withdraw
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 100.00,
  "description": "ATM withdrawal"
}
```

#### Transfer
```
POST /api/accounts/{fromAccountId}/transfer
Authorization: Bearer {token}
Content-Type: application/json

{
  "to_account_id": 2,
  "amount": 250.00,
  "description": "Payment to John"
}
```

#### Transaction History
```
GET /api/accounts/{accountId}/history?page=1&limit=20
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [ /* transactions */ ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "has_more": true
  }
}
```

### Profile Endpoints

#### Get Profile
```
GET /api/profile
Authorization: Bearer {token}
```

#### Update Profile
```
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith",
  "phone_number": "(555) 123-4567",
  "city": "New York"
}
```

#### Change Password
```
POST /api/profile/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "current_password": "OldPass123!",
  "new_password": "NewPass456!",
  "confirm_password": "NewPass456!"
}
```

---

## 🔒 Security Features

### Password Security
- **Algorithm**: bcrypt with cost factor 12
- **Minimum Length**: 12 characters
- **Required**: Uppercase, lowercase, numbers, special characters
- **Hashing**: password_hash() and password_verify()

### SQL Injection Prevention
- **Prepared Statements**: 100% PDO with parameterized queries
- **Input Binding**: All user input bound as parameters
- **Query Validation**: Type-safe parameter binding

### Session Security
- **Token Generation**: cryptographically secure tokens
- **IP Verification**: Session bound to client IP
- **User Agent Check**: Additional session validation
- **Timeout**: Automatic session expiration after inactivity
- **HTTP-Only Cookies**: Prevent XSS access to session tokens

### CSRF Protection
- **Token Generation**: Unique tokens per session
- **Token Validation**: Server-side verification
- **Token Rotation**: Optional automatic rotation

### Input Validation
- **Client-side**: Real-time validation with user feedback
- **Server-side**: Strict validation of all inputs
- **Sanitization**: HTML entity encoding and escaping

### Data Protection
- **Encryption**: AES-256 for sensitive data at rest
- **HTTPS**: Recommended for production deployment
- **Secure Headers**: CSP, X-Frame-Options, X-Content-Type-Options

### Audit Logging
- **All Actions**: Login, transactions, profile changes
- **Compliance**: GDPR-ready audit trail
- **Retention**: Configurable retention period
- **Retention Policy**: 90-day default retention

---

## 📁 File Structure

```
securebank/
├── config/
│   └── database.php              # Database configuration & connection
├── src/
│   ├── controllers/
│   │   ├── Router.php            # Request routing logic
│   │   ├── AuthController.php    # Authentication handlers
│   │   ├── AccountController.php # Account CRUD operations
│   │   ├── TransactionController.php
│   │   └── ProfileController.php
│   ├── models/
│   │   ├── User.php              # User model with business logic
│   │   ├── Account.php           # Account model
│   │   ├── Transaction.php       # Transaction model
│   │   └── Beneficiary.php       # Beneficiary model
│   ├── middleware/
│   │   ├── AuthMiddleware.php    # Authentication & session handling
│   │   └── AuditMiddleware.php   # Logging middleware
│   └── utils/
│       ├── SecurityHelper.php    # Password hashing, encryption
│       ├── Validator.php         # Input validation
│       ├── Response.php          # Response formatting
│       └── AuditLogger.php       # Audit logging
├── public/
│   └── index.html                # Single-page application
├── views/
│   └── (template structure documented in PROJECT_STRUCTURE.md)
├── assets/
│   ├── css/
│   │   ├── main.css              # Core styling
│   │   ├── responsive.css        # Mobile responsive styles
│   │   └── components.css        # Component styles
│   └── js/
│       ├── app.js                # Main application logic
│       ├── api.js                # API communication layer
│       ├── auth.js               # Authentication handlers
│       ├── transactions.js       # Transaction handlers
│       ├── validation.js         # Form validation
│       └── utils.js              # Utility functions
├── database_schema.sql           # MySQL database schema
├── .htaccess                     # Apache configuration
├── index.php                     # Application entry point
└── README.md                     # This file
```

---

## 🐛 Troubleshooting

### Database Connection Errors

**Error**: "SQLSTATE[HY000]: General error: 2006 MySQL server has gone away"

**Solution**:
```php
// In config/database.php, add:
$pdo->exec("SET SESSION time_zone = '+00:00'");
```

### Session Issues

**Error**: "Session expired" when user is still active

**Solution**:
1. Check SESSION_LIFETIME in config/database.php
2. Verify session.gc_maxlifetime in php.ini
3. Check server timezone settings

### CORS Issues

**Error**: "Access to XMLHttpRequest blocked by CORS"

**Solution**: The application uses same-origin requests. For cross-domain:
```php
// In index.php, enable CORS:
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
```

### File Permission Issues

**Error**: "Permission denied" errors

**Solution**:
```bash
# Set correct permissions
chmod 755 config/ src/ public/ assets/
chmod 644 *.php *.html .htaccess
chmod 644 config/database.php
```

### 404 Errors

**Error**: Routes not working, getting 404

**Solution**:
1. Verify mod_rewrite is enabled: `a2enmod rewrite`
2. Check .htaccess is in root directory
3. Restart Apache: `sudo systemctl restart apache2`

### Password Strength Issues

**Error**: "Password does not meet strength requirements"

**Solution**: Ensure password has:
- At least 12 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one digit (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

### API Response Issues

**Error**: "Invalid JSON response"

**Solution**:
1. Check for PHP errors: set display_errors = Off in production
2. Verify Content-Type header is application/json
3. Check error logs: `/var/log/apache2/error.log`

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

```sql
-- Clean old audit logs (monthly)
DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- Optimize tables (monthly)
OPTIMIZE TABLE users, accounts, transactions, sessions, audit_logs, beneficiaries;

-- Backup database (daily)
mysqldump -u banking_user -p banking_app_db > backup_$(date +%Y%m%d).sql
```

### Monitoring

Monitor these metrics:
- Login failures (potential brute force)
- Transaction errors (system issues)
- Session timeouts (user experience)
- Database connection pool usage
- Disk space usage

### Updates & Patches

- Keep PHP updated to latest version
- Update MySQL/MariaDB regularly
- Apply Apache security patches
- Review and update dependencies

---

## 📄 License

This application is provided as-is for educational and commercial use.

---

## ⚠️ Security Notice

**Production Deployment Checklist:**
- [ ] Change all default passwords
- [ ] Set APP_ENV to 'production'
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Configure error logging (don't display errors to users)
- [ ] Set strong database encryption key
- [ ] Review audit logs regularly
- [ ] Implement rate limiting at firewall level
- [ ] Use content delivery network (CDN) for static assets
- [ ] Set up monitoring and alerting
- [ ] Conduct security audit
- [ ] Implement 2FA (optional enhancement)
- [ ] Use password manager for admin credentials

---

**Developed with ❤️ for secure banking**

Version: 1.0.0
Last Updated: 2026-05-15
# WebProject
