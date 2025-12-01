// Concerts Gallery - S3 Integration
document.addEventListener('DOMContentLoaded', function () {
    const gallery = document.getElementById('concertsGallery');

    if (!gallery) {
        console.error('Concerts gallery element not found!');
        return;
    }

    // S3 URL format (same as other galleries)
    const S3_BUCKET_URL = 'https://s3.eu-north-1.amazonaws.com/pelechmedia.co.uk';

    // Generate image URLs for concert photos (29 images)
    const concertImageFilenames = [
        'concert 1.jpg',
        'concert 2.jpg',
        'concert 3.jpg',
        'concert 4.jpg',
        'concert 5.jpg',
        'concert 6.jpg',
        'concert 7.jpg',
        'concert 8.jpg',
        'concert 9.jpg',
        'concert 10.jpg',
        'concert 11.jpg',
        'concert 12.jpg',
        'concert 13.jpg',
        'concert 14.jpg',
        'concert 15.jpg',
        'concert 16.jpg',
        'concert 17.jpg',
        'concert 18.jpg',
        'concert 19.jpg',
        'concert 20.jpg',
        'concert 21.jpg',
        'concert 22.jpg',
        'concert 23.jpg',
        'concert 24.jpg',
        'concert 25.jpg',
        'concert 26.jpg',
        'concert 27.jpg',
        'concert 28.jpg',
        'concert 29.jpg'
    ];

    const concertImages = concertImageFilenames.map(filename =>
        `${S3_BUCKET_URL}/images/concerts/${filename}`
    );

    console.log('Generated', concertImages.length, 'concert image URLs');
    console.log('Using S3 URL format:', S3_BUCKET_URL);

    // Show loading state
    gallery.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading ${concertImages.length} concert photos...</p>
        </div>
    `;

    // Create gallery items in batches for faster initial load
    function createGallery() {
        gallery.innerHTML = '';

        // Load first 15 images immediately, then load more as user scrolls
        const initialBatch = 15;
        const imagesToShow = concertImages.slice(0, initialBatch);

        // Create initial batch
        imagesToShow.forEach((imageSrc, index) => {
            createImageItem(imageSrc, index);
        });

        // Load remaining images after initial batch is loaded
        if (concertImages.length > initialBatch) {
            setTimeout(() => {
                concertImages.slice(initialBatch).forEach((imageSrc, index) => {
                    createImageItem(imageSrc, index + initialBatch);
                });

                // Re-initialize lazy loading for new items
                initLazyLoading();
                animateItemsIn();
            }, 1000);
        }

        // Initialize lazy loading for initial batch
        initLazyLoading();
        animateItemsIn();
    }

    function createImageItem(imageSrc, index) {
        const item = document.createElement('div');
        item.className = 'masonry-item';
        item.setAttribute('data-index', index);

        // Add loading priority and size hints for better performance
        const img = document.createElement('img');
        img.setAttribute('data-src', imageSrc);
        img.alt = `Concert Photo ${index + 1}`;
        img.className = 'lazy-load';
        img.loading = 'lazy'; // Native lazy loading as backup
        img.decoding = 'async'; // Async decoding for smoother loading

        // Add size hints for first few images for faster initial load
        if (index < 6) {
            img.setAttribute('fetchpriority', 'high');
        }

        // Add placeholder
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzg4ODg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';

        // Click handler for lightbox
        item.addEventListener('click', () => openLightbox(index, concertImages));

        item.appendChild(img);
        gallery.appendChild(item);
    }

    // Lazy loading with Intersection Observer - Optimized for speed
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-load');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');

                    const newImg = new Image();

                    // Preload next few images for smoother scrolling
                    const currentIndex = parseInt(img.parentElement.getAttribute('data-index'));
                    if (currentIndex < concertImages.length - 3) {
                        setTimeout(() => {
                            for (let i = 1; i <= 3; i++) {
                                if (currentIndex + i < concertImages.length) {
                                    const preloadImg = new Image();
                                    preloadImg.src = concertImages[currentIndex + i];
                                }
                            }
                        }, 500);
                    }

                    newImg.onload = () => {
                        img.src = src;
                        img.classList.remove('lazy-load');
                        img.parentElement.classList.add('loaded');
                    };
                    newImg.onerror = () => {
                        img.parentElement.style.display = 'none';
                        console.log('Image not found (skipping):', src);
                    };
                    newImg.src = src;

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px 0px', // Start loading earlier - 200px before entering view
            threshold: 0.01
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Animate items into view
    function animateItemsIn() {
        const items = document.querySelectorAll('.masonry-item');

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 30);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        items.forEach(item => animationObserver.observe(item));
    }

    // Lightbox functionality
    let currentLightboxIndex = 0;
    let currentImages = [];

    function openLightbox(index, images) {
        currentLightboxIndex = index;
        currentImages = images;

        let lightbox = document.getElementById('lightbox');
        if (!lightbox) {
            createLightbox();
            lightbox = document.getElementById('lightbox');
        }

        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';

        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
                <button class="lightbox-nav lightbox-prev" onclick="previousImage()">&#8249;</button>
                <img id="lightbox-image" src="" alt="">
                <button class="lightbox-nav lightbox-next" onclick="nextImage()">&#8250;</button>
                <div class="lightbox-counter">
                    <span id="current-image-number">1</span> / <span id="total-images">${concertImages.length}</span>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', handleKeydown);
    }

    function updateLightboxImage() {
        const lightboxImg = document.getElementById('lightbox-image');
        const currentSrc = currentImages[currentLightboxIndex];
        const imageNumber = currentLightboxIndex + 1;

        lightboxImg.src = currentSrc;
        lightboxImg.alt = `Concert Photo ${imageNumber}`;

        // Update counter
        const currentImageNumber = document.getElementById('current-image-number');
        if (currentImageNumber) currentImageNumber.textContent = imageNumber;
    }

    function handleKeydown(e) {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox || !lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                previousImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }

    // Global functions
    window.closeLightbox = function () {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.nextImage = function () {
        currentLightboxIndex = (currentLightboxIndex + 1) % currentImages.length;
        updateLightboxImage();
    };

    window.previousImage = function () {
        currentLightboxIndex = (currentLightboxIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
    };

    // Start the gallery
    createGallery();
});

// Styles (same as other galleries)
const style = document.createElement('style');
style.textContent = `
    .loading-state {
        text-align: center;
        padding: 60px 20px;
        color: #cccccc;
    }
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top: 3px solid #ffffff;
        border-radius: 50%;
        margin: 0 auto 20px;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .masonry-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .masonry-item.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .masonry-item.loaded img {
        transition: transform 0.3s ease;
    }
    
    .masonry-item:hover.loaded img {
        transform: scale(1.05);
    }
    
    .lazy-load {
        filter: blur(2px);
        transition: filter 0.3s ease;
    }
    
    .masonry-item.loaded .lazy-load {
        filter: none;
    }
    
    .lightbox-counter {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: #ffffff;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        letter-spacing: 1px;
    }
`;
document.head.appendChild(style);