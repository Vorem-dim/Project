document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validateForm() {
        let isValid = true;
        
        emailError.textContent = '';
        passwordError.textContent = '';
        emailInput.style.borderColor = '#2d3748';
        passwordInput.style.borderColor = '#2d3748';
        
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Пожалуйста, введите email';
            emailInput.style.borderColor = '#fc8181';
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            emailError.textContent = 'Пожалуйста, введите корректный email';
            emailInput.style.borderColor = '#fc8181';
            isValid = false;
        }
        
        if (!passwordInput.value) {
            passwordError.textContent = 'Пожалуйста, введите пароль';
            passwordInput.style.borderColor = '#fc8181';
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            passwordError.textContent = 'Пароль должен содержать не менее 6 символов';
            passwordInput.style.borderColor = '#fc8181';
            isValid = false;
        }
        
        return isValid;
    }
    
    function animateLoginButton(button, success) {
        if (success) {
            button.innerHTML = '<i class="fas fa-check"></i> Успешный вход!';
            button.style.background = 'linear-gradient(to right, #10b981, #059669)';
        } else {
            button.innerHTML = '<i class="fas fa-times"></i> Ошибка входа';
            button.style.background = 'linear-gradient(to right, #ef4444, #dc2626)';
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Войти';
                button.style.background = 'linear-gradient(to right, #20b2aa, #1e90ff)';
                button.disabled = false;
            }, 2000);
        }
    }
    
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const loginBtn = document.querySelector('.login-btn');
            
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Выполняется вход...';
            loginBtn.disabled = true;
            
            setTimeout(() => {
                const formData = new FormData();
                formData.append('login', emailInput.value.trim());
                formData.append('password', passwordInput.value);
                
                fetch('scripts/check_user.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.authorization) {
                        animateLoginButton(loginBtn, true);
                        
                        window.open('http://localhost:4000', '_self');
                    }
                    else {
                        animateLoginButton(loginBtn, false);
                        emailError.textContent = 'Неверный email или пароль';
                        passwordError.textContent = 'Неверный email или пароль';
                        emailInput.style.borderColor = '#fc8181';
                        passwordInput.style.borderColor = '#fc8181';
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
            }, 60);
        }
    });
    
    const togglePasswordBtn = document.getElementById('togglePassword');

    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    setTimeout(() => {
        fetch('scripts/restart_user_session.php', { method: 'POST' })
        .catch(error => { console.error('Ошибка:', error); });
    }, 60);
});