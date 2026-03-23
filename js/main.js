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
       SOUNDCLOUD PLAYBACK BAR + NOW PLAYING OVERLAY
       -------------------------------------------------- */
    function initSoundCloud() {
    const scIframe = document.getElementById('sc-widget');
    if (!scIframe || !window.SC || !window.SC.Widget) {
        return setTimeout(initSoundCloud, 200);
    }
    {
        let widget = SC.Widget(scIframe);

        // --- Playback bar elements ---
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
        const pbIconPlay = pbPlay.querySelector('.icon-play');
        const pbIconPause = pbPlay.querySelector('.icon-pause');

        // --- Now Playing overlay elements ---
        const npOverlay = document.getElementById('npOverlay');
        const npBack = document.getElementById('npBack');
        const npSidebar = document.getElementById('npSidebar');
        const npPlay = document.getElementById('npPlay');
        const npPrev = document.getElementById('npPrev');
        const npNext = document.getElementById('npNext');
        const npArtwork = document.getElementById('npArtwork');
        const npAlbumTitle = document.getElementById('npAlbumTitle');
        const npTrackCount = document.getElementById('npTrackCount');
        const npTrackListEl = document.getElementById('npTrackList');
        const npIconPlay = npPlay.querySelector('.icon-play');
        const npIconPause = npPlay.querySelector('.icon-pause');
        const pbOpenBtn = document.getElementById('pbOpenNowPlaying');
        const menuNP = document.getElementById('menuNowPlaying');
        const npMobileLibBtn = document.getElementById('npMobileLibBtn');
        const albumCards = document.querySelectorAll('.np-album-card');

        let isPlaying = false;
        let trackDuration = 0;
        let trackList = [];
        let currentTrackIndex = 0;
        let currentAlbumUrl = 'https://soundcloud.com/3dsoundcrew/sets/vibes-3';
        let soundsRetryTimer = null;

        function formatTime(ms) {
            const totalSec = Math.floor(ms / 1000);
            const min = Math.floor(totalSec / 60);
            const sec = totalSec % 60;
            return min + ':' + (sec < 10 ? '0' : '') + sec;
        }

        // Retry getSounds until all tracks have metadata loaded
        function fetchSoundsWithRetry(cb, retries) {
            if (soundsRetryTimer) clearTimeout(soundsRetryTimer);
            retries = retries || 0;
            widget.getSounds(function(sounds) {
                if (!sounds || sounds.length === 0) {
                    if (retries < 10) {
                        soundsRetryTimer = setTimeout(function() { fetchSoundsWithRetry(cb, retries + 1); }, 1000);
                    }
                    return;
                }
                // Check if tracks still have missing metadata (title undefined or duration 0)
                var incomplete = sounds.some(function(s) { return !s.title || s.duration === 0; });
                if (incomplete && retries < 10) {
                    // Render what we have so far, then retry
                    cb(sounds);
                    soundsRetryTimer = setTimeout(function() { fetchSoundsWithRetry(cb, retries + 1); }, 1500);
                } else {
                    cb(sounds);
                }
            });
        }

        function updatePlayIcons() {
            pbIconPlay.style.display = isPlaying ? 'none' : 'block';
            pbIconPause.style.display = isPlaying ? 'block' : 'none';
            npIconPlay.style.display = isPlaying ? 'none' : 'block';
            npIconPause.style.display = isPlaying ? 'block' : 'none';
        }

        function loadTrackInfo() {
            widget.getCurrentSound(function(sound) {
                if (sound) {
                    const title = sound.title || 'Unknown Track';
                    const artist = sound.user ? sound.user.username : '3D SOUND';
                    pbTitle.textContent = title;
                    pbArtist.textContent = artist;
                    if (sound.artwork_url) {
                        const artSmall = 'url(' + sound.artwork_url.replace('-large', '-t300x300') + ')';
                        const artLarge = 'url(' + sound.artwork_url.replace('-large', '-t500x500') + ')';
                        pbArtwork.style.backgroundImage = artSmall;
                        npArtwork.style.backgroundImage = artLarge;
                    }
                }
            });
            widget.getDuration(function(duration) {
                trackDuration = duration;
                pbDuration.textContent = formatTime(duration);
            });
            highlightActiveTrack();
        }

        // --- Album switching ---
        function loadAlbum(url, name, autoPlay) {
            currentAlbumUrl = url;
            npAlbumTitle.textContent = name;
            npTrackListEl.innerHTML = '<div class="np-loading">Loading tracks...</div>';
            currentTrackIndex = 0;
            trackDuration = 0;
            progressFill.style.width = '0%';

            // Highlight active album in sidebar
            albumCards.forEach(function(card) {
                card.classList.toggle('active', card.dataset.url === url);
            });

            // Use the widget API's load method for reliable playlist switching
            widget.load(url, {
                auto_play: autoPlay,
                hide_related: true,
                show_comments: false,
                show_user: false,
                show_reposts: false,
                show_teaser: false,
                callback: function() {
                    // This fires when the new playlist is ready
                    fetchSoundsWithRetry(function(sounds) {
                        trackList = sounds;
                        renderTrackList();
                    });
                    loadTrackInfo();
                    if (autoPlay) {
                        isPlaying = true;
                        updatePlayIcons();
                    }
                }
            });
        }

        // --- Fetch album artwork for sidebar cards ---
        function fetchAlbumArt(card) {
            var url = card.dataset.url;
            var artEl = card.querySelector('.np-album-card__art');
            var tempIframe = document.createElement('iframe');
            tempIframe.style.cssText = 'position:absolute;width:0;height:0;border:0;overflow:hidden;';
            tempIframe.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(url) +
                '&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false';
            document.body.appendChild(tempIframe);

            var tempWidget = SC.Widget(tempIframe);
            tempWidget.bind(SC.Widget.Events.READY, function() {
                tempWidget.getSounds(function(sounds) {
                    if (sounds && sounds.length > 0 && sounds[0].artwork_url) {
                        artEl.style.backgroundImage = 'url(' + sounds[0].artwork_url.replace('-large', '-t200x200') + ')';
                    }
                    // Clean up temp iframe
                    setTimeout(function() { tempIframe.remove(); }, 500);
                });
            });
        }

        // Fetch art for all sidebar albums
        albumCards.forEach(function(card) {
            fetchAlbumArt(card);
        });

        // Album card click handlers
        albumCards.forEach(function(card) {
            card.addEventListener('click', function() {
                loadAlbum(card.dataset.url, card.dataset.name, true);
                // Close mobile sidebar if open
                npSidebar.classList.remove('mobile-open');
            });
        });

        // --- Now Playing overlay toggle ---
        function openNowPlaying(e) {
            if (e) e.preventDefault();
            npOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            menuOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            pbOpenBtn.classList.add('is-open');
            pbOpenBtn.querySelector('.pb-label').textContent = 'Close';
            pbOpenBtn.querySelector('.pb-icon-open').style.display = 'none';
            pbOpenBtn.querySelector('.pb-icon-close').style.display = 'block';
        }

        function closeNowPlaying() {
            npOverlay.classList.remove('active');
            npSidebar.classList.remove('mobile-open');
            document.body.style.overflow = '';
            pbOpenBtn.classList.remove('is-open');
            pbOpenBtn.querySelector('.pb-label').textContent = 'Open';
            pbOpenBtn.querySelector('.pb-icon-open').style.display = 'block';
            pbOpenBtn.querySelector('.pb-icon-close').style.display = 'none';
        }

        pbOpenBtn.addEventListener('click', function(e) {
            if (npOverlay.classList.contains('active')) {
                closeNowPlaying();
            } else {
                openNowPlaying(e);
            }
        });
        menuNP.addEventListener('click', openNowPlaying);
        npBack.addEventListener('click', closeNowPlaying);

        // Mobile library toggle
        npMobileLibBtn.addEventListener('click', function() {
            npSidebar.classList.toggle('mobile-open');
        });

        // Close sidebar when clicking outside on mobile
        document.getElementById('npContent').addEventListener('click', function() {
            npSidebar.classList.remove('mobile-open');
        });

        // --- Track list rendering ---
        function renderTrackList() {
            npTrackListEl.innerHTML = '';
            npTrackCount.textContent = trackList.length + ' song' + (trackList.length !== 1 ? 's' : '');
            trackList.forEach(function(sound, i) {
                var row = document.createElement('div');
                row.className = 'np-track' + (i === currentTrackIndex ? ' active' : '');
                if (i === currentTrackIndex && !isPlaying) row.className += ' paused';
                var artStyle = sound.artwork_url
                    ? 'background-image:url(' + sound.artwork_url.replace('-large', '-t200x200') + ')'
                    : '';
                row.innerHTML =
                    '<div class="np-track__num"><span>' + (i + 1) + '</span>' +
                    '<div class="np-track__playing-indicator"><div class="np-eq-bar"></div><div class="np-eq-bar"></div><div class="np-eq-bar"></div></div></div>' +
                    '<div class="np-track__artwork" style="' + artStyle + '"></div>' +
                    '<div class="np-track__info"><div class="np-track__title">' + (sound.title || 'Track ' + (i + 1)) + '</div>' +
                    '<div class="np-track__artist-name">' + (sound.user ? sound.user.username : '3D SOUND') + '</div></div>' +
                    '<span class="np-track__duration">' + formatTime(sound.duration || 0) + '</span>';
                row.addEventListener('click', function() {
                    widget.skip(i);
                    widget.play();
                });
                npTrackListEl.appendChild(row);
            });

            // Update album hero artwork from first track
            if (trackList.length > 0 && trackList[0].artwork_url) {
                npArtwork.style.backgroundImage = 'url(' + trackList[0].artwork_url.replace('-large', '-t500x500') + ')';
            }
        }

        function highlightActiveTrack() {
            document.querySelectorAll('.np-track').forEach(function(el, i) {
                el.classList.toggle('active', i === currentTrackIndex);
                el.classList.toggle('paused', i === currentTrackIndex && !isPlaying);
            });
        }

        // --- Widget event binding ---
        function bindWidgetEvents() {
            widget.bind(SC.Widget.Events.PLAY, function() {
                isPlaying = true;
                updatePlayIcons();
                loadTrackInfo();
                widget.getCurrentSoundIndex(function(index) {
                    currentTrackIndex = index;
                    highlightActiveTrack();
                });
            });

            widget.bind(SC.Widget.Events.PAUSE, function() {
                isPlaying = false;
                updatePlayIcons();
                highlightActiveTrack();
            });

            widget.bind(SC.Widget.Events.FINISH, function() {
                // SoundCloud auto-advances in playlist mode
            });

            widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
                if (trackDuration > 0) {
                    const pct = (data.currentPosition / trackDuration) * 100;
                    progressFill.style.width = pct + '%';
                    pbTime.textContent = formatTime(data.currentPosition);
                }
            });
        }

        // Initial load: READY fires once for the first playlist
        widget.bind(SC.Widget.Events.READY, function() {
            fetchSoundsWithRetry(function(sounds) {
                trackList = sounds;
                renderTrackList();
            });
            loadTrackInfo();
            bindWidgetEvents();
        });

        // --- Playback bar controls ---
        pbPlay.addEventListener('click', function() { widget.toggle(); });
        pbNext.addEventListener('click', function() { widget.next(); });
        pbPrev.addEventListener('click', function() { widget.prev(); });

        progressWrap.addEventListener('click', function(e) {
            if (trackDuration <= 0) return;
            const rect = progressWrap.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            widget.seekTo(pct * trackDuration);
        });

        // --- Now Playing controls ---
        npPlay.addEventListener('click', function() { widget.toggle(); });
        npNext.addEventListener('click', function() { widget.next(); });
        npPrev.addEventListener('click', function() { widget.prev(); });

    }
    }
    initSoundCloud();

});
