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

    // Solid nav on scroll — switch to solid black once past the hero section
    const heroSection = document.getElementById('hero');
    const handleNavScroll = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 300;
        nav.classList.toggle('scrolled', scrollY > heroBottom - 100);
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // Fullscreen menu toggle
    menuToggle.addEventListener('click', () => {
        const isOpen = menuOverlay.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflowY = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    document.querySelectorAll('.menu-overlay__link').forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflowY = '';
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
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });


    /* --------------------------------------------------
       COUNTERS — show final values immediately
       -------------------------------------------------- */
    document.querySelectorAll('[data-target]').forEach(el => {
        el.textContent = el.dataset.target;
    });




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
       FOOTER EMAIL FORM (removed from HTML — guarded)
       -------------------------------------------------- */
    const footerForm = document.getElementById('footerForm');
    if (footerForm) {
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
    }


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
       LOCAL AUDIO PLAYBACK BAR + NOW PLAYING OVERLAY
       -------------------------------------------------- */
    function initPlayer() {
    {
        // --- Album data (local files) ---
        var albums = {
            vib3s: {
                name: 'VIB3S',
                cover: 'assets/audio/vib3s/cover.jpg',
                artist: '3D SOUND',
                tracks: [
                    { title: 'Intro', file: 'assets/audio/vib3s/1. Intro (MASTERED).mp3' },
                    { title: 'Amabae', file: 'assets/audio/vib3s/2. Amabae (MASTERED).mp3' },
                    { title: 'Mines Forever', file: 'assets/audio/vib3s/3. Mines Forever (MASTERED).mp3' },
                    { title: 'Swoon (Feat. Vaishaly)', file: 'assets/audio/vib3s/4. Swoon Feat. Vaishaly (MASTERED).mp3' },
                    { title: 'Summer 08', file: 'assets/audio/vib3s/5. Summer 08 (MASTERED).mp3' },
                    { title: 'Your Bed', file: 'assets/audio/vib3s/6. Your Bed (MASTERED).mp3' },
                    { title: 'Go Easy', file: 'assets/audio/vib3s/7. Go Easy (MASTERED).mp3' },
                    { title: 'Lost Poem', file: 'assets/audio/vib3s/8. Lost Poem (MASTERED).mp3' },
                    { title: '5AM in Swiss', file: 'assets/audio/vib3s/9. 5AM in Swiss (MASTERED).mp3' },
                    { title: 'Her Eyes', file: 'assets/audio/vib3s/10. Her Eyes (MASTERED).mp3' },
                    { title: 'Rivers', file: 'assets/audio/vib3s/11. Rivers (MASTERED).mp3' },
                    { title: 'Poetic Love', file: 'assets/audio/vib3s/12. Poetic Love (MASTERED).mp3' },
                    { title: 'Home (Feat. Vaishaly)', file: 'assets/audio/vib3s/13. Home Feat. Vaishaly (MASTERED).mp3' },
                    { title: 'Voicemail', file: 'assets/audio/vib3s/14. Voicemail (MASTERED).mp3' },
                    { title: 'Talk To Me', file: 'assets/audio/vib3s/15. Talk To Me (MASTERED).mp3' },
                    { title: 'Interlude', file: 'assets/audio/vib3s/16. Interlude (MASTERED).mp3' },
                    { title: 'Marry Me (Feat. Jenushan)', file: 'assets/audio/vib3s/17. Marry Me Feat. Jenushan (MASTERED).mp3' },
                    { title: 'Flower Glass', file: 'assets/audio/vib3s/18. Flower Glass (MASTERED).mp3' },
                    { title: '222', file: 'assets/audio/vib3s/19. 222 (MASTERED).mp3' },
                    { title: 'Amour', file: 'assets/audio/vib3s/20. Amour (MASTERED).mp3' },
                    { title: 'Spellbound', file: 'assets/audio/vib3s/21. Spellbound (MASTERED).mp3' },
                    { title: 'Angry Bird', file: 'assets/audio/vib3s/22. Angry Bird (MASTERED).mp3' },
                    { title: '3AM in Sydney', file: 'assets/audio/vib3s/23. 3AM in Sydney (MASTERED).mp3' },
                    { title: 'Beauty In The Peace (Feat. Vaishaly)', file: 'assets/audio/vib3s/24. Beauty In The Peace Feat. Vaishaly (MASTERED).mp3' },
                    { title: 'Love of Life (Outro)', file: 'assets/audio/vib3s/25. Love of Life (Outro) (MASTERED).mp3' },
                    { title: "I'm Done, Nevermind", file: 'assets/audio/vib3s/26. I_m Done, Nevermind (MASTERED).mp3' }
                ]
            }
        };

        var audio = new Audio();
        var currentAlbumKey = 'vib3s';
        var currentTrackIndex = 0;
        var isPlaying = false;

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

        function currentAlbum() { return albums[currentAlbumKey]; }

        function formatTime(sec) {
            if (isNaN(sec)) return '0:00';
            var min = Math.floor(sec / 60);
            var s = Math.floor(sec % 60);
            return min + ':' + (s < 10 ? '0' : '') + s;
        }

        function updatePlayIcons() {
            pbIconPlay.style.display = isPlaying ? 'none' : 'block';
            pbIconPause.style.display = isPlaying ? 'block' : 'none';
            npIconPlay.style.display = isPlaying ? 'none' : 'block';
            npIconPause.style.display = isPlaying ? 'block' : 'none';
        }

        function loadTrack(index, autoPlay) {
            var album = currentAlbum();
            if (index < 0) index = album.tracks.length - 1;
            if (index >= album.tracks.length) index = 0;
            currentTrackIndex = index;
            var track = album.tracks[index];

            audio.src = track.file;
            pbTitle.textContent = track.title;
            pbArtist.textContent = album.artist;
            pbArtwork.style.backgroundImage = "url('" + album.cover + "')";
            npArtwork.style.backgroundImage = "url('" + album.cover + "')";
            progressFill.style.width = '0%';
            pbTime.textContent = '0:00';
            pbDuration.textContent = '0:00';
            highlightActiveTrack();

            if (autoPlay) {
                audio.play();
                isPlaying = true;
                updatePlayIcons();
            }
        }

        function loadAlbum(albumKey, autoPlay) {
            currentAlbumKey = albumKey;
            currentTrackIndex = 0;
            var album = currentAlbum();
            npAlbumTitle.textContent = album.name;
            albumCards.forEach(function(card) {
                card.classList.toggle('active', card.dataset.album === albumKey);
            });
            renderTrackList();
            loadTrack(0, autoPlay);
        }

        // --- Track list rendering ---
        function renderTrackList() {
            var album = currentAlbum();
            npTrackListEl.innerHTML = '';
            npTrackCount.textContent = album.tracks.length + ' song' + (album.tracks.length !== 1 ? 's' : '');
            album.tracks.forEach(function(track, i) {
                var row = document.createElement('div');
                row.className = 'np-track' + (i === currentTrackIndex ? ' active' : '');
                if (i === currentTrackIndex && !isPlaying) row.className += ' paused';
                var artStyle = "background-image:url('" + album.cover + "')";
                row.innerHTML =
                    '<div class="np-track__num"><span>' + (i + 1) + '</span>' +
                    '<div class="np-track__playing-indicator"><div class="np-eq-bar"></div><div class="np-eq-bar"></div><div class="np-eq-bar"></div></div></div>' +
                    '<div class="np-track__artwork" style="' + artStyle + '"></div>' +
                    '<div class="np-track__info"><div class="np-track__title">' + track.title + '</div>' +
                    '<div class="np-track__artist-name">' + album.artist + '</div></div>' +
                    '<span class="np-track__duration" data-index="' + i + '"></span>';
                row.addEventListener('click', function() {
                    loadTrack(i, true);
                });
                npTrackListEl.appendChild(row);
            });

            // Load durations for each track
            album.tracks.forEach(function(track, i) {
                var tempAudio = new Audio();
                tempAudio.preload = 'metadata';
                tempAudio.src = track.file;
                tempAudio.addEventListener('loadedmetadata', function() {
                    var durationEl = npTrackListEl.querySelector('[data-index="' + i + '"]');
                    if (durationEl) durationEl.textContent = formatTime(tempAudio.duration);
                });
            });
        }

        function highlightActiveTrack() {
            document.querySelectorAll('.np-track').forEach(function(el, i) {
                el.classList.toggle('active', i === currentTrackIndex);
                el.classList.toggle('paused', i === currentTrackIndex && !isPlaying);
            });
        }

        // --- Audio events ---
        audio.addEventListener('timeupdate', function() {
            if (audio.duration > 0) {
                var pct = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = pct + '%';
                pbTime.textContent = formatTime(audio.currentTime);
            }
        });

        audio.addEventListener('loadedmetadata', function() {
            pbDuration.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('ended', function() {
            // Auto-advance to next track
            if (currentTrackIndex < currentAlbum().tracks.length - 1) {
                loadTrack(currentTrackIndex + 1, true);
            } else {
                isPlaying = false;
                updatePlayIcons();
                highlightActiveTrack();
            }
        });

        audio.addEventListener('play', function() {
            isPlaying = true;
            updatePlayIcons();
            highlightActiveTrack();
        });

        audio.addEventListener('pause', function() {
            isPlaying = false;
            updatePlayIcons();
            highlightActiveTrack();
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

        // Album card click handlers
        albumCards.forEach(function(card) {
            card.addEventListener('click', function() {
                loadAlbum(card.dataset.album, true);
                npSidebar.classList.remove('mobile-open');
            });
        });

        // --- Playback bar controls ---
        pbPlay.addEventListener('click', function() {
            if (isPlaying) { audio.pause(); } else { audio.play(); }
        });
        pbNext.addEventListener('click', function() { loadTrack(currentTrackIndex + 1, true); });
        pbPrev.addEventListener('click', function() { loadTrack(currentTrackIndex - 1, true); });

        progressWrap.addEventListener('click', function(e) {
            if (!audio.duration) return;
            const rect = progressWrap.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pct * audio.duration;
        });

        // --- Now Playing controls ---
        npPlay.addEventListener('click', function() {
            if (isPlaying) { audio.pause(); } else { audio.play(); }
        });
        npNext.addEventListener('click', function() { loadTrack(currentTrackIndex + 1, true); });
        npPrev.addEventListener('click', function() { loadTrack(currentTrackIndex - 1, true); });

        // --- Initial load ---
        currentAlbumKey = 'vib3s';
        var album = currentAlbum();
        npAlbumTitle.textContent = album.name;
        albumCards.forEach(function(card) {
            card.classList.toggle('active', card.dataset.album === 'vib3s');
        });
        renderTrackList();
        loadTrack(24, false);

        // Autoplay on first user interaction (browser policy requires a gesture)
        function autoplayOnce() {
            if (!isPlaying) {
                audio.play();
            }
            document.removeEventListener('click', autoplayOnce);
            document.removeEventListener('touchstart', autoplayOnce);
            document.removeEventListener('keydown', autoplayOnce);
        }
        // Try immediate play, fall back to waiting for interaction
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(function() {
                // Autoplay blocked — wait for user gesture
                document.addEventListener('click', autoplayOnce);
                document.addEventListener('touchstart', autoplayOnce);
                document.addEventListener('keydown', autoplayOnce);
            });
        }

    }
    }
    initPlayer();

});
