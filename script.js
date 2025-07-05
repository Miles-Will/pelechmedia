// Main website functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize gallery animations
    initializeGalleryAnimations();

    // Initialize featured gallery slideshow
    initializeFeaturedGallery();

    // Load dynamic category previews from Google Drive
    loadCategoryPreviews();

    // Initialize navigation
    initializeNavigation();
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
    // Featured gallery images - you can replace these with your actual featured images
    const featuredImages = [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'
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

    // Create gallery items
    function createGalleryItems(startIndex = 0) {
        galleryGrid.innerHTML = '';

        // Show 4 images at a time
        for (let i = 0; i < 4; i++) {
            const imageIndex = (startIndex + i) % featuredImages.length;
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="${featuredImages[imageIndex]}" alt="Featured Work ${imageIndex + 1}" loading="lazy">`;
            galleryGrid.appendChild(galleryItem);
        }

        // Trigger animation
        setTimeout(() => {
            galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
                item.classList.add('visible');
            });
        }, 100);
    }

    // Auto-advance slideshow
    function startSlideshow() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            if (isPlaying) {
                currentIndex = (currentIndex + 4) % featuredImages.length;
                createGalleryItems(currentIndex);
            }
        }, 4000); // Change every 4 seconds
    }

    // Initialize with first set of images
    createGalleryItems(currentIndex);
    startSlideshow();

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
        currentIndex = (currentIndex + 4) % featuredImages.length;
        createGalleryItems(currentIndex);

        // Reset the slideshow timer
        if (isPlaying) {
            startSlideshow();
        }
    });

    prevBtn.addEventListener('click', function () {
        currentIndex = (currentIndex - 4 + featuredImages.length) % featuredImages.length;
        createGalleryItems(currentIndex);

        // Reset the slideshow timer
        if (isPlaying) {
            startSlideshow();
        }
    });
}

function loadCategoryPreviews() {
    // Google Drive folder IDs - REPLACE THESE WITH YOUR ACTUAL FOLDER IDs
    const categoryFolders = {
        'sports': 'YOUR_SPORTS_FOLDER_ID',        // Replace with your Sports folder ID
        'concerts': 'YOUR_CONCERTS_FOLDER_ID',    // Replace with your Concerts folder ID
        'nature': 'YOUR_NATURE_FOLDER_ID',        // Replace with your Nature folder ID
        'architectural': 'YOUR_ARCHITECTURAL_FOLDER_ID', // Replace with your Architectural folder ID
        'animals': 'YOUR_ANIMALS_FOLDER_ID',      // Replace with your Animals folder ID
        'portraits': 'YOUR_PORTRAITS_FOLDER_ID'   // Replace with your Portraits folder ID
    };

    // Update category card images with latest from Google Drive
    Object.keys(categoryFolders).forEach(category => {
        updateCategoryPreview(category, categoryFolders[category]);
    });
}

async function updateCategoryPreview(category, folderId) {
    try {
        // For now, we'll use placeholder logic
        // In production, this would fetch from Google Drive API

        if (!folderId || folderId.startsWith('YOUR_')) {
            // Keep existing placeholder images
            return;
        }

        // TODO: Implement Google Drive API call
        // const latestImage = await getLatestImageFromDrive(folderId);
        // updateCategoryCardImage(category, latestImage);

    } catch (error) {
        console.error(`Error updating ${category} preview:`, error);
    }
}

function updateCategoryCardImage(category, imageUrl) {
    const categoryCard = document.querySelector(`[data-category="${category}"]`);
    if (categoryCard) {
        const img = categoryCard.querySelector('.category-image img');
        if (img) {
            img.src = imageUrl;
        }
    }
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

// Function to manually refresh gallery from Google Drive
window.refreshGalleryFromDrive = function () {
    loadCategoryPreviews();

    // If we're on a gallery page, refresh that too
    if (document.querySelector('.category-gallery')) {
        const gallery = new DriveGallery();
        gallery.initializePage();
    }
};