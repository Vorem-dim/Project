document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const birthDateInput = document.getElementById('birthDate');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    const firstNameError = document.getElementById('firstName-error');
    const lastNameError = document.getElementById('lastName-error');
    const emailError = document.getElementById('email-error');
    const birthDateError = document.getElementById('birthDate-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirmPassword-error');
    
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text span');
    
    function checkPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
        
        return strength;
    }
    
    function updatePasswordStrength() {
        const password = passwordInput.value;
        const strength = checkPasswordStrength(password);
        
        let strengthPercent = 0;
        let strengthLabel = '';
        let strengthColor = '';
        
        if (password.length === 0) {
            strengthPercent = 0;
            strengthLabel = 'не указан';
            strengthColor = '#4a5568';
        } else if (strength <= 2) {
            strengthPercent = 33;
            strengthLabel = 'низкая';
            strengthColor = '#fc8181';
        } else if (strength <= 4) {
            strengthPercent = 66;
            strengthLabel = 'средняя';
            strengthColor = '#f6ad55';
        } else {
            strengthPercent = 100;
            strengthLabel = 'высокая';
            strengthColor = '#68d391';
        }
        
        strengthBar.style.setProperty('--strength-color', strengthColor);
        strengthBar.style.width = strengthPercent + '%';
        strengthBar.style.backgroundColor = strengthColor;
        strengthText.textContent = strengthLabel;
        strengthText.style.color = strengthColor;
    }
    
    passwordInput.addEventListener('input', updatePasswordStrength);
    
    function validateBirthDate(dateString) {
        if (!dateString) return false;
        
        const birthDate = new Date(dateString);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 8;
        }

        return age >= 8;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function resetErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
        
        const inputElements = document.querySelectorAll('.input-group input');
        inputElements.forEach(el => el.style.borderColor = '#2d3748');
    }
    
    function validateForm() {
        let isValid = true;
        resetErrors();
        
        if (!firstNameInput.value.trim()) {
            firstNameError.textContent = 'Пожалуйста, введите ваше имя';
            firstNameInput.style.borderColor = '#fc8181';
            isValid = false;
        } else if (firstNameInput.value.trim().length < 2) {
            firstNameError.textContent = 'Имя должно содержать не менее 2 символов';
            firstNameInput.style.borderColor = '#fc8181';
            isValid = false;
        }
        
        if (!birthDateInput.value) {
            birthDateError.textContent = 'Пожалуйста, укажите дату рождения';
            birthDateInput.style.borderColor = '#fc8181';
            isValid = false;
        } else if (!validateBirthDate(birthDateInput.value)) {
            birthDateError.textContent = 'Вы должны быть старше 8 лет для регистрации';
            birthDateInput.style.borderColor = '#fc8181';
            isValid = false;
        }
        
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
            passwordError.textContent = 'Пожалуйста, придумайте пароль';
            passwordInput.style.borderColor = '#fc8181';
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            passwordError.textContent = 'Пароль должен содержать не менее 6 символов';
            passwordInput.style.borderColor = '#fc8181';
            isValid = false;
        } else {
            const strength = checkPasswordStrength(passwordInput.value);
            if (strength < 2) {
                passwordError.textContent = 'Пароль слишком простой. Добавьте заглавные буквы, цифры или специальные символы';
                passwordInput.style.borderColor = '#f6ad55';
            }
        }
        
        if (!confirmPasswordInput.value) {
            confirmPasswordError.textContent = 'Пожалуйста, подтвердите пароль';
            confirmPasswordInput.style.borderColor = '#fc8181';
            isValid = false;
        } else if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordError.textContent = 'Пароли не совпадают';
            confirmPasswordInput.style.borderColor = '#fc8181';
            isValid = false;
        }
        
        return isValid;
    }
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm()) {
            const registerBtn = document.querySelector('.register-btn');
            const originalText = registerBtn.innerHTML;

            registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
            registerBtn.disabled = true;

            setTimeout(() => {
                const formData = new FormData();
                formData.append('firstName', firstNameInput.value);
                formData.append('lastName', lastNameInput.value);
                formData.append('birthDate', birthDateInput.value);
                formData.append('login', emailInput.value.trim());
                formData.append('password', passwordInput.value);

                fetch('scripts/add_user.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.registration) {
                        window.location.href = 'http://localhost:4000/authentication/authentication.html';
                    }
                    else {
                        registerBtn.innerHTML = originalText;
                        registerBtn.disabled = false;

                        emailError.textContent = data.message;
                        emailInput.style.borderColor = '#fc8181';
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
            }, 60);
        }
    });

    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
    
    toggleConfirmPasswordBtn.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
});