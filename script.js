const PASS_DATA = true;

let currentSlide = 1;
const totalSlides = 4;

const imagesToPreload = [
    'images/bg1.jpg',
    'images/bg2.jpg',
    'images/bg3.jpg',
    'images/bg4.jpg',
    'images/logo-big.png',
    'images/logo-small.png'
];

function preloadImages() {
    return new Promise((resolve) => {
        let loaded = 0;
        const total = imagesToPreload.length;

        imagesToPreload.forEach((src) => {
            const img = new Image();
            img.onload = img.onerror = () => {
                loaded++;
                if (loaded >= total) {
                    resolve();
                }
            };
            img.src = src;
        });

        setTimeout(resolve, 5000);
    });
}

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => {
            const slide1 = document.getElementById('slide1');
            if (slide1) {
                slide1.classList.add('active', 'entering');
            }
        }, 100);
    }
}

function trackEvent(eventName, properties = {}) {
    if (window.vaTrack) {
        window.vaTrack(eventName, properties);
    }
    console.log('Analytics Event:', eventName, properties);
}

function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        subid: urlParams.get('subid') || '',
        clickid: urlParams.get('clickid') || '',
        subid2: urlParams.get('subid2') || ''
    };
}

function encodeEmailToBase64(email) {
    if (!email) return '';
    
    const emailObj = { "email": email };
    const jsonString = JSON.stringify(emailObj);
    
    return btoa(jsonString);
}

function checkReturnVisitor() {
    const hasVisited = localStorage.getItem('footFetishVisited');
    console.log('checkReturnVisitor() called, hasVisited:', hasVisited);
    
    if (hasVisited) {
        const savedEmail = localStorage.getItem('userEmail');
        console.log('Return visitor, saved email:', savedEmail);
        
        trackEvent('Return Visitor Redirect', {
            hasEmail: !!savedEmail
        });
        
        let baseUrl = 'https://ef-to-wz.com/tds/ae?tds_campaign=s7788kru&tdsId=s7788kru_r&s1=int&utm_source=int&utm_term=3&p7={p7}&affid=cf9f103c';
        
        if (PASS_DATA) {
            const params = getUrlParams();
            
            if (savedEmail) {
                const encodedEmail = encodeEmailToBase64(savedEmail);
                console.log('Return visitor encoded email:', encodedEmail);
                baseUrl += `&_fData=${encodedEmail}`;
            }
            
            baseUrl += `&clickid=${params.clickid}&subid=${params.subid}&subid2=${params.subid2}`;
        }
        
        console.log('Return visitor final URL:', baseUrl);
        console.log('Redirecting return visitor...');
        
        window.location.href = baseUrl;
        return true;
    }
    
    return false;
}

function markAsVisited() {
    localStorage.setItem('footFetishVisited', 'true');
    localStorage.setItem('footFetishVisitTime', new Date().getTime());
}

function clearVisitorData() {
    localStorage.removeItem('footFetishVisited');
    localStorage.removeItem('footFetishVisitTime');
    console.log('Visitor data cleared');
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        trackEvent('Slide Transition', {
            from: currentSlide,
            to: currentSlide + 1,
            slideProgress: `${currentSlide}/${totalSlides}`
        });
        
        const currentSlideEl = document.getElementById(`slide${currentSlide}`);
        const nextSlideEl = document.getElementById(`slide${currentSlide + 1}`);
        
        if (currentSlideEl && nextSlideEl) {
            currentSlideEl.classList.remove('entering');
            currentSlideEl.classList.add('exiting');
            
            setTimeout(() => {
                currentSlideEl.classList.remove('active', 'exiting');
                nextSlideEl.classList.add('active', 'entering');
                currentSlide++;
            }, 400);
        }
    }
}

function nextSlideWithEmail() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    if (email && isValidEmail(email)) {
        trackEvent('Email Entered', {
            emailDomain: email.split('@')[1] || 'unknown',
            slideNumber: currentSlide
        });
        
        localStorage.setItem('userEmail', email);
        nextSlide();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

document.addEventListener('DOMContentLoaded', async function() {
    if (checkReturnVisitor()) {
        return;
    }
    
    await preloadImages();
    hidePreloader();
    
    const params = getUrlParams();
    trackEvent('First Time Visitor', {
        hasTrafficParams: !!(params.subid || params.clickid || params.subid2),
        subid: params.subid ? 'yes' : 'no',
        clickid: params.clickid ? 'yes' : 'no'
    });
    
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
    console.log('redirectToSite() called');
    markAsVisited();
    
    const savedEmail = localStorage.getItem('userEmail');
    console.log('Saved email:', savedEmail);
    
    let baseUrl = 'https://ef-to-wz.com/tds/ae?tds_campaign=s7788kru&tdsId=s7788kru_r&s1=int&utm_source=int&utm_term=3&p7={p7}&affid=cf9f103c';
    
    if (PASS_DATA) {
        const params = getUrlParams();
        console.log('URL params:', params);
        
        trackEvent('Completed Journey', {
            hasEmail: !!savedEmail,
            emailDomain: savedEmail ? savedEmail.split('@')[1] : 'none',
            hasTrafficParams: !!(params.subid || params.clickid || params.subid2),
            completedAllSlides: currentSlide === totalSlides
        });
        
        if (savedEmail) {
            const encodedEmail = encodeEmailToBase64(savedEmail);
            console.log('Encoded email:', encodedEmail);
            baseUrl += `&_fData=${encodedEmail}`;
        }
        
        baseUrl += `&clickid=${params.clickid}&subid=${params.subid}&subid2=${params.subid2}`;
    } else {
        trackEvent('Completed Journey', {
            dataPassingDisabled: true,
            completedAllSlides: currentSlide === totalSlides
        });
    }
    
    console.log('Final URL:', baseUrl);
    console.log('Redirecting...');
    
    window.location.href = baseUrl;
}

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

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50 && currentSlide < totalSlides) {
            nextSlide();
        }
    }

    startX = 0;
    startY = 0;
});

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentSlide < totalSlides) {
            nextSlide();
        } else if (currentSlide === totalSlides) {
            redirectToSite();
        }
    }
});
