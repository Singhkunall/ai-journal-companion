// Add fade-in animation to elements
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.card, .navbar, .hero-section');
    elements.forEach(element => {
        element.classList.add('fade-in');
    });
});

// Auto-resize textarea
const textarea = document.querySelector('textarea');
if (textarea) {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

// Character counter for journal entry
const contentInput = document.getElementById('content');
if (contentInput) {
    const counter = document.createElement('div');
    counter.className = 'form-text text-end';
    counter.id = 'charCounter';
    contentInput.parentNode.appendChild(counter);

    contentInput.addEventListener('input', function() {
        const remaining = 50 - this.value.length;
        counter.textContent = remaining > 0 ? 
            `${remaining} characters minimum required` : 
            'Minimum character requirement met';
        counter.style.color = remaining > 0 ? '#dc3545' : '#198754';
    });
}

// Mood color indicator
const moodSelect = document.getElementById('mood');
if (moodSelect) {
    moodSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        selectedOption.style.backgroundColor = getMoodColor(this.value);
    });
}

function getMoodColor(mood) {
    const colors = {
        'Happy': '#198754',
        'Neutral': '#ffc107',
        'Sad': '#dc3545',
        'Anxious': '#fd7e14',
        'Excited': '#0dcaf0',
        'Calm': '#6f42c1'
    };
    return colors[mood] || '#6c757d';
}

// Print functionality
function printEntry() {
    window.print();
}

// Form validation
const journalForm = document.getElementById('journalForm');
if (journalForm) {
    journalForm.addEventListener('submit', function(e) {
        const content = document.getElementById('content').value;
        if (content.length < 50) {
            e.preventDefault();
            alert('Please write at least 50 characters to get meaningful AI insights.');
        }
    });
}

// Responsive navbar toggle
const navbarToggler = document.querySelector('.navbar-toggler');
if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        navbarCollapse.classList.toggle('show');
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Loading indicator
function showLoading() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.id = 'loadingSpinner';
    document.body.appendChild(spinner);
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.remove();
    }
}

// Add loading indicator to form submissions
if (journalForm) {
    journalForm.addEventListener('submit', showLoading);
}

// Handle AJAX form submissions
document.addEventListener('submit', function(e) {
    if (e.target.matches('form[data-ajax="true"]')) {
        e.preventDefault();
        showLoading();
        
        const formData = new FormData(e.target);
        fetch(e.target.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                alert(data.message || 'An error occurred');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while processing your request');
        })
        .finally(() => {
            hideLoading();
        });
    }
}); 