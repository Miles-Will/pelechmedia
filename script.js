// Sample image archive - replace with your actual images
const imageArchive = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1418065460487-3956ef847d1f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1471115853179-bb1d604434e0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1457269449834-928af64c684d?w=800&h=600&fit=crop'
];

let currentImageSet = 0;
let isPlaying = true;
let rotationInterval;
const imagesPerPage = 10;

function createGalleryItem(imageSrc, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${imageSrc}" alt="Photography ${index + 1}" loading="lazy">`;
    return item;
}

function displayImages(startIndex = 0) {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';

    const imagesPerPage = 4; // Changed to 4 for single row
    const endIndex = Math.min(startIndex + imagesPerPage, imageArchive.length);

    for (let i = startIndex; i < endIndex; i++) {
        const galleryItem = createGalleryItem(imageArchive[i], i);
        galleryGrid.appendChild(galleryItem);

        // Stagger the animations
        setTimeout(() => {
            galleryItem.classList.add('visible');
        }, (i - startIndex) * 100);
    }
}

function nextImageSet() {
    const imagesPerPage = 4; // Changed to 4 for single row
    const maxSets = Math.ceil(imageArchive.length / imagesPerPage);
    currentImageSet = (currentImageSet + 1) % maxSets;
    displayImages(currentImageSet * imagesPerPage);
}

function prevImageSet() {
    const imagesPerPage = 4; // Changed to 4 for single row
    const maxSets = Math.ceil(imageArchive.length / imagesPerPage);
    currentImageSet = currentImageSet === 0 ? maxSets - 1 : currentImageSet - 1;
    displayImages(currentImageSet * imagesPerPage);
}

function startRotation() {
    if (rotationInterval) clearInterval(rotationInterval);
    rotationInterval = setInterval(nextImageSet, 4000);
}

function stopRotation() {
    if (rotationInterval) {
        clearInterval(rotationInterval);
        rotationInterval = null;
    }
}

function togglePlayPause() {
    const pauseBtn = document.getElementById('pauseBtn');
    if (isPlaying) {
        stopRotation();
        pauseBtn.textContent = 'PLAY';
        pauseBtn.classList.remove('active');
        isPlaying = false;
    } else {
        startRotation();
        pauseBtn.textContent = 'PAUSE';
        pauseBtn.classList.add('active');
        isPlaying = true;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Initialize gallery
    displayImages();
    startRotation();

    // Button event listeners
    document.getElementById('pauseBtn').addEventListener('click', togglePlayPause);
    document.getElementById('nextBtn').addEventListener('click', () => {
        nextImageSet();
        if (isPlaying) {
            stopRotation();
            startRotation(); // Restart the timer
        }
    });
    document.getElementById('prevBtn').addEventListener('click', () => {
        prevImageSet();
        if (isPlaying) {
            stopRotation();
            startRotation(); // Restart the timer
        }
    });

    // Smooth scrolling for navigation links
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

    // Navigation background on scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });

    // Pause rotation when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying) {
            stopRotation();
        } else if (!document.hidden && isPlaying) {
            startRotation();
        }
    });
});