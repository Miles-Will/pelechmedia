// Video Gallery JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Initialize video gallery
    initVideoGallery();

    // Initialize category filtering
    initCategoryFiltering();

    // Initialize video modal
    initVideoModal();

    // Initialize scroll animations
    initScrollAnimations();
});

function initVideoGallery() {
    const videoItems = document.querySelectorAll('.video-item');

    // Add click event listeners to video items
    videoItems.forEach(item => {
        item.addEventListener('click', function () {
            const video = item.querySelector('video source');
            const title = item.querySelector('.video-info h3').textContent;
            const description = item.querySelector('.video-info p').textContent;

            if (video) {
                openVideoModal(video.src, title, description);
            }
        });

        // Prevent video from playing on hover
        const video = item.querySelector('video');
        if (video) {
            video.addEventListener('loadedmetadata', function () {
                video.currentTime = 0;
            });
        }
    });
}

function initCategoryFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoItems = document.querySelectorAll('.video-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter video items
            filterVideoItems(videoItems, category);
        });
    });
}

function filterVideoItems(items, category) {
    items.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = category === 'all' || itemCategory === category;

        if (shouldShow) {
            item.classList.remove('hidden');
            // Stagger animation for visible items
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100);
        } else {
            item.classList.remove('visible');
            item.classList.add('hidden');
        }
    });
}

function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = document.getElementById('modalClose');

    // Close modal events
    closeBtn.addEventListener('click', closeVideoModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    function closeVideoModal() {
        modal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = '';
        document.body.style.overflow = '';
    }
}

function openVideoModal(videoSrc, title, description) {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    modalVideo.src = videoSrc;
    modalTitle.textContent = title;
    modalDescription.textContent = description;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Auto-play video in modal
    modalVideo.play().catch(e => {
        console.log('Auto-play prevented:', e);
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all video items
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        observer.observe(item);
    });
}

// Video thumbnail hover effects
document.addEventListener('DOMContentLoaded', function () {
    const videoItems = document.querySelectorAll('.video-item');

    videoItems.forEach(item => {
        const video = item.querySelector('video');
        let hoverTimeout;

        item.addEventListener('mouseenter', function () {
            hoverTimeout = setTimeout(() => {
                if (video) {
                    video.currentTime = 0;
                    video.play().catch(e => {
                        console.log('Video preview play failed:', e);
                    });
                }
            }, 500); // Delay before starting preview
        });

        item.addEventListener('mouseleave', function () {
            clearTimeout(hoverTimeout);
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Performance optimization: Lazy load videos
function initLazyLoading() {
    const videoItems = document.querySelectorAll('.video-item video');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.load();
                videoObserver.unobserve(video);
            }
        });
    });

    videoItems.forEach(video => {
        videoObserver.observe(video);
    });
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);