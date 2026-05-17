SECURE BANKING APPLICATION - PROJECT STRUCTURE
================================================

web-banking-app/
│
├── database_schema.sql              # Complete MySQL schema with all tables
├── .htaccess                        # Apache routing configuration
├── index.php                        # Application entry point
├── README.md                        # Project documentation
│
├── config/
│   └── database.php                 # PDO database connection and configuration
│
├── src/
│   ├── controllers/
│   │   ├── AuthController.php       # User registration, login, logout
│   │   ├── AccountController.php    # Account CRUD operations
│   │   ├── TransactionController.php# Deposit, withdrawal, transfer
│   │   └── ProfileController.php    # User profile management
│   │
│   ├── models/
│   │   ├── User.php                 # User model with authentication
│   │   ├── Account.php              # Account model with balance management
│   │   ├── Transaction.php          # Transaction model with history
│   │   └── Beneficiary.php          # Beneficiary management
│   │
│   ├── middleware/
│   │   ├── AuthMiddleware.php       # Session validation and authentication
│   │   ├── ValidationMiddleware.php # Input validation and sanitization
│   │   └── AuditMiddleware.php      # Logging and compliance tracking
│   │
│   └── utils/
│       ├── Validator.php            # Input validation utilities
│       ├── SecurityHelper.php       # Password hashing, encryption utilities
│       ├── AuditLogger.php          # Audit trail logging
│       └── Response.php             # JSON/HTML response handler
│
├── public/
│   ├── index.html                   # Routing entry point (HTML5)
│   └── index.php                    # PHP routing handler
│
├── views/
│   ├── auth/
│   │   ├── login.html               # Login form
│   │   ├── register.html            # Registration form
│   │   └── forgot-password.html     # Password reset
│   │
│   ├── dashboard/
│   │   ├── main.html                # Main dashboard view
│   │   ├── accounts.html            # Account summary
│   │   └── transactions.html        # Transaction history
│   │
│   ├── transactions/
│   │   ├── deposit.html             # Deposit interface
│   │   ├── withdrawal.html          # Withdrawal interface
│   │   ├── transfer.html            # Transfer to beneficiary
│   │   └── history.html             # Paginated transaction history
│   │
│   ├── profile/
│   │   ├── view.html                # User profile view
│   │   ├── edit.html                # Profile edit form
│   │   └── change-password.html     # Password change form
│   │
│   └── shared/
│       ├── header.html              # Navigation header
│       ├── footer.html              # Footer component
│       └── error.html               # Error display template
│
└── assets/
    ├── css/
    │   ├── main.css                 # Core styling
    │   ├── responsive.css           # Mobile responsive styles
    │   └── components.css           # Reusable component styles
    │
    └── js/
        ├── app.js                   # Main application logic
        ├── auth.js                  # Authentication handlers
        ├── transactions.js          # Transaction form handlers
        ├── validation.js            # Client-side validation
        ├── api.js                   # API communication layer
        └── utils.js                 # Utility functions

KEY FEATURES:
=============
✓ PDO with prepared statements (SQL injection protection)
✓ password_hash() / password_verify() for secure credentials
✓ Session management with secure tokens
✓ Audit logging for compliance
✓ Input sanitization and validation
✓ Responsive design (mobile-first)
✓ RESTful API endpoints
✓ Role-based access control ready
✓ Transaction atomicity with database transactions
✓ CORS and CSRF protection ready

INSTALLATION:
==============
1. Import database_schema.sql into MySQL
2. Update config/database.php with your database credentials
3. Place application in web server root
4. Ensure PHP 8+ with PDO extension
5. Set appropriate file permissions (750 for directories, 640 for files)
6. Configure .htaccess for URL rewriting
