
        // DOM Elements
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const togglePasswordBtn = document.getElementById('togglePassword');
        const loginBtn = document.getElementById('loginBtn');
        const spinner = document.getElementById('spinner');
        const btnText = document.querySelector('.btn-text');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const rememberMeCheckbox = document.getElementById('rememberMe');

        // Theme Elements
        const themeSwitch = document.getElementById('themeSwitch');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;

        // Form validation patterns
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordMinLength = 8;

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            initializeEventListeners();
            loadRememberedCredentials();
            initializeTheme();
        });

        // Event Listeners
        function initializeEventListeners() {
            // Form submission
            loginForm.addEventListener('submit', handleFormSubmission);
            
            // Real-time validation
            emailInput.addEventListener('input', () => validateEmail());
            emailInput.addEventListener('blur', () => validateEmail());
            
            passwordInput.addEventListener('input', () => {
                validatePassword();
                handlePandaEyes();
            });
            passwordInput.addEventListener('blur', () => {
                validatePassword();
                handlePandaEyes();
            });
            passwordInput.addEventListener('focus', handlePandaEyes);
            
            // Password visibility toggle
            togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
            
            // Social login buttons
            document.querySelector('.google-btn').addEventListener('click', handleGoogleLogin);
            document.querySelector('.github-btn').addEventListener('click', handleGitHubLogin);
            
            // Forgot password link
            document.querySelector('.forgot-password').addEventListener('click', handleForgotPassword);
            
            // Sign up link
            document.querySelector('.signup-link a').addEventListener('click', handleSignUp);
            
            // Theme toggle
            themeSwitch.addEventListener('click', toggleTheme);
            
            // Enter key handling
            document.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !loginBtn.disabled) {
                    handleFormSubmission(e);
                }
            });
        }

        // Form validation functions
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

        // Password visibility toggle
        function togglePasswordVisibility() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            
            const icon = togglePasswordBtn.querySelector('i');
            icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            
            // Add visual feedback
            togglePasswordBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                togglePasswordBtn.style.transform = 'scale(1)';
            }, 150);
        }

        // Panda eye handling function
        function handlePandaEyes() {
            const pandaContainer = document.querySelector('.panda-container');
            const panda = document.querySelector('.panda');
            const leftEye = document.querySelector('.panda-eye.left');
            const rightEye = document.querySelector('.panda-eye.right');
            
            if (!pandaContainer || !panda || !leftEye || !rightEye) return;
            
            const isFocused = document.activeElement === passwordInput;
            const hasValue = passwordInput.value.length > 0;
            
            // Show panda when password field is focused or has value
            if (isFocused || hasValue) {
                pandaContainer.classList.add('show');
                
                // Close eyes when typing (focused and has value)
                if (isFocused && hasValue) {
                    leftEye.classList.add('closed');
                    rightEye.classList.add('closed');
                    panda.classList.add('sleeping');
                } else {
                    // Open eyes when focused but no typing
                    leftEye.classList.remove('closed');
                    rightEye.classList.remove('closed');
                    panda.classList.remove('sleeping');
                }
            } else {
                // Hide panda when not focused and no value
                pandaContainer.classList.remove('show');
                leftEye.classList.remove('closed');
                rightEye.classList.remove('closed');
                panda.classList.remove('sleeping');
            }
        }

        // Form submission handler
        async function handleFormSubmission(e) {
            e.preventDefault();
            
            // Validate all fields
            const isEmailValid = validateEmail();
            const isPasswordValid = validatePassword();
            
            if (!isEmailValid || !isPasswordValid) {
                showNotification('Please fix the validation errors above', 'error');
                return;
            }
            
            // Show loading state
            setLoadingState(true);
            
            try {
                // Simulate API call
                const loginData = {
                    email: emailInput.value.trim(),
                    password: passwordInput.value,
                    rememberMe: rememberMeCheckbox.checked
                };
                
                // Simulate network delay
                await simulateLogin(loginData);
                
                // Handle successful login
                handleSuccessfulLogin(loginData);
                
            } catch (error) {
                // Handle login error
                handleLoginError(error);
            } finally {
                setLoadingState(false);
            }
        }

        // Simulate login API call
        function simulateLogin(loginData) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate different scenarios
                    const random = Math.random();
                    
                    if (random < 0.1) {
                        // 10% chance of network error
                        reject(new Error('Connection timeout. Please check your network.'));
                    } else if (random < 0.2) {
                        // 10% chance of invalid credentials
                        reject(new Error('Invalid credentials. Please verify your email and password.'));
                    } else {
                        // 80% chance of success
                        resolve({
                            success: true,
                            user: {
                                id: 1,
                                email: loginData.email,
                                name: 'John Doe',
                                role: 'Administrator'
                            },
                            token: 'enterprise-jwt-token-' + Date.now()
                        });
                    }
                }, 2500); // 2.5 second delay to show loading state
            });
        }

        // Loading state management
        function setLoadingState(isLoading) {
            if (isLoading) {
                loginBtn.disabled = true;
                loginBtn.classList.add('loading');
                btnText.classList.add('hide');
                spinner.classList.add('show');
            } else {
                loginBtn.disabled = false;
                loginBtn.classList.remove('loading');
                btnText.classList.remove('hide');
                spinner.classList.remove('show');
            }
        }

        // Successful login handler
        function handleSuccessfulLogin(loginData) {
            // Save credentials if remember me is checked
            if (loginData.rememberMe) {
                saveCredentials(loginData.email);
            } else {
                clearCredentials();
            }
            
            // Show success notification
            showNotification('Authentication successful! Redirecting to dashboard...', 'success');
            
            // Simulate redirect after a short delay
            setTimeout(() => {
                // In a real application, you would redirect to the dashboard
                console.log('Redirecting to enterprise dashboard...');
                showNotification('Welcome to the secure portal! Dashboard access granted.', 'success');
            }, 2000);
        }

        // Login error handler
        function handleLoginError(error) {
            showNotification(error.message, 'error');
            
            // Clear password field on error
            passwordInput.value = '';
            passwordInput.focus();
            
            // Reset password validation state
            const passwordWrapper = passwordInput.closest('.input-wrapper');
            setInputState(passwordWrapper, 'error');
            showError(passwordError, error.message);
        }

        // Social login handlers
        function handleGoogleLogin() {
            showNotification('Redirecting to Google Workspace authentication...', 'info');
            // In a real application, you would integrate with Google OAuth
            console.log('Google Workspace login initiated');
        }

        function handleGitHubLogin() {
            showNotification('Redirecting to GitHub Enterprise authentication...', 'info');
            // In a real application, you would integrate with GitHub OAuth
            console.log('GitHub Enterprise login initiated');
        }

        // Forgot password handler
        function handleForgotPassword(e) {
            e.preventDefault();
            // Redirect to reset password page
            window.location.href = 'reset-password.html';
        }

        // Sign up handler
        function handleSignUp(e) {
            e.preventDefault();
            // Redirect to create account page
            window.location.href = 'create-account.html';
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

        // Remember me functionality
        function saveCredentials(email) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberMe', 'true');
        }

        function loadRememberedCredentials() {
            const rememberedEmail = localStorage.getItem('rememberedEmail');
            const rememberMe = localStorage.getItem('rememberMe');
            
            if (rememberedEmail && rememberMe === 'true') {
                emailInput.value = rememberedEmail;
                rememberMeCheckbox.checked = true;
                passwordInput.focus();
            }
        }

        function clearCredentials() {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberMe');
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

        // System theme detection
        function detectSystemTheme() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                // Only auto-switch if user hasn't manually set a preference
                const savedTheme = localStorage.getItem('theme');
                if (!savedTheme) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });
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

            // Add click animation to logo
            const logoContainer = document.querySelector('.logo-container');
            if (logoContainer) {
                logoContainer.addEventListener('click', function() {
                    this.style.transform = 'translateY(-4px) scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'translateY(-4px) scale(1.05)';
                    }, 150);
                    
                    // Show a fun notification
                    showNotification('ðŸ” Secure Access Portal - Professional Authentication System', 'info');
                });
            }
        });

        // Console welcome message
        console.log('%cðŸ” Enterprise Secure Access Portal', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
        console.log('%cProfessional-grade authentication system', 'color: #64748b; font-size: 14px;');
        console.log('%cFeatures: Enterprise security, modern design, dark/light themes, and advanced validation', 'color: #10b981; font-size: 12px;');
    
