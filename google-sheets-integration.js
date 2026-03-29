// Google Sheets Integration for AYP Tech Contact Forms
// This script handles form submissions and sends data to Google Sheets

class GoogleSheetsIntegration {
    constructor() {
        // Replace with your Google Apps Script Web App URL
        this.scriptURL = 'https://script.google.com/macros/s/AKfycbz1kbtTskP-DTDhgDV9vUdt5NfnC4rZt0uc32BsWKFX4rs9lMqdfuz0xMGmcTPSapaNMQ/exec';
        this.init();
    }

    init() {
        // Initialize form handlers
        this.setupContactForm();
        this.setupNewsletterForm();
    }

    setupContactForm() {
        const contactForm = document.querySelector('.contact-form-main');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmission(e));
        }
    }

    setupNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmission(e));
        }
    }

    async handleContactSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        form.classList.add('loading');

        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {
                timestamp: new Date().toISOString(),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company'),
                industry: formData.get('industry'),
                service: formData.get('service'),
                teamSize: formData.get('teamSize'),
                budget: formData.get('budget'),
                timeline: formData.get('timeline'),
                message: formData.get('message'),
                newsletter: formData.get('newsletter') || 'no',
                source: 'Contact Form',
                page: window.location.pathname
            };

            // Send to Google Sheets
            const response = await fetch(this.scriptURL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                // Success
                this.showSuccess(form, submitBtn, originalText);
                form.reset();
                
                // Send confirmation email (optional)
                this.sendConfirmationEmail(data.email, data.firstName);
                
            } else {
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.error('Error:', error);
            this.showError(submitBtn, originalText);
        }

        form.classList.remove('loading');
    }

    async handleNewsletterSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const emailInput = form.querySelector('input[type="email"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitBtn.disabled = true;

        try {
            const data = {
                timestamp: new Date().toISOString(),
                email: emailInput.value,
                source: 'Newsletter',
                page: window.location.pathname
            };

            const response = await fetch(this.scriptURL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                form.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
                
                this.showNotification('Successfully subscribed to newsletter!', 'success');
            } else {
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.error('Error:', error);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.showNotification('Subscription failed. Please try again.', 'error');
        }
    }

    showSuccess(form, submitBtn, originalText) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
        
        this.showNotification('Message sent successfully! We\'ll get back to you within 2 hours.', 'success');
    }

    showError(submitBtn, originalText) {
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error - Try Again';
        submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
        
        this.showNotification('Failed to send message. Please try again or call us directly.', 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(99, 102, 241, 0.9)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 0.5rem;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    async sendConfirmationEmail(email, firstName) {
        // Optional: Send confirmation email via your backend
        try {
            await fetch('/api/send-confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    firstName: firstName
                })
            });
        } catch (error) {
            console.log('Confirmation email not sent:', error);
        }
    }
}

// Initialize Google Sheets integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new GoogleSheetsIntegration();
});

// Export for use in other scripts
window.GoogleSheetsIntegration = GoogleSheetsIntegration;