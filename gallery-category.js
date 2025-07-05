// Dynamic gallery loading from Google Drive
class DriveGallery {
    constructor() {
        // Google Drive folder IDs - REPLACE THESE WITH YOUR ACTUAL FOLDER IDs
        this.folders = {
            'sports': 'YOUR_SPORTS_FOLDER_ID',        // Replace with your Sports folder ID
            'concerts': 'YOUR_CONCERTS_FOLDER_ID',    // Replace with your Concerts folder ID
            'nature': 'YOUR_NATURE_FOLDER_ID',        // Replace with your Nature folder ID
            'architectural': 'YOUR_ARCHITECTURAL_FOLDER_ID', // Replace with your Architectural folder ID
            'animals': 'YOUR_ANIMALS_FOLDER_ID',      // Replace with your Animals folder ID
            'portraits': 'YOUR_PORTRAITS_FOLDER_ID'   // Replace with your Portraits folder ID
        };

        this.currentCategory = this.getCategoryFromURL();
        this.images = [];
        this.currentImageIndex = 0;

        this.initializePage();
    }

    getCategoryFromURL() {
        const page = window.location.pathname.split('/').pop();
        if (page.includes('sports')) return 'sports';
        if (page.includes('concerts')) return 'concerts';
        if (page.includes('nature')) return 'nature';
        if (page.includes('architectural')) return 'architectural';
        if (page.includes('animals')) return 'animals';
        if (page.includes('portraits')) return 'portraits';
        return 'sports'; // default
    }

    async initializePage() {
        this.showLoading();

        try {
            await this.loadImagesFromDrive();
            this.renderGallery();
            this.setupLightbox();
        } catch (error) {
            console.error('Error loading gallery:', error);
            this.showError();
        }
    }

    async loadImagesFromDrive() {
        const folderId = this.folders[this.currentCategory];

        if (!folderId || folderId === `YOUR_${this.currentCategory.toUpperCase()}_FOLDER_ID`) {
            // Fallback to placeholder images if Drive not configured
            this.loadPlaceholderImages();
            return;
        }

        try {
            // Convert share link to API call
            const apiUrl = `https://drive.google.com/drive/folders/${folderId}`;

            // For now, we'll use placeholder images
            // In production, you'd implement the Google Drive API
            this.loadPlaceholderImages();

        } catch (error) {
            console.error('Drive API error:', error);
            this.loadPlaceholderImages();
        }
    }

    loadPlaceholderImages() {
        // Placeholder images while Drive integration is being set up
        const placeholders = {
            sports: [
                'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
            ],
            concerts: [
                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop'
            ],
            nature: [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
            ],
            architectural: [
                'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=1000&fit=crop',
                'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&h=1200&fit=crop',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=1000&fit=crop',
                'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1486325008319-6b0961bb8a92?w=800&h=1200&fit=crop',
                'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&h=1000&fit=crop',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1200&fit=crop'
            ],
            animals: [
                'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800&h=600&fit=crop'
            ],
            portraits: [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1503235930437-8c6293ba41f5?w=800&h=600&fit=crop'
            ]
        };

        this.images = placeholders[this.currentCategory] || placeholders.sports;
    }

    renderGallery() {
        const gallery = document.querySelector('.gallery-masonry');
        if (!gallery) return;

        gallery.innerHTML = '';

        this.images.forEach((imageUrl, index) => {
            const item = document.createElement('div');
            item.className = 'masonry-item';
            item.innerHTML = `
                <img src="${imageUrl}" alt="${this.currentCategory} photo ${index + 1}" loading="lazy">
            `;

            item.addEventListener('click', () => {
                this.openLightbox(index);
            });

            gallery.appendChild(item);

            // Animate in
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100);
        });

        this.hideLoading();
    }

    setupLightbox() {
        // Create lightbox if it doesn't exist
        if (!document.querySelector('.lightbox')) {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <button class="lightbox-nav lightbox-prev">‹</button>
                    <img src="" alt="">
                    <button class="lightbox-nav lightbox-next">›</button>
                </div>
            `;
            document.body.appendChild(lightbox);

            // Event listeners
            lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
                this.closeLightbox();
            });

            lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
                this.previousImage();
            });

            lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
                this.nextImage();
            });

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.closeLightbox();
                }
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('active')) return;

                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.previousImage();
                if (e.key === 'ArrowRight') this.nextImage();
            });
        }
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        const lightbox = document.querySelector('.lightbox');
        const img = lightbox.querySelector('img');

        img.src = this.images[index];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        const img = document.querySelector('.lightbox img');
        img.src = this.images[this.currentImageIndex];
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        const img = document.querySelector('.lightbox img');
        img.src = this.images[this.currentImageIndex];
    }

    showLoading() {
        const gallery = document.querySelector('.gallery-masonry');
        if (gallery) {
            gallery.innerHTML = '<div style="text-align: center; padding: 60px; color: #aaa;">Loading images...</div>';
        }
    }

    hideLoading() {
        // Loading is hidden when gallery renders
    }

    showError() {
        const gallery = document.querySelector('.gallery-masonry');
        if (gallery) {
            gallery.innerHTML = '<div style="text-align: center; padding: 60px; color: #ff6b6b;">Error loading images. Please try again later.</div>';
        }
    }
}

// Initialize gallery when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.category-gallery')) {
        new DriveGallery();
    }
});

// Function to configure Google Drive folders (call this after setting up Drive)
window.configureDriveFolders = function (folderIds) {
    const gallery = new DriveGallery();
    gallery.folders = folderIds;
    gallery.initializePage();
};