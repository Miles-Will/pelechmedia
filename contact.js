// Contact form functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize form functionality
    initializeContactForm();

    // Initialize date field toggle
    setupDateFieldToggle();
});

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            if (!isValidEmail(data.email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission (replace with actual submission logic)
            submitForm(data);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitForm(data) {
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'SENDING...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with your actual form handler)
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Show success message
        showMessage('Thank you! Your message has been sent successfully.', 'success');

        // Reset form
        document.getElementById('contactForm').reset();

        // Here you would typically send the data to your server
        // Example: fetch('/submit-contact', { method: 'POST', body: formData })

    }, 2000);
}

function showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;

    // Insert message before the form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageEl, form);

    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Date field toggle functionality
function setupDateFieldToggle() {
    const dateInput = document.getElementById('date');

    if (!dateInput) return;

    let isOpen = false;

    // Enhanced click handler
    dateInput.addEventListener('click', function (e) {
        e.preventDefault();

        if (!isOpen) {
            // Open the calendar
            this.focus();
            if (this.showPicker) {
                this.showPicker(); // Chrome 99+, Firefox 101+
            }
            isOpen = true;
        } else {
            // Close the calendar
            this.blur();
            isOpen = false;
        }
    });

    // Reset state when calendar closes naturally
    dateInput.addEventListener('blur', function () {
        setTimeout(() => {
            isOpen = false;
        }, 100);
    });

    // Handle keyboard interactions
    dateInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            this.blur();
            isOpen = false;
        }
    });

    // Handle change event to close calendar after selection
    dateInput.addEventListener('change', function () {
        isOpen = false;
    });
}