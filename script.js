// Main website functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize gallery animations
    initializeGalleryAnimations();

    // Initialize featured gallery slideshow
    initializeFeaturedGallery();

    // Initialize navigation
    initializeNavigation();

    // Add mobile-specific optimizations
    initializeMobileOptimizations();
});

function initializeGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    galleryItems.forEach(item => {
        observer.observe(item);
    });
}

function initializeFeaturedGallery() {
    // Featured gallery images - using local images from 'featured' folder - all 72 images
    const featuredImages = [
        'images/featured/Featured 01.jpg',
        'images/featured/Featured 02.jpg',
        'images/featured/Featured 03.jpg',
        'images/featured/Featured 04.jpg',
        'images/featured/Featured 05.jpg',
        'images/featured/Featured 06.jpg',
        'images/featured/Featured 07.jpg',
        'images/featured/Featured 08.jpg',
        'images/featured/Featured 09.jpg',
        'images/featured/Featured 10.jpg',
        'images/featured/Featured 11.jpg',
        'images/featured/Featured 12.jpg',
        'images/featured/Featured 13.jpg',
        'images/featured/Featured 14.jpg',
        'images/featured/Featured 15.jpg',
        'images/featured/Featured 16.jpg',
        'images/featured/Featured 17.jpg',
        'images/featured/Featured 18.jpg',
        'images/featured/Featured 19.jpg',
        'images/featured/Featured 20.jpg',
        'images/featured/Featured 21.jpg',
        'images/featured/Featured 22.jpg',
        'images/featured/Featured 23.jpg',
        'images/featured/Featured 24.jpg',
        'images/featured/Featured 25.jpg',
        'images/featured/Featured 26.jpg',
        'images/featured/Featured 27.jpg',
        'images/featured/Featured 28.jpg',
        'images/featured/Featured 29.jpg',
        'images/featured/Featured 30.jpg',
        'images/featured/Featured 31.jpg',
        'images/featured/Featured 32.jpg',
        'images/featured/Featured 33.jpg',
        'images/featured/Featured 34.jpg',
        'images/featured/Featured 35.jpg',
        'images/featured/Featured 36.jpg',
        'images/featured/Featured 37.jpg',
        'images/featured/Featured 38.jpg',
        'images/featured/Featured 39.jpg',
        'images/featured/Featured 40.jpg',
        'images/featured/Featured 41.jpg',
        'images/featured/Featured 42.jpg',
        'images/featured/Featured 43.jpg',
        'images/featured/Featured 44.jpg',
        'images/featured/Featured 45.jpg',
        'images/featured/Featured 46.jpg',
        'images/featured/Featured 47.jpg',
        'images/featured/Featured 48.jpg',
        'images/featured/Featured 49.jpg',
        'images/featured/Featured 50.jpg',
        'images/featured/Featured 51.jpg',
        'images/featured/Featured 52.jpg',
        'images/featured/Featured 53.jpg',
        'images/featured/Featured 54.jpg',
        'images/featured/Featured 55.jpg',
        'images/featured/Featured 56.jpg',
        'images/featured/Featured 57.jpg',
        'images/featured/Featured 58.jpg',
        'images/featured/Featured 59.jpg',
        'images/featured/Featured 60.jpg',
        'images/featured/Featured 61.jpg',
        'images/featured/Featured 62.jpg',
        'images/featured/Featured 63.jpg',
        'images/featured/Featured 64.jpg',
        'images/featured/Featured 65.jpg',
        'images/featured/Featured 66.jpg',
        'images/featured/Featured 67.jpg',
        'images/featured/Featured 68.jpg',
        'images/featured/Featured 69.jpg',
        'images/featured/Featured 70.jpg',
        'images/featured/Featured 71.jpg'
    ];

    const galleryGrid = document.getElementById('galleryGrid');
    const pauseBtn = document.getElementById('pauseBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (!galleryGrid || !pauseBtn || !nextBtn || !prevBtn) {
        return; // Exit if elements don't exist (not on index page)
    }

    let currentIndex = 0;
    let isPlaying = true;
    let slideInterval;
    let isMobile = window.innerWidth <= 768;
    let usedImages = new Set(); // Track which images we've shown

    // Adjust for mobile display
    const getImagesPerView = () => window.innerWidth <= 768 ? 1 : 4;

    // Get random images without repeating until all have been shown
    function getRandomImageIndices(count) {
        const indices = [];
        const availableImages = [];

        // If we've shown all images, reset the used set
        if (usedImages.size >= featuredImages.length) {
            usedImages.clear();
        }

        // Create array of available image indices
        for (let i = 0; i < featuredImages.length; i++) {
            if (!usedImages.has(i)) {
                availableImages.push(i);
            }
        }

        // If we don't have enough available images, add some back
        if (availableImages.length < count) {
            usedImages.clear();
            for (let i = 0; i < featuredImages.length; i++) {
                availableImages.push(i);
            }
        }

        // Randomly select the required number of images
        for (let i = 0; i < count && availableImages.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableImages.length);
            const selectedIndex = availableImages.splice(randomIndex, 1)[0];
            indices.push(selectedIndex);
            usedImages.add(selectedIndex);
        }

        return indices;
    }

    // Simple, fast image creation with random selection
    function createGalleryItems() {
        const imagesPerView = getImagesPerView();
        galleryGrid.innerHTML = '';

        // Get random image indices
        const randomIndices = getRandomImageIndices(imagesPerView);

        randomIndices.forEach((imageIndex, i) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = featuredImages[imageIndex];
            img.alt = `Featured Work ${imageIndex + 1}`;

            // Optimize for faster loading
            img.loading = 'eager';
            img.decoding = 'async';
            img.fetchPriority = 'high';

            // Add simple error handling
            img.onerror = function () {
                this.style.display = 'none';
                galleryItem.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; text-align: center;">
                        <div>
                            <div>📷</div>
                            <div style="font-size: 12px; margin-top: 8px;">Image ${imageIndex + 1}</div>
                            <div style="font-size: 10px;">Loading...</div>
                        </div>
                    </div>
                `;

                // Retry loading after a delay
                setTimeout(() => {
                    const retryImg = document.createElement('img');
                    retryImg.src = featuredImages[imageIndex];
                    retryImg.style.cssText = 'max-width: 100%; max-height: 100%; object-fit: contain;';
                    retryImg.onload = () => {
                        galleryItem.innerHTML = '';
                        galleryItem.appendChild(retryImg);
                    };
                }, 2000);
            };

            galleryItem.appendChild(img);
            galleryGrid.appendChild(galleryItem);
        });

        // Simple animation trigger
        setTimeout(() => {
            galleryGrid.querySelectorAll('.gallery-item').forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 100);
            });
        }, 100);
    }

    // Slower slideshow timing with random images
    function startSlideshow() {
        if (slideInterval) clearInterval(slideInterval);

        const intervalTime = isMobile ? 15000 : 12000; // Very slow - 12-15 seconds

        slideInterval = setInterval(() => {
            if (isPlaying) {
                createGalleryItems(); // No parameters needed - always random
            }
        }, intervalTime);
    }

    // Handle window resize
    function handleResize() {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 768;

        if (wasMobile !== isMobile) {
            createGalleryItems(); // Recreate with new layout
            if (isPlaying) {
                startSlideshow();
            }
        }
    }

    // Initialize immediately with random images
    createGalleryItems();
    startSlideshow();

    // Add resize listener with debounce
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

    // Control button event listeners
    pauseBtn.addEventListener('click', function () {
        isPlaying = !isPlaying;
        this.textContent = isPlaying ? 'PAUSE' : 'PLAY';
        this.classList.toggle('active', isPlaying);

        if (isPlaying) {
            startSlideshow();
        } else {
            clearInterval(slideInterval);
        }
    });

    nextBtn.addEventListener('click', function () {
        createGalleryItems(); // Show new random images
        if (isPlaying) {
            startSlideshow(); // Reset timer
        }
    });

    prevBtn.addEventListener('click', function () {
        createGalleryItems(); // Show new random images  
        if (isPlaying) {
            startSlideshow(); // Reset timer
        }
    });
}

function initializeNavigation() {
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

    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function initializeMobileOptimizations() {
    // Prevent zoom on input focus (if you have forms)
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
    }

    // Optimize all images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.loading = 'lazy';
        }
        if (!img.hasAttribute('decoding')) {
            img.decoding = 'async';
        }

        // Add error handling to all images
        img.onerror = function () {
            console.log('Image failed to load:', this.src);
            this.style.backgroundColor = '#333';
        };
    });

    // Handle touch events for better mobile interaction
    document.addEventListener('touchstart', function () { }, { passive: true });
    document.addEventListener('touchmove', function () { }, { passive: true });

    // Prevent rubber band scrolling on iOS
    document.addEventListener('touchmove', function (e) {
        if (e.target.closest('.gallery-item, .category-card')) {
            return;
        }
    }, { passive: false });
}

// Legacy gallery controls for other pages
const controls = document.querySelectorAll('.control-btn[data-filter]');
const galleryItems = document.querySelectorAll('.gallery-item');

if (controls.length > 0) {
    controls.forEach(control => {
        control.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active control
            controls.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 100);
                } else {
                    item.classList.remove('visible');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Add performance monitoring for mobile
if (window.performance && window.performance.mark) {
    window.performance.mark('mobile-optimizations-complete');
}