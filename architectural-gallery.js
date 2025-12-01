// Architectural Gallery - S3 Integration
document.addEventListener('DOMContentLoaded', function () {
    const gallery = document.getElementById('architecturalGallery');

    if (!gallery) {
        console.error('Architectural gallery element not found!');
        return;
    }

    // S3 URL format (same as other galleries)
    const S3_BUCKET_URL = 'https://s3.eu-north-1.amazonaws.com/pelechmedia.co.uk';

    // Generate image URLs for architectural photos (16 images)
    const architecturalImageFilenames = [
        'architect 1.jpg',
        'architect 2.jpg',
        'architect 3.jpg',
        'architect 4.jpg',
        'architect 5.jpg',
        'architect 6.jpg',
        'architect 7.jpg',
        'architect 8.jpg',
        'architect 9.jpg',
        'architect 10.jpg',
        'architect 11.jpg',
        'architect 12.jpg',
        'architect 13.jpg',
        'architect 14.jpg',
        'architect 15.jpg',
        'architect 16.jpg'
    ];

    const architecturalImages = architecturalImageFilenames.map(filename =>
        `${S3_BUCKET_URL}/images/architect/${filename}`
    );

    console.log('Generated', architecturalImages.length, 'architectural image URLs');
    console.log('Using S3 URL format:', S3_BUCKET_URL);

    // Show loading state
    gallery.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading ${architecturalImages.length} architectural photos...</p>
        </div>
    `;

    // Create gallery items in batches for faster initial load
    function createGallery() {
        gallery.innerHTML = '';

        // Load all 16 images at once since it's a smaller collection
        architecturalImages.forEach((imageSrc, index) => {
            createImageItem(imageSrc, index);
        });

        // Initialize lazy loading and animations
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
        img.alt = `Architectural Photo ${index + 1}`;
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
        item.addEventListener('click', () => openLightbox(index, architecturalImages));

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
                    if (currentIndex < architecturalImages.length - 3) {
                        setTimeout(() => {
                            for (let i = 1; i <= 3; i++) {
                                if (currentIndex + i < architecturalImages.length) {
                                    const preloadImg = new Image();
                                    preloadImg.src = architecturalImages[currentIndex + i];
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
                    <span id="current-image-number">1</span> / <span id="total-images">${architecturalImages.length}</span>
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
        lightboxImg.alt = `Architectural Photo ${imageNumber}`;

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