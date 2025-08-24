// Authentication functions
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        showApp();
    } else {
        showAuth();
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            loginUser(email, password);
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            registerUser(name, email, password);
        });
    }
    
    // Switch between login and signup
    const showSignupLink = document.getElementById('show-signup');
    if (showSignupLink) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('signup-container').style.display = 'flex';
        });
    }
    
    const showLoginLink = document.getElementById('show-login');
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('signup-container').style.display = 'none';
            document.getElementById('login-container').style.display = 'flex';
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logoutUser();
        });
    }
});

function showAuth() {
    document.getElementById('auth-screens').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
}

function showApp() {
    document.getElementById('auth-screens').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    loadAppData();
}

function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        saveCurrentUser(user);
        showApp();
        return true;
    } else {
        alert('Invalid email or password!');
        return false;
    }
}

function registerUser(name, email, password) {
    const users = getUsers();
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        alert('User with this email already exists!');
        return false;
    }
    
    // Create new user
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email,
        password,
        points: 0,
        level: 1,
        joined: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        location: "Kerala, India",
        visitedDestinations: [],
        friends: [],
        friendRequests: []
    };
    
    users.push(newUser);
    saveUsers(users);
    saveCurrentUser(newUser);
    
    // Add registration activity
    addActivity({
        userId: newUser.id,
        type: 'system',
        message: 'Joined Kilometers and Kilometers',
        time: 'Just now',
        points: 0
    });
    
    showApp();
    return true;
}

function logoutUser() {
    saveCurrentUser(null);
    showAuth();
}