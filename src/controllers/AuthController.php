<?php
/**
 * Auth Controller - Authentication operations
 * CORS headers are handled centrally in Router.php — do not duplicate here.
 */

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class AuthController {
    
    /**
     * Register New User
     */
    public static function register() {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            Response::error('Invalid request body', 400);
        }

        // Sanitize string fields before validation
        $stringFields = ['email', 'first_name', 'last_name', 'phone_number',
                         'date_of_birth', 'address', 'city', 'state', 'zip_code', 'country'];
        foreach ($stringFields as $field) {
            if (isset($input[$field]) && is_string($input[$field])) {
                $input[$field] = trim($input[$field]);
            }
        }
        if (isset($input['email'])) {
            $input['email'] = strtolower($input['email']);
        }
        
        // Register user
        $result = User::create($input);
        
        if (!$result['success']) {
            // Use 409 Conflict for duplicate email
            if (isset($result['code']) && $result['code'] === 'email_exists') {
                Response::error($result['message'], 409);
            }
            Response::error(
                $result['message'],
                isset($result['errors']) ? 422 : 400,
                $result['errors'] ?? []
            );
        }
        
        Response::success([
            'user_id' => $result['user_id'],
            'message' => 'Registration successful. Please log in.'
        ], 'User registered successfully', 201);
    }
    
    /**
     * Login User
     */
    public static function login() {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || empty($input['email']) || empty($input['password'])) {
            Response::validationError(['email' => 'Email and password required']);
        }

        // Sanitize email
        $email = strtolower(trim($input['email']));
        $password = $input['password'];
        
        // Authenticate
        $result = AuthMiddleware::authenticate($email, $password);
        
        if (!$result['success']) {
            Response::error($result['message'], 401);
        }
        
        Response::success([
            'user' => $result['user'],
            'token' => $result['token'],
            'session_id' => $result['session_id']
        ], 'Login successful', 200);
    }
    
    /**
     * Logout User
     */
    public static function logout() {
        AuthMiddleware::destroySession();
        Response::success(null, 'Logout successful');
    }
    
    /**
     * Get Current User
     */
    public static function getCurrentUser() {
        $user = AuthMiddleware::getCurrentUser();
        
        if (!$user) {
            Response::unauthorized();
        }
        
        // Get user accounts
        require_once __DIR__ . '/../models/Account.php';
        $accounts = Account::getByUserId($user['user_id']);
        
        Response::success([
            'user' => $user,
            'accounts' => $accounts
        ], 'User data retrieved');
    }
}
?>
