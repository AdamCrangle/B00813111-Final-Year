document.addEventListener('DOMContentLoaded', function() {
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;

            if (!username || !password) {alert('Please enter both username and password');return false;}
            else if (username && password){alert('Login successful!');return true;} // Confirmation of successful login}
            
        });
    } 
    else {console.log('Login form not found');}
});
