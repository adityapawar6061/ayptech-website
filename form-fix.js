// Quick Fix for AYP Tech Contact Form
// Add this script to your live website to fix the form submission

(function() {
    'use strict';
    
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz1kbtTskP-DTDhgDV9vUdt5NfnC4rZt0uc32BsWKFX4rs9lMqdfuz0xMGmcTPSapaNMQ/exec';
    
    console.log('AYP Tech Form Fix loaded');
    
    function showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    async function handleFormSubmission(form, e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Collect form data
            const formData = new FormData(form);
            
            // Handle different form structures
            let firstName = formData.get('firstName') || '';
            let lastName = formData.get('lastName') || '';
            
            // If no firstName/lastName, try to split 'name' field
            if (!firstName && !lastName && formData.get('name')) {
                const nameParts = formData.get('name').trim().split(' ');
                firstName = nameParts[0] || '';
                lastName = nameParts.slice(1).join(' ') || '';
            }
            
            const data = {
                timestamp: new Date().toISOString(),
                firstName: firstName,
                lastName: lastName,
                email: formData.get('email') || '',
                phone: formData.get('phone') || '',
                company: formData.get('company') || '',
                industry: formData.get('industry') || '',
                service: formData.get('service') || '',
                teamSize: formData.get('teamSize') || '',
                budget: formData.get('budget') || '',
                timeline: formData.get('timeline') || '',
                message: formData.get('message') || '',
                newsletter: formData.get('newsletter') || 'no',
                source: 'Contact Form',
                page: window.location.pathname
            };
            
            console.log('Sending data:', data);
            
            // Send to Google Sheets
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(data)
            });
            
            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Parse error:', parseError);
                throw new Error('Invalid response from server');
            }
            
            if (result.status === 'success') {
                // Success
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = '#10b981';
                form.reset();
                
                showNotification('Message sent successfully! We\'ll get back to you within 2 hours.', 'success');
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
                
            } else {
                throw new Error(result.message || 'Unknown error occurred');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error - Try Again';
            submitBtn.style.background = '#ef4444';
            
            showNotification('Failed to send message: ' + error.message + '. Please try again or call us directly.', 'error');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }
    }
    
    // Initialize when DOM is ready
    function init() {
        console.log('Initializing AYP Tech form fix...');
        
        // Find all contact forms
        const forms = document.querySelectorAll('form.contact-form, form.contact-form-main, form[class*="contact"]');
        
        console.log('Found', forms.length, 'contact forms');
        
        forms.forEach((form, index) => {
            console.log('Setting up form', index + 1);
            
            // Remove existing event listeners by cloning the form
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            // Add new event listener
            newForm.addEventListener('submit', (e) => {
                console.log('Form submitted');
                handleFormSubmission(newForm, e);
            });
        });
        
        console.log('AYP Tech form fix initialized successfully');
    }
    
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();