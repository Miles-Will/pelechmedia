// Category-specific image collections
const categoryImages = {
    sports: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1594736797933-d0bd5c0c2e8b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1546608235-e4cba2ad3e52?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1593786481537-6be0d08e1a2b?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1606115055346-4fb9a24e7cc4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1594736797933-d0bd5c0c2e8b?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1593786481537-6be0d08e1a2b?w=800&h=800&fit=crop'
    ],
    concerts: [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1514533212767-5c446350b2cd?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1525915334803-d0d3a0b20b3e?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1514533212767-5c446350b2cd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=1200&fit=crop'
    ],
    nature: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1418065460487-3956ef847d1f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1000&fit=crop'
    ],
    animals: [
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553736026-f046b5e52da2?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1549291981-56d443d5e2a2?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1596492784531-6e4eb5ea9993?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1571988840298-3b5301d5109b?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553736026-f046b5e52da2?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1549291981-56d443d5e2a2?w=800&h=800&fit=crop'
    ],
    portraits: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616c96e5e63?w=800&h=1200&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1200&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&h=1200&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1502720705749-871143f0e671?w=800&h=800&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616c96e5e63?w=800&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&crop=face'
    ]
};

let currentLightboxIndex = 0;
let currentCategory = '';
let currentImages = [];

function getCurrentCategory() {
    const path = window.location.pathname;
    if (path.includes('sports')) return 'sports';
    if (path.includes('concerts')) return 'concerts';
    if (path.includes('nature')) return 'nature';
    if (path.includes('animals')) return 'animals';
    if (path.includes('portraits')) return 'portraits';
    return '';
}

function createMasonryItem(imageSrc, index) {
    const item = document.createElement('div');
    item.className = 'masonry-item';
    item.innerHTML = `<img src="${imageSrc}" alt="${currentCategory} photography ${index + 1}" loading="lazy">`;
    item.addEventListener('click', () => openLightbox(index));
    return item;
}

function loadCategoryGallery() {
    currentCategory = getCurrentCategory();
    currentImages = categoryImages[currentCategory] || [];

    const galleryContainer = document.getElementById(`${currentCategory}Gallery`);
    if (!galleryContainer || currentImages.length === 0) return;

    galleryContainer.innerHTML = '';

    currentImages.forEach((imageSrc, index) => {
        const masonryItem = createMasonryItem(imageSrc, index);
        galleryContainer.appendChild(masonryItem);

        // Stagger the animations
        setTimeout(() => {
            masonryItem.classList.add('visible');
        }, index * 100);
    });
}

function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
            <button class="lightbox-nav lightbox-prev" onclick="prevImage()">‹</button>
            <img id="lightboxImage" src="" alt="Full size image">
            <button class="lightbox-nav lightbox-next" onclick="nextImage()">›</button>
        </div>
    `;
    document.body.appendChild(lightbox);
}

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');

    if (!lightbox) {
        createLightbox();
        return openLightbox(index);
    }

    lightboxImage.src = currentImages[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentImages.length;
    document.getElementById('lightboxImage').src = currentImages[currentLightboxIndex];
}

function prevImage() {
    currentLightboxIndex = currentLightboxIndex === 0 ? currentImages.length - 1 : currentLightboxIndex - 1;
    document.getElementById('lightboxImage').src = currentImages[currentLightboxIndex];
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    loadCategoryGallery();

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function (e) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        }
    });

    // Close lightbox when clicking outside the image
    document.addEventListener('click', function (e) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && e.target === lightbox) {
            closeLightbox();
        }
    });
});

// Make functions global for onclick handlers
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.nextImage = nextImage;
window.prevImage = prevImage;