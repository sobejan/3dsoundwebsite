/* ==========================================================
   3D SOUND & ENTERTAINMENT — Main Script
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------
       NAV — scroll background + hamburger toggle
       -------------------------------------------------- */
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');

    // Solid nav on scroll
    const handleNavScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // Fullscreen menu toggle
    menuToggle.addEventListener('click', () => {
        const isOpen = menuOverlay.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    document.querySelectorAll('.menu-overlay__link').forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    /* --------------------------------------------------
       SMOOTH SCROLL for anchor links
       -------------------------------------------------- */
    const isMobile = () => window.innerWidth <= 768;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const offset = isMobile() ? 60 : 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    /* --------------------------------------------------
       SCROLL ANIMATIONS — Intersection Observer
       -------------------------------------------------- */
    const animElements = document.querySelectorAll('.anim-fade');

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll(':scope > .anim-fade');
                let delay = 0;
                siblings.forEach((el, i) => {
                    if (el === entry.target) delay = i * (isMobile() ? 40 : 80);
                });
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                animObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: isMobile() ? 0.03 : 0.08,
        rootMargin: isMobile() ? '0px 0px -20px 0px' : '0px 0px -40px 0px'
    });

    animElements.forEach(el => animObserver.observe(el));


    /* --------------------------------------------------
       COUNTER ANIMATION
       -------------------------------------------------- */
    const counters = document.querySelectorAll('[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(tick);
    }




    /* --------------------------------------------------
       TESTIMONIALS CAROUSEL
       -------------------------------------------------- */
    const slides = document.querySelectorAll('.testimonials__slide');
    const dotsContainer = document.getElementById('testimonialDots');
    let currentSlide = 0;
    let testimonialInterval;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('testimonials__dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dotsContainer.children[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dotsContainer.children[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startCarousel() {
        testimonialInterval = setInterval(nextSlide, 5000);
    }

    function stopCarousel() {
        clearInterval(testimonialInterval);
    }

    startCarousel();

    // Pause on hover (desktop)
    const carousel = document.querySelector('.testimonials__carousel');
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);

    // Touch swipe support for testimonials
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopCarousel();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left: next slide
                goToSlide((currentSlide + 1) % slides.length);
            } else {
                // Swipe right: previous slide
                goToSlide((currentSlide - 1 + slides.length) % slides.length);
            }
        }
        startCarousel();
    }, { passive: true });


    /* --------------------------------------------------
       TALENT BOOK NOW BUTTONS
       -------------------------------------------------- */
    const inquiryBanner = document.getElementById('inquiryBanner');
    const inquiryArtist = document.getElementById('inquiryArtist');
    const inquiryClose = document.getElementById('inquiryClose');

    document.querySelectorAll('.talent__overlay-btn--book').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const artist = btn.dataset.artist;
            inquiryArtist.textContent = artist;
            inquiryBanner.classList.add('active');

            // Remove tap state so overlay hides after navigating
            btn.closest('.talent__card').classList.remove('is-tapped');

            const booking = document.getElementById('booking');
            const offset = isMobile() ? 60 : 80;
            const top = booking.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* Mobile tap toggle for talent card overlay */
    document.querySelectorAll('.talent__card').forEach(card => {
        card.addEventListener('touchstart', (e) => {
            // Don't toggle if tapping a button inside the overlay
            if (e.target.closest('.talent__overlay-btn')) return;

            const wasActive = card.classList.contains('is-tapped');

            // Close all other cards
            document.querySelectorAll('.talent__card.is-tapped').forEach(c => {
                c.classList.remove('is-tapped');
            });

            // Toggle this card
            if (!wasActive) {
                card.classList.add('is-tapped');
            }
        }, { passive: true });
    });

    // Close overlay when tapping outside any card
    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.talent__card')) {
            document.querySelectorAll('.talent__card.is-tapped').forEach(c => {
                c.classList.remove('is-tapped');
            });
        }
    }, { passive: true });

    inquiryClose.addEventListener('click', () => {
        inquiryBanner.classList.remove('active');
        inquiryArtist.textContent = '';
    });


    /* --------------------------------------------------
       FOOTER EMAIL FORM
       -------------------------------------------------- */
    const footerForm = document.getElementById('footerForm');
    footerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = footerForm.querySelector('.footer__submit');
        const input = footerForm.querySelector('.footer__input');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '&#10003;';
        input.value = '';
        input.placeholder = 'Subscribed!';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            input.placeholder = 'Your email';
        }, 3000);
    });


    /* --------------------------------------------------
       ACTIVE NAV SECTION TRACKING
       -------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const menuLinks = document.querySelectorAll('.menu-overlay__link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                menuLinks.forEach(link => {
                    link.style.color = link.getAttribute('href') === `#${id}`
                        ? '#829cbc'
                        : '';
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -40% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));


    /* --------------------------------------------------
       SOUNDCLOUD PLAYBACK BAR
       -------------------------------------------------- */
    function initSoundCloud() {
    const scIframe = document.getElementById('sc-widget');
    if (!scIframe || !window.SC || !window.SC.Widget) {
        return setTimeout(initSoundCloud, 200);
    }
    {
        const widget = SC.Widget(scIframe);
        const pbBar = document.getElementById('playbackBar');
        const pbPlay = document.getElementById('pbPlay');
        const pbPrev = document.getElementById('pbPrev');
        const pbNext = document.getElementById('pbNext');
        const pbTitle = document.getElementById('pbTitle');
        const pbArtist = document.getElementById('pbArtist');
        const pbArtwork = document.getElementById('pbArtwork');
        const pbTime = document.getElementById('pbTime');
        const pbDuration = document.getElementById('pbDuration');
        const progressFill = document.getElementById('progressFill');
        const progressWrap = document.getElementById('progressWrap');
        const iconPlay = pbPlay.querySelector('.icon-play');
        const iconPause = pbPlay.querySelector('.icon-pause');

        let isPlaying = false;
        let trackDuration = 0;
        let trackList = [];
        let currentTrackIndex = 0;

        function formatTime(ms) {
            const totalSec = Math.floor(ms / 1000);
            const min = Math.floor(totalSec / 60);
            const sec = totalSec % 60;
            return min + ':' + (sec < 10 ? '0' : '') + sec;
        }

        function updatePlayIcon() {
            iconPlay.style.display = isPlaying ? 'none' : 'block';
            iconPause.style.display = isPlaying ? 'block' : 'none';
        }

        function loadTrackInfo() {
            widget.getCurrentSound(function(sound) {
                if (sound) {
                    pbTitle.textContent = sound.title || 'Unknown Track';
                    pbArtist.textContent = sound.user ? sound.user.username : '3D SOUND';
                    if (sound.artwork_url) {
                        pbArtwork.style.backgroundImage = 'url(' + sound.artwork_url.replace('-large', '-t300x300') + ')';
                    }
                }
            });
            widget.getDuration(function(duration) {
                trackDuration = duration;
                pbDuration.textContent = formatTime(duration);
            });
        }

        // Widget ready
        widget.bind(SC.Widget.Events.READY, function() {
            // Show bar
            setTimeout(function() {
                pbBar.classList.add('visible');
            }, 1000);

            // Get track list
            widget.getSounds(function(sounds) {
                trackList = sounds;
            });

            // Load first track info
            loadTrackInfo();

            // Auto-play is set in the iframe URL, so set state
            isPlaying = true;
            updatePlayIcon();
        });

        // Track changes
        widget.bind(SC.Widget.Events.PLAY, function() {
            isPlaying = true;
            updatePlayIcon();
            loadTrackInfo();
            widget.getCurrentSoundIndex(function(index) {
                currentTrackIndex = index;
            });
        });

        widget.bind(SC.Widget.Events.PAUSE, function() {
            isPlaying = false;
            updatePlayIcon();
        });

        widget.bind(SC.Widget.Events.FINISH, function() {
            // SoundCloud auto-advances in playlist mode
        });

        // Progress tracking
        widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
            if (trackDuration > 0) {
                const pct = (data.currentPosition / trackDuration) * 100;
                progressFill.style.width = pct + '%';
                pbTime.textContent = formatTime(data.currentPosition);
            }
        });

        // Controls
        pbPlay.addEventListener('click', function() {
            widget.toggle();
        });

        pbNext.addEventListener('click', function() {
            widget.next();
        });

        pbPrev.addEventListener('click', function() {
            widget.prev();
        });

        // Click on progress bar to seek
        progressWrap.addEventListener('click', function(e) {
            if (trackDuration <= 0) return;
            const rect = progressWrap.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            widget.seekTo(pct * trackDuration);
        });
    }
    }
    initSoundCloud();

});
