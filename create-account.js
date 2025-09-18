
        // DOM Elements
        const registerForm = document.getElementById('registerForm');
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const togglePasswordBtn = document.getElementById('togglePassword');
        const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
        const registerBtn = document.getElementById('registerBtn');
        const spinner = document.getElementById('spinner');
        const btnText = document.querySelector('.btn-text');
        const agreeTermsCheckbox = document.getElementById('agreeTerms');

        // Error elements
        const firstNameError = document.getElementById('firstNameError');
        const lastNameError = document.getElementById('lastNameError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');

        // Password strength elements
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        // Theme Elements
        const themeSwitch = document.getElementById('themeSwitch');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;

        // Form validation patterns
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const namePattern = /^[a-zA-Z\s]{2,50}$/;
        const passwordMinLength = 8;

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            initializeEventListeners();
            initializeTheme();
        });

        // Event Listeners
        function initializeEventListeners() {
            // Form submission
            registerForm.addEventListener('submit', handleFormSubmission);
            
            // Real-time validation
            firstNameInput.addEventListener('input', () => validateName(firstNameInput, firstNameError, 'First name'));
            firstNameInput.addEventListener('blur', () => validateName(firstNameInput, firstNameError, 'First name'));
            
            lastNameInput.addEventListener('input', () => validateName(lastNameInput, lastNameError, 'Last name'));
            lastNameInput.addEventListener('blur', () => validateName(lastNameInput, lastNameError, 'Last name'));
            
            emailInput.addEventListener('input', () => validateEmail());
            emailInput.addEventListener('blur', () => validateEmail());
            
            passwordInput.addEventListener('input', () => {
                validatePassword();
                updatePasswordStrength();
            });
            passwordInput.addEventListener('blur', () => validatePassword());
            
            confirmPasswordInput.addEventListener('input', () => validateConfirmPassword());
            confirmPasswordInput.addEventListener('blur', () => validateConfirmPassword());
            
            // Password visibility toggles
            togglePasswordBtn.addEventListener('click', () => togglePasswordVisibility(passwordInput, togglePasswordBtn));
            toggleConfirmPasswordBtn.addEventListener('click', () => togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn));
            
            // Theme toggle
            themeSwitch.addEventListener('click', toggleTheme);
            
            // Enter key handling
            document.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !registerBtn.disabled) {
                    handleFormSubmission(e);
                }
            });
        }

        // Form validation functions
        function validateName(input, errorElement, fieldName) {
            const value = input.value.trim();
            const inputWrapper = input.closest('.input-wrapper');
            
            if (value === '') {
                showError(errorElement, `${fieldName} is required`);
                setInputState(inputWrapper, 'error');
                return false;
            } else if (!namePattern.test(value)) {
                showError(errorElement, `${fieldName} must be 2-50 characters and contain only letters`);
                setInputState(inputWrapper, 'error');
                return false;
            } else {
                hideError(errorElement);
                setInputState(inputWrapper, 'success');
                return true;
            }
        }

        function validateEmail() {
            const email = emailInput.value.trim();
            const inputWrapper = emailInput.closest('.input-wrapper');
            
            if (email === '') {
                showError(emailError, 'Corporate email is required');
                setInputState(inputWrapper, 'error');
                return false;
            } else if (!emailPattern.test(email)) {
                showError(emailError, 'Please enter a valid corporate email address');
                setInputState(inputWrapper, 'error');
                return false;
            } else {
                hideError(emailError);
                setInputState(inputWrapper, 'success');
                return true;
            }
        }

        function validatePassword() {
            const password = passwordInput.value;
            const inputWrapper = passwordInput.closest('.input-wrapper');
            
            if (password === '') {
                showError(passwordError, 'Secure password is required');
                setInputState(inputWrapper, 'error');
                return false;
            } else if (password.length < passwordMinLength) {
                showError(passwordError, `Password must be at least ${passwordMinLength} characters`);
                setInputState(inputWrapper, 'error');
                return false;
            } else {
                hideError(passwordError);
                setInputState(inputWrapper, 'success');
                return true;
            }
        }

        function validateConfirmPassword() {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const inputWrapper = confirmPasswordInput.closest('.input-wrapper');
            
            if (confirmPassword === '') {
                showError(confirmPasswordError, 'Please confirm your password');
                setInputState(inputWrapper, 'error');
                return false;
            } else if (password !== confirmPassword) {
                showError(confirmPasswordError, 'Passwords do not match');
                setInputState(inputWrapper, 'error');
                return false;
            } else {
                hideError(confirmPasswordError);
                setInputState(inputWrapper, 'success');
                return true;
            }
        }

        // Password strength calculation
        function updatePasswordStrength() {
            const password = passwordInput.value;
            const strength = calculatePasswordStrength(password);
            
            strengthFill.className = 'strength-fill';
            strengthFill.classList.add(strength.level);
            strengthText.textContent = strength.text;
        }

        function calculatePasswordStrength(password) {
            let score = 0;
            let feedback = [];

            if (password.length >= 8) score += 1;
            else feedback.push('at least 8 characters');

            if (/[a-z]/.test(password)) score += 1;
            else feedback.push('lowercase letters');

            if (/[A-Z]/.test(password)) score += 1;
            else feedback.push('uppercase letters');

            if (/[0-9]/.test(password)) score += 1;
            else feedback.push('numbers');

            if (/[^A-Za-z0-9]/.test(password)) score += 1;
            else feedback.push('special characters');

            if (score < 2) {
                return { level: 'weak', text: 'Weak password' };
            } else if (score < 3) {
                return { level: 'fair', text: 'Fair password' };
            } else if (score < 4) {
                return { level: 'good', text: 'Good password' };
            } else {
                return { level: 'strong', text: 'Strong password' };
            }
        }

        // Password visibility toggle
        function togglePasswordVisibility(input, button) {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            
            const icon = button.querySelector('i');
            icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            
            // Add visual feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }

        // Input state management
        function setInputState(inputWrapper, state) {
            inputWrapper.classList.remove('success', 'error');
            if (state !== 'normal') {
                inputWrapper.classList.add(state);
            }
        }

        function showError(errorElement, message) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        function hideError(errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }

        // Form submission handler
        async function handleFormSubmission(e) {
            e.preventDefault();
            
            // Validate all fields
            const isFirstNameValid = validateName(firstNameInput, firstNameError, 'First name');
            const isLastNameValid = validateName(lastNameInput, lastNameError, 'Last name');
            const isEmailValid = validateEmail();
            const isPasswordValid = validatePassword();
            const isConfirmPasswordValid = validateConfirmPassword();
            
            // Check terms agreement
            if (!agreeTermsCheckbox.checked) {
                showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
                return;
            }
            
            if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
                showNotification('Please fix the validation errors above', 'error');
                return;
            }
            
            // Show loading state
            setLoadingState(true);
            
            try {
                // Simulate API call
                const registrationData = {
                    firstName: firstNameInput.value.trim(),
                    lastName: lastNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value,
                    agreeTerms: agreeTermsCheckbox.checked
                };
                
                // Simulate network delay
                await simulateRegistration(registrationData);
                
                // Handle successful registration
                handleSuccessfulRegistration(registrationData);
                
            } catch (error) {
                // Handle registration error
                handleRegistrationError(error);
            } finally {
                setLoadingState(false);
            }
        }

        // Simulate registration API call
        function simulateRegistration(registrationData) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate different scenarios
                    const random = Math.random();
                    
                    if (random < 0.1) {
                        // 10% chance of network error
                        reject(new Error('Connection timeout. Please check your network.'));
                    } else if (random < 0.2) {
                        // 10% chance of email already exists
                        reject(new Error('An account with this email already exists.'));
                    } else {
                        // 80% chance of success
                        resolve({
                            success: true,
                            user: {
                                id: Date.now(),
                                firstName: registrationData.firstName,
                                lastName: registrationData.lastName,
                                email: registrationData.email
                            },
                            message: 'Account created successfully'
                        });
                    }
                }, 3000); // 3 second delay
            });
        }

        // Loading state management
        function setLoadingState(isLoading) {
            if (isLoading) {
                registerBtn.disabled = true;
                registerBtn.classList.add('loading');
                btnText.classList.add('hide');
                spinner.classList.add('show');
            } else {
                registerBtn.disabled = false;
                registerBtn.classList.remove('loading');
                btnText.classList.remove('hide');
                spinner.classList.remove('show');
            }
        }

        // Successful registration handler
        function handleSuccessfulRegistration(registrationData) {
            showNotification('Account created successfully! Redirecting to login...', 'success');
            
            // Clear form
            registerForm.reset();
            
            // Update button text temporarily
            btnText.textContent = 'Account Created!';
            setTimeout(() => {
                btnText.textContent = 'Create Secure Account';
                // Redirect to login page
                window.location.href = 'professional-login.html';
            }, 2000);
        }

        // Registration error handler
        function handleRegistrationError(error) {
            showNotification(error.message, 'error');
            
            // Focus on email field if email already exists
            if (error.message.includes('email already exists')) {
                emailInput.focus();
                const emailWrapper = emailInput.closest('.input-wrapper');
                setInputState(emailWrapper, 'error');
                showError(emailError, error.message);
            }
        }

        // Notification system
        function showNotification(message, type = 'info') {
            // Remove existing notifications
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                    <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Add styles
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${getNotificationColor(type)};
                color: white;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                max-width: 400px;
                animation: slideInRight 0.3s ease-out;
            `;
            
            // Add to document
            document.body.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.animation = 'slideOutRight 0.3s ease-in';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 5000);
        }

        function getNotificationIcon(type) {
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };
            return icons[type] || icons.info;
        }

        function getNotificationColor(type) {
            const colors = {
                success: 'linear-gradient(135deg, #10b981, #059669)',
                error: 'linear-gradient(135deg, #ef4444, #dc2626)',
                warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
                info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
            };
            return colors[type] || colors.info;
        }

        // Theme Management Functions
        function initializeTheme() {
            // Check for saved theme preference or default to light mode
            const savedTheme = localStorage.getItem('theme') || 'light';
            setTheme(savedTheme);
        }

        function toggleTheme() {
            const currentTheme = body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            
            // Add click animation
            themeSwitch.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeSwitch.style.transform = 'scale(1)';
            }, 150);
            
            // Show notification
            showNotification(`Switched to ${newTheme} mode`, 'info');
        }

        function setTheme(theme) {
            // Set theme attribute on body
            body.setAttribute('data-theme', theme);
            
            // Update theme icon
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-moon';
                themeSwitch.classList.add('dark');
            } else {
                themeIcon.className = 'fas fa-sun';
                themeSwitch.classList.remove('dark');
            }
            
            // Save theme preference
            localStorage.setItem('theme', theme);
            
            // Update meta theme-color for mobile browsers
            updateMetaThemeColor(theme);
        }

        function updateMetaThemeColor(theme) {
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                metaThemeColor.name = 'theme-color';
                document.head.appendChild(metaThemeColor);
            }
            
            // Set theme color based on current theme
            if (theme === 'dark') {
                metaThemeColor.content = '#0f172a';
            } else {
                metaThemeColor.content = '#2563eb';
            }
        }

        // Add some interactive feedback
        document.addEventListener('DOMContentLoaded', function() {
            // Add hover effects to form elements
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.closest('.form-group').style.transform = 'scale(1.01)';
                });
                
                input.addEventListener('blur', function() {
                    this.closest('.form-group').style.transform = 'scale(1)';
                });
            });
            
            // Add click animation to buttons
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                });
            });
        });

        // Console welcome message
        console.log('%cðŸ‘¤ Account Registration Portal', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
        console.log('%cSecure account creation system', 'color: #64748b; font-size: 14px;');
        console.log('%cProfessional enterprise registration', 'color: #10b981; font-size: 12px;');
    
