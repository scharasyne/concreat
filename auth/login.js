// Login functionality
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.selectedRole = null;
        this.initializeEventListeners();
        this.loadDemoUsers();
    }

    loadDemoUsers() {
        // Demo users for testing
        this.users = {
            admin: [
                { username: 'admin', password: 'admin123', name: 'John Administrator', role: 'admin' },
                { username: 'superintendent', password: 'super123', name: 'Sarah Superintendent', role: 'admin' }
            ],
            student: [
                { username: 'student1', password: 'pass123', name: 'Mike Johnson', role: 'student' },
                { username: 'student2', password: 'pass123', name: 'Emily Davis', role: 'student' },
                { username: 'john.doe', password: 'john123', name: 'John Doe', role: 'student' }
            ]
        };
    }

    initializeEventListeners() {
        // Role selection
        document.querySelectorAll('.role-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.role-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedRole = option.dataset.role;
            });
        });

        // Form submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Set default role
        document.querySelector('[data-role="student"]').click();
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorMessage = document.getElementById('errorMessage');

        if (!this.selectedRole) {
            this.showError('Please select a role');
            return;
        }

        if (!username || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        // Check credentials
        const user = this.authenticateUser(username, password, this.selectedRole);
        
        if (user) {
            this.loginSuccess(user);
        } else {
            this.showError('Invalid credentials. Please try again.');
        }
    }

    authenticateUser(username, password, role) {
        const roleUsers = this.users[role] || [];
        return roleUsers.find(user => 
            (user.username === username || user.email === username) && 
            user.password === password
        );
    }

    loginSuccess(user) {
        // Store user session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.setItem('loginTime', new Date().toISOString());

        // Redirect based on role
        if (user.role === 'admin') {
            window.location.href = '../admin/dashboard.html';
        } else if (user.role === 'student') {
            window.location.href = '../student/dashboard.html';
        }
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    // Static method to check if user is logged in
    static getCurrentUser() {
        const userData = sessionStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    // Static method to logout
    static logout() {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('loginTime');
        window.location.href = '../auth/login.html';
    }

    // Static method to check session validity
    static isSessionValid() {
        const loginTime = sessionStorage.getItem('loginTime');
        if (!loginTime) return false;

        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);

        // Session expires after 8 hours
        return hoursSinceLogin < 8;
    }
}

// Initialize auth manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Global auth utilities
window.AuthUtils = {
    getCurrentUser: AuthManager.getCurrentUser,
    logout: AuthManager.logout,
    isSessionValid: AuthManager.isSessionValid,
    
    // Protect pages that require authentication
    requireAuth: function(requiredRole = null) {
        const user = this.getCurrentUser();
        
        if (!user || !this.isSessionValid()) {
            window.location.href = '../auth/login.html';
            return false;
        }
        
        if (requiredRole && user.role !== requiredRole) {
            alert('Access denied. You do not have permission to view this page.');
            window.location.href = '../auth/login.html';
            return false;
        }
        
        return true;
    }
};