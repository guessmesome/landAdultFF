let currentSlide = 1;
const totalSlides = 4;

// Check if user has visited before
function checkReturnVisitor() {
    const hasVisited = localStorage.getItem('footFetishVisited');
    
    if (hasVisited) {
        // User has visited before, redirect immediately with saved email
        const savedEmail = localStorage.getItem('userEmail');
        let baseUrl = 'https://wx-to-nm.com/tds/ae?tdsId=s7079gre_r&tds_campaign=s7079gre&s1=int&utm_source=int';
        
        // Add _fData parameter if email exists
        if (savedEmail) {
            const encodedEmail = encodeEmailToBase64(savedEmail);
            baseUrl += `&_fData=${encodedEmail}`;
        }
        
        baseUrl += '&utm_term=1&affid=bf9e8768&subid={subid}&subid2={subid2}&clickid={clickid}';
        
        window.location.href = baseUrl;
        return true;
    }
    
    return false;
}

// Mark user as visited
function markAsVisited() {
    localStorage.setItem('footFetishVisited', 'true');
    localStorage.setItem('footFetishVisitTime', new Date().getTime());
}

// Clear visitor data (for testing - can be called from browser console)
function clearVisitorData() {
    localStorage.removeItem('footFetishVisited');
    localStorage.removeItem('footFetishVisitTime');
    console.log('Visitor data cleared');
}

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
        // Save email to localStorage
        localStorage.setItem('userEmail', email);
        nextSlide();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to encode email to base64 JSON format
function encodeEmailToBase64(email) {
    if (!email) return '';
    
    const emailObj = { "email": email };
    const jsonString = JSON.stringify(emailObj);
    
    // Encode to base64
    return btoa(jsonString);
}

// Email input validation for slide 3
document.addEventListener('DOMContentLoaded', function() {
    // Check for return visitor first
    if (checkReturnVisitor()) {
        return; // Will redirect, no need to continue
    }
    
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
    markAsVisited();
    
    // Get saved email from localStorage
    const savedEmail = localStorage.getItem('userEmail');
    let baseUrl = 'https://wx-to-nm.com/tds/ae?tdsId=s7079gre_r&tds_campaign=s7079gre&s1=int&utm_source=int';
    
    // Add _fData parameter if email exists
    if (savedEmail) {
        const encodedEmail = encodeEmailToBase64(savedEmail);
        baseUrl += `&_fData=${encodedEmail}`;
    }
    
    baseUrl += '&utm_term=1&affid=bf9e8768&subid={subid}&subid2={subid2}&clickid={clickid}';
    
    window.location.href = baseUrl;
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
