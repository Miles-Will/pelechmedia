// Optimized Flickr Gallery Integration - Fast Image Navigation
// Enhanced with intelligent preloading and caching for instant navigation

const FLICKR_CONFIG = {
    API_KEY: 'b25a43d7b9803da9165d0fcf8e73d671',
    USER_ID: '201997796@N06'
};

class FlickrGallery {
    constructor(galleryElement) {
        console.log('Creating FlickrGallery with element:', galleryElement);

        if (!galleryElement) {
            throw new Error('Gallery element is null or undefined');
        }

        this.galleryElement = galleryElement;
        this.currentPhotos = [];
        this.currentPhotoIndex = 0;
        this.allAlbums = [];
        this.currentAlbumIndex = 0;
        this.config = this.getGalleryConfig();

        // NEW: Image caching and preloading system
        this.imageCache = new Map(); // Cache loaded images
        this.preloadQueue = new Set(); // Track preloading operations
        this.loadingStates = new Map(); // Track loading states

        console.log('Gallery config:', this.config);

        this.initializeElements();
        this.bindEvents();
    }

    getGalleryConfig() {
        const element = this.galleryElement;
        return {
            userId: element.dataset.flickrUser || FLICKR_CONFIG.USER_ID,
            filterTag: element.dataset.flickrTag || null,
            albumPrefix: element.dataset.flickrPrefix || null,
            loadingText: element.dataset.loadingText || 'Loading albums...',
            backText: element.dataset.backText || '← Back to Albums',
            galleryTitle: element.dataset.galleryTitle || 'Photo Gallery'
        };
    }

    initializeElements() {
        this.createGalleryHTML();
        this.loading = this.galleryElement.querySelector('.flickr-loading');
        this.albumsView = this.galleryElement.querySelector('.flickr-albums-view');
        this.photoGalleryView = this.galleryElement.querySelector('.flickr-photo-gallery-view');
        this.albumsGrid = this.galleryElement.querySelector('.flickr-albums-container');
        this.photosGrid = this.galleryElement.querySelector('.flickr-photos-grid');
        this.backToAlbumsBtn = this.galleryElement.querySelector('.flickr-back-to-albums');
        this.nextAlbumBtn = this.galleryElement.querySelector('.flickr-next-album');
        this.currentAlbumTitle = this.galleryElement.querySelector('.flickr-current-album-title');
        this.lightbox = this.galleryElement.querySelector('.flickr-lightbox');
        this.lightboxImg = this.galleryElement.querySelector('.flickr-lightbox-img');
        this.lightboxClose = this.galleryElement.querySelector('.flickr-lightbox-close');
        this.lightboxPrev = this.galleryElement.querySelector('.flickr-lightbox-prev');
        this.lightboxNext = this.galleryElement.querySelector('.flickr-lightbox-next');
    }

    createGalleryHTML() {
        this.galleryElement.innerHTML = '';

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'flickr-loading';
        loadingDiv.textContent = this.config.loadingText;

        const albumsView = document.createElement('div');
        albumsView.className = 'flickr-albums-view';
        albumsView.style.display = 'none';

        const albumsContainer = document.createElement('div');
        albumsContainer.className = 'flickr-albums-container';
        albumsView.appendChild(albumsContainer);

        const photoGalleryView = document.createElement('div');
        photoGalleryView.className = 'flickr-photo-gallery-view';
        photoGalleryView.style.display = 'none';

        const galleryHeader = document.createElement('div');
        galleryHeader.className = 'flickr-gallery-header';

        const albumTitle = document.createElement('h2');
        albumTitle.className = 'flickr-current-album-title';

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flickr-header-buttons';

        const backButton = document.createElement('button');
        backButton.className = 'flickr-back-to-albums';
        backButton.textContent = this.config.backText;

        const nextButton = document.createElement('button');
        nextButton.className = 'flickr-next-album';
        nextButton.textContent = 'Next Album →';

        buttonsContainer.appendChild(backButton);
        buttonsContainer.appendChild(nextButton);

        galleryHeader.appendChild(albumTitle);
        galleryHeader.appendChild(buttonsContainer);

        const photosContainer = document.createElement('div');
        photosContainer.className = 'flickr-photos-container';

        const photosGrid = document.createElement('div');
        photosGrid.className = 'flickr-photos-grid';
        photosContainer.appendChild(photosGrid);

        photoGalleryView.appendChild(galleryHeader);
        photoGalleryView.appendChild(photosContainer);

        const lightbox = document.createElement('div');
        lightbox.className = 'flickr-lightbox';
        lightbox.style.display = 'none';

        const lightboxClose = document.createElement('button');
        lightboxClose.className = 'flickr-lightbox-close';
        lightboxClose.innerHTML = '&times;';

        const lightboxPrev = document.createElement('button');
        lightboxPrev.className = 'flickr-lightbox-nav flickr-lightbox-prev';
        lightboxPrev.innerHTML = '‹';

        const lightboxImg = document.createElement('img');
        lightboxImg.className = 'flickr-lightbox-img';
        lightboxImg.src = '';
        lightboxImg.alt = '';

        const lightboxNext = document.createElement('button');
        lightboxNext.className = 'flickr-lightbox-nav flickr-lightbox-next';
        lightboxNext.innerHTML = '›';

        lightbox.appendChild(lightboxClose);
        lightbox.appendChild(lightboxPrev);
        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(lightboxNext);

        this.galleryElement.appendChild(loadingDiv);
        this.galleryElement.appendChild(albumsView);
        this.galleryElement.appendChild(photoGalleryView);
        this.galleryElement.appendChild(lightbox);

        console.log('Gallery HTML structure created successfully');
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.lightbox && this.lightbox.style.display === 'flex') {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.prevPhoto();
                if (e.key === 'ArrowRight') this.nextPhoto();
            }
        });
    }

    // NEW: Intelligent image preloading system
    async preloadImage(url, priority = 'normal') {
        if (this.imageCache.has(url)) {
            return this.imageCache.get(url);
        }

        if (this.preloadQueue.has(url)) {
            // Already being loaded, wait for it
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (this.imageCache.has(url)) {
                        clearInterval(checkInterval);
                        resolve(this.imageCache.get(url));
                    }
                }, 50);
            });
        }

        this.preloadQueue.add(url);

        return new Promise((resolve, reject) => {
            const img = new Image();

            // Set priority for faster loading
            if (priority === 'high') {
                img.fetchPriority = 'high';
            }

            img.onload = () => {
                this.imageCache.set(url, img);
                this.preloadQueue.delete(url);
                console.log(`Preloaded image: ${url}`);
                resolve(img);
            };

            img.onerror = () => {
                this.preloadQueue.delete(url);
                console.error(`Failed to preload image: ${url}`);
                reject(new Error(`Failed to load image: ${url}`));
            };

            img.src = url;
        });
    }

    // NEW: Preload adjacent images for instant navigation
    async preloadAdjacentImages(currentIndex) {
        if (this.currentPhotos.length === 0) return;

        const preloadPromises = [];

        // Preload 2 images in each direction with high priority for immediate neighbors
        for (let offset = -2; offset <= 2; offset++) {
            if (offset === 0) continue; // Skip current image

            const index = (currentIndex + offset + this.currentPhotos.length) % this.currentPhotos.length;
            const photo = this.currentPhotos[index];

            if (photo) {
                const imageUrl = this.getHighestQualityImageUrl(photo);
                const priority = Math.abs(offset) === 1 ? 'high' : 'normal';
                preloadPromises.push(this.preloadImage(imageUrl, priority));
            }
        }

        // Don't wait for all to complete, but start them all
        Promise.allSettled(preloadPromises).then(() => {
            console.log(`Preloaded adjacent images for index ${currentIndex}`);
        });
    }

    // NEW: Get highest quality image URL with fallback logic
    getHighestQualityImageUrl(photo) {
        if (photo.url_o) return photo.url_o; // Original
        if (photo.url_k) return photo.url_k; // Large 2048
        if (photo.url_h) return photo.url_h; // Large 1600
        if (photo.url_l) return photo.url_l; // Large 1024
        if (photo.url_b) return photo.url_b; // Large 1024
        return photo.url_m; // Medium 500 (fallback)
    }

    async getPhotosets() {
        try {
            console.log('Making API request to Flickr...');
            const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${FLICKR_CONFIG.API_KEY}&user_id=${this.config.userId}&format=json&nojsoncallback=1`;
            console.log('API URL:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Raw API response:', data);

            if (data.stat === 'fail') {
                console.error('Flickr API error:', data);
                throw new Error(data.message || 'Flickr API returned an error');
            }

            let albums = data.photosets ? data.photosets.photoset : [];
            console.log('Total albums from API:', albums.length);

            if (this.config.albumPrefix) {
                const keywords = this.config.albumPrefix.split(',').map(k => k.trim().toLowerCase());
                console.log('Filtering albums with keywords:', keywords);

                const originalCount = albums.length;
                albums = albums.filter(album => {
                    const title = album.title._content.toLowerCase();
                    const matches = keywords.some(keyword => title.includes(keyword));
                    if (matches) {
                        console.log('Album matches filter:', album.title._content);
                    }
                    return matches;
                });

                console.log(`Filtered from ${originalCount} to ${albums.length} albums`);
            }

            return albums;
        } catch (error) {
            console.error('Error in getPhotosets:', error);
            throw error;
        }
    }

    async getPhotosFromSet(photosetId) {
        try {
            const response = await fetch(
                `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${FLICKR_CONFIG.API_KEY}&photoset_id=${photosetId}&extras=url_m,url_b,url_l,url_o,url_h,url_k&format=json&nojsoncallback=1`
            );
            const data = await response.json();

            if (data.stat === 'fail') {
                throw new Error(data.message || 'Failed to fetch photos');
            }

            return data.photoset ? data.photoset.photo : [];
        } catch (error) {
            console.error('Error fetching photos:', error);
            return [];
        }
    }

    displayAlbums(albums) {
        console.log('displayAlbums called with', albums.length, 'albums');

        this.allAlbums = albums;

        if (!this.albumsGrid) {
            console.error('albumsGrid is null!');
            return;
        }

        this.albumsGrid.innerHTML = '';

        const isMobile = window.innerWidth <= 768;

        this.albumsGrid.className = 'flickr-albums-container';

        if (isMobile) {
            this.albumsGrid.setAttribute('style', `
                display: grid !important;
                grid-template-columns: 1fr !important;
                gap: 20px !important;
                padding: 20px !important;
                max-width: 350px !important;
                width: 100% !important;
                margin: 0 auto !important;
                box-sizing: border-box !important;
                justify-items: center !important;
            `);
        } else {
            this.albumsGrid.setAttribute('style', `
                display: grid !important;
                grid-template-columns: repeat(5, 250px) !important;
                gap: 25px !important;
                padding: 40px !important;
                width: fit-content !important;
                margin: 0 auto !important;
                box-sizing: border-box !important;
            `);
        }

        if (albums.length === 0) {
            this.albumsGrid.innerHTML = '<p style="text-align: center; width: 100%; padding: 40px; color: #666;">No albums found.</p>';
            return;
        }

        const albumSize = isMobile ? 280 : 250;
        console.log(`Creating ${albums.length} albums at ${albumSize}px each`);

        albums.forEach((album, index) => {
            console.log(`Creating album ${index + 1}: ${album.title._content}`);

            const albumCard = document.createElement('div');
            albumCard.onclick = () => this.openAlbum(album.id, album.title._content, index);

            albumCard.setAttribute('style', `
                width: ${albumSize}px !important;
                height: ${albumSize}px !important;
                background: white !important;
                border-radius: 12px !important;
                overflow: hidden !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                position: relative !important;
                box-sizing: border-box !important;
                display: block !important;
                margin: 0 !important;
                padding: 0 !important;
            `);

            const coverUrl = `https://live.staticflickr.com/${album.server}/${album.primary}_${album.secret}_m.jpg`;

            const albumCover = document.createElement('div');
            albumCover.setAttribute('style', `
                width: 100% !important;
                height: ${Math.floor(albumSize * 0.7)}px !important;
                background-image: url('${coverUrl}') !important;
                background-size: cover !important;
                background-position: center !important;
                background-color: #2a2a2a !important;
                position: relative !important;
                margin: 0 !important;
                padding: 0 !important;
                display: block !important;
            `);

            const albumInfo = document.createElement('div');
            albumInfo.setAttribute('style', `
                padding: 15px !important;
                background: #1a1a1a !important;
                text-align: center !important;
                height: ${Math.floor(albumSize * 0.3)}px !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                width: 100% !important;
            `);

            const albumTitle = document.createElement('div');
            albumTitle.textContent = album.title._content;
            albumTitle.setAttribute('style', `
                color: #ffffff !important;
                font-size: ${isMobile ? '14px' : '15px'} !important;
                font-weight: 300 !important;
                letter-spacing: 1px !important;
                text-transform: uppercase !important;
                margin-bottom: 5px !important;
                line-height: 1.2 !important;
                text-align: center !important;
                display: block !important;
                width: 100% !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                white-space: nowrap !important;
            `);

            const albumCount = document.createElement('div');
            albumCount.textContent = `${album.photos} photos`;
            albumCount.setAttribute('style', `
                color: #cccccc !important;
                font-size: ${isMobile ? '12px' : '13px'} !important;
                font-weight: 300 !important;
                letter-spacing: 0.5px !important;
                text-align: center !important;
                display: block !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            `);

            albumInfo.appendChild(albumTitle);
            albumInfo.appendChild(albumCount);
            albumCard.appendChild(albumCover);
            albumCard.appendChild(albumInfo);

            this.albumsGrid.appendChild(albumCard);

            console.log(`Album ${index + 1} added to grid`);
        });

        console.log(`${albums.length} albums displayed in centered grid layout`);
    }

    async openAlbum(albumId, albumTitle, albumIndex = 0) {
        this.loading.style.display = 'block';
        this.albumsView.style.display = 'none';

        this.currentAlbumIndex = albumIndex;

        const photos = await this.getPhotosFromSet(albumId);
        this.currentPhotos = photos;

        // NEW: Preload first few images immediately when album opens
        if (photos.length > 0) {
            console.log('Starting immediate preload of first images...');
            this.preloadAdjacentImages(0);
        }

        this.currentAlbumTitle.textContent = albumTitle;
        this.displayPhotos(photos);

        this.updateNextAlbumButton();

        this.loading.style.display = 'none';
        this.photoGalleryView.style.display = 'block';
    }

    updateNextAlbumButton() {
        if (this.nextAlbumBtn) {
            const hasNextAlbum = this.currentAlbumIndex < this.allAlbums.length - 1;
            this.nextAlbumBtn.style.display = hasNextAlbum ? 'inline-block' : 'none';

            if (hasNextAlbum) {
                const nextAlbum = this.allAlbums[this.currentAlbumIndex + 1];
                this.nextAlbumBtn.textContent = `Next: ${nextAlbum.title._content.substring(0, 15)}${nextAlbum.title._content.length > 15 ? '...' : ''} →`;
            }
        }
    }

    async openNextAlbum() {
        if (this.currentAlbumIndex < this.allAlbums.length - 1) {
            const nextAlbum = this.allAlbums[this.currentAlbumIndex + 1];
            await this.openAlbum(nextAlbum.id, nextAlbum.title._content, this.currentAlbumIndex + 1);
        }
    }

    displayPhotos(photos) {
        console.log('=== DISPLAYING PHOTOS WITH IMPROVED ASPECT RATIO HANDLING ===');
        this.photosGrid.innerHTML = '';

        const isMobile = window.innerWidth <= 768;

        this.photosGrid.className = 'flickr-photos-grid';

        if (isMobile) {
            this.photosGrid.style.cssText = `
                display: grid !important;
                grid-template-columns: 1fr !important;
                gap: 20px !important;
                padding: 20px !important;
                max-width: 350px !important;
                width: 100% !important;
                margin: 0 auto !important;
                box-sizing: border-box !important;
                justify-items: center !important;
            `;
        } else {
            this.photosGrid.style.cssText = `
                display: grid !important;
                grid-template-columns: repeat(5, 250px) !important;
                gap: 25px !important;
                padding: 40px !important;
                width: fit-content !important;
                margin: 0 auto !important;
                box-sizing: border-box !important;
            `;
        }

        if (photos.length === 0) {
            this.photosGrid.innerHTML = '<p style="text-align: center; width: 100%; padding: 40px; color: #666;">No photos found in this album.</p>';
            return;
        }

        const photoSize = isMobile ? 280 : 250;

        photos.forEach((photo, index) => {
            console.log(`Creating photo ${index + 1} with improved sizing`);

            const photoItem = document.createElement('div');
            photoItem.onclick = () => this.openLightbox(index);

            photoItem.style.cssText = `
                width: ${photoSize}px !important;
                background: transparent !important;
                border-radius: 12px !important;
                overflow: hidden !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                position: relative !important;
                box-sizing: border-box !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                min-height: 200px !important;
                max-height: 400px !important;
            `;

            const img = document.createElement('img');
            img.src = photo.url_m;
            img.alt = photo.title;
            img.loading = 'lazy';

            img.style.cssText = `
                width: 100% !important;
                height: auto !important;
                object-fit: cover !important;
                border-radius: 12px !important;
                display: block !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                box-sizing: border-box !important;
                min-height: 200px !important;
                max-height: 400px !important;
            `;

            img.onload = () => {
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                console.log(`Image ${index + 1} aspect ratio: ${aspectRatio.toFixed(2)} (${img.naturalWidth}x${img.naturalHeight})`);

                if (aspectRatio < 0.8) { // Portrait
                    photoItem.style.height = `${Math.min(400, photoSize * 1.4)}px`;
                    img.style.height = '100%';
                    img.style.width = 'auto';
                    img.style.objectFit = 'cover';
                } else if (aspectRatio > 1.5) { // Landscape
                    photoItem.style.height = `${Math.max(200, photoSize * 0.7)}px`;
                } else { // Square-ish
                    photoItem.style.height = `${photoSize}px`;
                }
            };

            photoItem.appendChild(img);
            this.photosGrid.appendChild(photoItem);

            console.log(`Photo ${index + 1} created with flexible sizing`);
        });

        console.log(`${photos.length} photos displayed with improved aspect ratio handling`);
    }

    // OPTIMIZED: Fast lightbox with instant image loading
    async openLightbox(index) {
        this.currentPhotoIndex = index;
        const photo = this.currentPhotos[index];

        console.log(`Opening lightbox for photo ${index + 1}: ${photo.title}`);

        // Show lightbox immediately
        this.lightbox.style.display = 'flex';
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Get the best image URL
        const imageUrl = this.getHighestQualityImageUrl(photo);

        // NEW: Check if image is already cached for instant display
        if (this.imageCache.has(imageUrl)) {
            console.log('Using cached image for instant display');
            const cachedImg = this.imageCache.get(imageUrl);
            this.lightboxImg.src = cachedImg.src;
            this.lightboxImg.alt = photo.title || `Photo ${index + 1}`;

            // Apply optimized styling immediately
            this.applyLightboxImageStyling();
        } else {
            // Show loading placeholder while image loads
            this.showLightboxLoading();

            try {
                await this.preloadImage(imageUrl, 'high');
                this.lightboxImg.src = imageUrl;
                this.lightboxImg.alt = photo.title || `Photo ${index + 1}`;
                this.applyLightboxImageStyling();
                this.hideLightboxLoading();
            } catch (error) {
                console.error('Failed to load lightbox image, trying fallback');
                this.loadFallbackImage(photo);
            }
        }

        // NEW: Immediately start preloading adjacent images
        this.preloadAdjacentImages(index);

        console.log(`Opened lightbox for photo ${index + 1}: ${photo.title}`);
    }

    // NEW: Apply consistent lightbox image styling
    applyLightboxImageStyling() {
        this.lightboxImg.style.cssText = `
            max-width: 90vw !important;
            max-height: 90vh !important;
            width: auto !important;
            height: auto !important;
            object-fit: contain !important;
            border-radius: 8px !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
            display: block !important;
            margin: 0 auto !important;
            image-orientation: from-image !important;
        `;
    }

    // NEW: Show loading state in lightbox
    showLightboxLoading() {
        this.lightboxImg.style.opacity = '0.3';
        this.lightboxImg.style.filter = 'blur(2px)';
    }

    // NEW: Hide loading state
    hideLightboxLoading() {
        this.lightboxImg.style.opacity = '1';
        this.lightboxImg.style.filter = 'none';
        this.lightboxImg.style.transition = 'opacity 0.2s ease, filter 0.2s ease';
    }

    // NEW: Load fallback image if high-res fails
    async loadFallbackImage(photo) {
        const fallbackUrl = photo.url_l || photo.url_b || photo.url_m;
        if (fallbackUrl && fallbackUrl !== this.lightboxImg.src) {
            try {
                await this.preloadImage(fallbackUrl, 'high');
                this.lightboxImg.src = fallbackUrl;
                this.applyLightboxImageStyling();
                this.hideLightboxLoading();
            } catch (fallbackError) {
                console.error('Even fallback image failed to load');
                this.hideLightboxLoading();
            }
        }
    }

    closeLightbox() {
        this.lightbox.style.display = 'none';
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Closed lightbox');
    }

    // OPTIMIZED: Instant navigation with cached images
    async nextPhoto() {
        if (this.currentPhotos.length === 0) return;

        this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.currentPhotos.length;
        await this.updateLightboxImageFast();

        // Preload new adjacent images
        this.preloadAdjacentImages(this.currentPhotoIndex);

        console.log(`Next photo: ${this.currentPhotoIndex + 1} of ${this.currentPhotos.length}`);
    }

    // OPTIMIZED: Instant navigation with cached images
    async prevPhoto() {
        if (this.currentPhotos.length === 0) return;

        this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.currentPhotos.length) % this.currentPhotos.length;
        await this.updateLightboxImageFast();

        // Preload new adjacent images
        this.preloadAdjacentImages(this.currentPhotoIndex);

        console.log(`Previous photo: ${this.currentPhotoIndex + 1} of ${this.currentPhotos.length}`);
    }

    // NEW: Fast lightbox image update with caching
    async updateLightboxImageFast() {
        const photo = this.currentPhotos[this.currentPhotoIndex];
        const imageUrl = this.getHighestQualityImageUrl(photo);

        // Check cache first for instant display
        if (this.imageCache.has(imageUrl)) {
            console.log('Using cached image for instant navigation');
            const cachedImg = this.imageCache.get(imageUrl);
            this.lightboxImg.src = cachedImg.src;
            this.lightboxImg.alt = photo.title || `Photo ${this.currentPhotoIndex + 1}`;
            this.applyLightboxImageStyling();
            return;
        }

        // If not cached, show loading and load image
        this.showLightboxLoading();

        try {
            await this.preloadImage(imageUrl, 'high');
            this.lightboxImg.src = imageUrl;
            this.lightboxImg.alt = photo.title || `Photo ${this.currentPhotoIndex + 1}`;
            this.applyLightboxImageStyling();
            this.hideLightboxLoading();
        } catch (error) {
            console.error('Failed to load image during navigation, trying fallback');
            this.loadFallbackImage(photo);
        }
    }

    backToAlbums() {
        this.photoGalleryView.style.display = 'none';
        this.albumsView.style.display = 'block';
    }

    async init() {
        try {
            console.log('=== FLICKR GALLERY INIT START ===');
            console.log('API Key:', FLICKR_CONFIG.API_KEY ? 'Present' : 'Missing');
            console.log('User ID:', this.config.userId);

            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Checking elements after wait...');
            console.log('this.loading exists:', !!this.loading);
            console.log('this.albumsGrid exists:', !!this.albumsGrid);

            if (!this.loading) {
                this.loading = this.galleryElement.querySelector('.flickr-loading');
                if (!this.loading) {
                    console.error('Loading element still not found, creating new one');
                    const loadingDiv = document.createElement('div');
                    loadingDiv.className = 'flickr-loading';
                    loadingDiv.textContent = 'Loading...';
                    this.galleryElement.insertBefore(loadingDiv, this.galleryElement.firstChild);
                    this.loading = loadingDiv;
                }
            }

            if (!this.albumsGrid) {
                this.albumsGrid = this.galleryElement.querySelector('.flickr-albums-container');
                if (!this.albumsGrid) {
                    throw new Error('Albums container element still not found after retry. Check HTML structure.');
                }
            }

            if (this.backToAlbumsBtn) this.backToAlbumsBtn.addEventListener('click', () => this.backToAlbums());
            if (this.nextAlbumBtn) this.nextAlbumBtn.addEventListener('click', () => this.openNextAlbum());
            if (this.lightboxClose) this.lightboxClose.addEventListener('click', () => this.closeLightbox());
            if (this.lightboxPrev) this.lightboxPrev.addEventListener('click', () => this.prevPhoto());
            if (this.lightboxNext) this.lightboxNext.addEventListener('click', () => this.nextPhoto());

            if (this.lightbox) {
                this.lightbox.addEventListener('click', (e) => {
                    if (e.target === this.lightbox) this.closeLightbox();
                });
            }

            console.log('Fetching albums...');
            const albums = await this.getPhotosets();
            console.log('Albums received:', albums.length);

            if (albums.length === 0) {
                if (this.loading) {
                    this.loading.innerHTML = 'No albums found. Check your Flickr account has albums with the specified keywords.';
                }
                return;
            }

            this.displayAlbums(albums);

            if (this.loading) this.loading.style.display = 'none';
            if (this.albumsView) this.albumsView.style.display = 'block';

            console.log('=== FLICKR GALLERY INIT COMPLETE ===');
        } catch (error) {
            console.error('=== FLICKR GALLERY INIT ERROR ===');
            console.error('Error details:', error);
            console.error('Stack trace:', error.stack);

            if (this.loading) {
                this.loading.innerHTML = `Error loading albums: ${error.message}`;
            } else {
                this.galleryElement.innerHTML = `<div style="padding: 40px; color: #ff6b6b; text-align: center;">Error: ${error.message}</div>`;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const galleryElements = document.querySelectorAll('.flickr-gallery');
    galleryElements.forEach(element => {
        const gallery = new FlickrGallery(element);
        gallery.init();
    });
});

window.FlickrGallery = FlickrGallery;