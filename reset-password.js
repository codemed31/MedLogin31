
        // DOM Elements
        const resetForm = document.getElementById('resetForm');
        const emailInput = document.getElementById('email');
        const resetBtn = document.getElementById('resetBtn');
        const spinner = document.getElementById('spinner');
        const btnText = document.querySelector('.btn-text');
        const emailError = document.getElementById('emailError');

        // Theme Elements
        const themeSwitch = document.getElementById('themeSwitch');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;

        // Form validation patterns
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            initializeEventListeners();
            initializeTheme();
        });

        // Event Listeners
        function initializeEventListeners() {
            // Form submission
            resetForm.addEventListener('submit', handleFormSubmission);
            
            // Real-time validation
            emailInput.addEventListener('input', () => validateEmail());
            emailInput.addEventListener('blur', () => validateEmail());
            
            // Theme toggle
            themeSwitch.addEventListener('click', toggleTheme);
            
            // Enter key handling
            document.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !resetBtn.disabled) {
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
            
            // Validate email
            const isEmailValid = validateEmail();
            
            if (!isEmailValid) {
                showNotification('Please fix the validation errors above', 'error');
                return;
            }
            
            // Show loading state
            setLoadingState(true);
            
            try {
                // Simulate API call
                const email = emailInput.value.trim();
                
                // Simulate network delay
                await simulatePasswordReset(email);
                
                // Handle successful reset request
                handleSuccessfulReset(email);
                
            } catch (error) {
                // Handle reset error
                handleResetError(error);
            } finally {
                setLoadingState(false);
            }
        }

        // Simulate password reset API call
        function simulatePasswordReset(email) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate different scenarios
                    const random = Math.random();
                    
                    if (random < 0.1) {
                        // 10% chance of network error
                        reject(new Error('Connection timeout. Please check your network.'));
                    } else if (random < 0.2) {
                        // 10% chance of email not found
                        reject(new Error('Email address not found in our system.'));
                    } else {
                        // 80% chance of success
                        resolve({
                            success: true,
                            message: 'Reset instructions sent successfully'
                        });
                    }
                }, 2000); // 2 second delay
            });
        }

        // Loading state management
        function setLoadingState(isLoading) {
            if (isLoading) {
                resetBtn.disabled = true;
                resetBtn.classList.add('loading');
                btnText.classList.add('hide');
                spinner.classList.add('show');
            } else {
                resetBtn.disabled = false;
                resetBtn.classList.remove('loading');
                btnText.classList.remove('hide');
                spinner.classList.remove('show');
            }
        }

        // Successful reset handler
        function handleSuccessfulReset(email) {
            showNotification(`Password reset instructions sent to ${email}`, 'success');
            
            // Clear form
            emailInput.value = '';
            
            // Update button text temporarily
            btnText.textContent = 'Instructions Sent!';
            setTimeout(() => {
                btnText.textContent = 'Send Reset Instructions';
            }, 3000);
        }

        // Reset error handler
        function handleResetError(error) {
            showNotification(error.message, 'error');
            
            // Reset email validation state
            const emailWrapper = emailInput.closest('.input-wrapper');
            setInputState(emailWrapper, 'error');
            showError(emailError, error.message);
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
        console.log('%cðŸ”‘ Password Reset Portal', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
        console.log('%cSecure password reset system', 'color: #64748b; font-size: 14px;');
        console.log('%cProfessional enterprise authentication', 'color: #10b981; font-size: 12px;');
    
