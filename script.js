let currentSlide = 1;
const totalSlides = 4;

function nextSlide() {
    if (currentSlide < totalSlides) {
        // Hide current slide
        document.getElementById(`slide${currentSlide}`).classList.remove('active');
        
        // Show next slide
        currentSlide++;
        document.getElementById(`slide${currentSlide}`).classList.add('active');
    }
}

function nextSlideWithEmail() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    // Check if email is valid
    if (email && isValidEmail(email)) {
        nextSlide();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Email input validation for slide 3
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('emailInput');
    const continueBtn = document.getElementById('continueBtn3');
    
    if (emailInput && continueBtn) {
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            
            if (email && isValidEmail(email)) {
                continueBtn.disabled = false;
                continueBtn.classList.remove('disabled');
            } else {
                continueBtn.disabled = true;
                continueBtn.classList.add('disabled');
            }
        });
    }
});

function redirectToSite() {
    window.location.href = 'https://datersluv.com/tds/ae?tds_campaign=s7090kru&tdsId=s7090kru_r&s1=int&utm_source=int&utm_sub=opnfnl&utm_term=2&clickid=%7Bclickid%7D&subid=%7Bsubid%7D&subid2=%7Bsubid2%7D&affid=cf9f103c';
}

// Touch/swipe functionality for mobile
let startX = 0;
let startY = 0;

document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!startX || !startY) {
        return;
    }

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let diffX = startX - endX;
    let diffY = startY - endY;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Swipe left (next slide)
        if (diffX > 50 && currentSlide < totalSlides) {
            nextSlide();
        }
    }

    startX = 0;
    startY = 0;
});

// Prevent scroll on mobile
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentSlide < totalSlides) {
            nextSlide();
        } else if (currentSlide === totalSlides) {
            redirectToSite();
        }
    }
});
