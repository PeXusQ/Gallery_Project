// Global variables
let currentUser = null;
let currentPhotos = [];
let currentAlbums = [];
let pendingSortValue = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadAlbums();
    loadPhotos();
    setupEventListeners();
});

// Check authentication
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateUserInterface();
        } else {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

// Update user interface
function updateUserInterface() {
    if (currentUser) {
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = currentUser.username;
        }
        
        // Update profile photos
        if (currentUser.profile_photo) {
            const profileImgs = document.querySelectorAll('#profilePhotoImg, #userAvatarImg, #currentProfilePhoto');
            profileImgs.forEach(img => {
                if (img) img.src = currentUser.profile_photo;
            });
        }

        // Update theme
        if (currentUser.theme) {
            document.documentElement.setAttribute('data-theme', currentUser.theme);
        }

        // Update language
        if (currentUser.language) {
            document.documentElement.setAttribute('lang', currentUser.language);
        }
    }
}

// Load albums
async function loadAlbums() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/albums', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            currentAlbums = await response.json();
            updateAlbumsUI();
        }
    } catch (error) {
        console.error('Error loading albums:', error);
    }
}

// Update albums UI
function updateAlbumsUI() {
    const albumSelect = document.getElementById('album_id');
    const albumFilter = document.getElementById('album-filter');
    const albumsGrid = document.getElementById('albumsGrid');

    // Update album selects
    if (albumSelect) {
        albumSelect.innerHTML = '<option value="">Brak albumu</option>';
        currentAlbums.forEach(album => {
            const option = document.createElement('option');
            option.value = album.id;
            option.textContent = album.name;
            albumSelect.appendChild(option);
        });
    }

    if (albumFilter) {
        albumFilter.innerHTML = '<option value="">Wszystkie zdjęcia</option>';
        currentAlbums.forEach(album => {
            const option = document.createElement('option');
            option.value = album.id;
            option.textContent = album.name;
            albumFilter.appendChild(option);
        });
    }

    // Update albums grid
    if (albumsGrid) {
        albumsGrid.innerHTML = '';
        currentAlbums.forEach(album => {
            const albumCard = document.createElement('div');
            albumCard.className = 'album-card';
            albumCard.innerHTML = `
                <h3>${album.name}</h3>
                <p>Utworzony: ${new Date(album.created_at).toLocaleDateString('pl-PL')}</p>
                <div class="album-actions">
                    <button onclick="openAlbumModal(${album.id}, '${album.name}')" class="btn btn-view">Zobacz Album</button>
                    ${album.name !== 'Ogólne' ? `<button onclick="confirmDeleteAlbum(${album.id}, '${album.name}')" class="btn btn-danger">🗑️ Usuń</button>` : ''}
                </div>
            `;
            albumsGrid.appendChild(albumCard);
        });
    }
}

// Load photos
async function loadPhotos() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const sort = urlParams.get('sort') || 'newest';
        const album = urlParams.get('album') || '';

        const token = localStorage.getItem('token');
        const response = await fetch(`/api/photos?sort=${sort}&album=${album}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            currentPhotos = await response.json();
            updatePhotosUI();
        }
    } catch (error) {
        console.error('Error loading photos:', error);
    }
}

// Update photos UI
function updatePhotosUI() {
    const photosGrid = document.getElementById('photosGrid');
    const noPhotosMessage = document.getElementById('noPhotosMessage');

    if (!photosGrid) return;

    if (currentPhotos.length === 0) {
        if (noPhotosMessage) noPhotosMessage.style.display = 'block';
        photosGrid.style.display = 'none';
        return;
    }

    if (noPhotosMessage) noPhotosMessage.style.display = 'none';
    photosGrid.style.display = 'grid';

    photosGrid.innerHTML = '';
    currentPhotos.forEach(photo => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.setAttribute('data-photo-id', photo.id);
        
        const imagePath = `/uploads/${photo.filename}`;
        const isOwner = currentUser && photo.user_id === currentUser.id;
        
        photoCard.innerHTML = `
            <div class="photo-image">
                <img src="${imagePath}" 
                     alt="${photo.title || 'Bez tytułu'}"
                     onclick="openPhotoModal(${photo.id})">
            </div>
            
            <div class="photo-info">
                <h3>${photo.title || 'Bez tytułu'}</h3>
                <p class="photo-author">Autor: ${photo.username}</p>
                ${photo.album_name ? `<p class="photo-album">Album: ${photo.album_name}</p>` : ''}
                <p class="photo-description">${photo.description || ''}</p>
                
                <div class="photo-stats">
                    <div class="stat">
                        <span class="stat-icon">❤️</span>
                        <span class="stat-count">${photo.likes_count || 0}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">⭐</span>
                        <span class="stat-count">
                            ${photo.avg_rating ? parseFloat(photo.avg_rating).toFixed(1) : '0.0'}
                            (${photo.ratings_count || 0})
                        </span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">💬</span>
                        <span class="stat-count">0</span>
                    </div>
                </div>
                
                <div class="photo-actions">
                    <button onclick="likePhoto(${photo.id})" class="btn btn-like">❤️ Polub</button>
                    <button onclick="openPhotoModal(${photo.id})" class="btn btn-view">Zobacz</button>
                    ${isOwner ? `<button onclick="confirmDeletePhoto(${photo.id})" class="btn btn-danger">🗑️ Usuń</button>` : ''}
                </div>
            </div>
        `;
        photosGrid.appendChild(photoCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Upload form
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }

    // Create album form
    const createAlbumForm = document.getElementById('createAlbumForm');
    if (createAlbumForm) {
        createAlbumForm.addEventListener('submit', handleCreateAlbum);
    }

    // Profile photo form
    const profilePhotoForm = document.getElementById('profilePhotoForm');
    if (profilePhotoForm) {
        profilePhotoForm.addEventListener('submit', handleProfilePhotoUpload);
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu && !userMenu.contains(event.target)) {
            userMenu.classList.remove('active');
        }
    });
}

// Handle upload
async function handleUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/photos/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            showAlert(result.message, 'success');
            e.target.reset();
            loadPhotos();
        } else {
            showAlert(result.error, 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showAlert('Błąd podczas przesyłania zdjęcia', 'error');
    }
}

// Handle create album
async function handleCreateAlbum(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/albums', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: formData.get('album_name') })
        });

        const result = await response.json();

        if (response.ok) {
            showAlert(result.message, 'success');
            e.target.reset();
            loadAlbums();
        } else {
            showAlert(result.error, 'error');
        }
    } catch (error) {
        console.error('Create album error:', error);
        showAlert('Błąd podczas tworzenia albumu', 'error');
    }
}

// Handle profile photo upload
async function handleProfilePhotoUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/photos/profile', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            showAlert(result.message, 'success');
            currentUser.profile_photo = result.profile_photo;
            updateUserInterface();
            closeProfilePhotoModal();
        } else {
            showAlert(result.error, 'error');
        }
    } catch (error) {
        console.error('Profile photo upload error:', error);
        showAlert('Błąd podczas przesyłania zdjęcia profilowego', 'error');
    }
}

// Show alert
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Like photo
async function likePhoto(photoId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/photos/like', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photo_id: photoId })
        });

        if (response.ok) {
            loadPhotos(); // Refresh photos to update like count
        }
    } catch (error) {
        console.error('Like error:', error);
    }
}

// Rate photo
async function ratePhoto(photoId, rating) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/photos/rate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photo_id: photoId, rating })
        });

        if (response.ok) {
            loadPhotos(); // Refresh photos to update rating
        }
    } catch (error) {
        console.error('Rate error:', error);
    }
}

// Delete photo confirmation
function confirmDeletePhoto(photoId) {
    if (confirm('Czy na pewno chcesz usunąć to zdjęcie?')) {
        deletePhoto(photoId);
    }
}

// Delete photo
async function deletePhoto(photoId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/photos/${photoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            showAlert(result.message, 'success');
            loadPhotos();
        } else {
            showAlert(result.error, 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showAlert('Błąd podczas usuwania zdjęcia', 'error');
    }
}

// Delete album confirmation
function confirmDeleteAlbum(albumId, albumName) {
    if (confirm(`Czy na pewno chcesz usunąć album "${albumName}"?`)) {
        deleteAlbum(albumId);
    }
}

// Delete album
async function deleteAlbum(albumId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/albums/${albumId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            showAlert(result.message, 'success');
            loadAlbums();
        } else {
            showAlert(result.error, 'error');
        }
    } catch (error) {
        console.error('Delete album error:', error);
        showAlert('Błąd podczas usuwania albumu', 'error');
    }
}

// Load comments for photo
async function loadComments(photoId) {
    try {
        const response = await fetch(`/api/comments/${photoId}`);
        if (response.ok) {
            const comments = await response.json();
            updateCommentsUI(photoId, comments);
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Update comments UI
function updateCommentsUI(photoId, comments) {
    const commentsContainer = document.getElementById(`comments-${photoId}`);
    if (!commentsContainer) return;

    commentsContainer.innerHTML = '';
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <div class="comment-header">
                <strong>${comment.username}</strong>
                <span class="comment-date">${new Date(comment.created_at).toLocaleDateString('pl-PL')}</span>
            </div>
            <div class="comment-text">${comment.comment_text}</div>
        `;
        commentsContainer.appendChild(commentDiv);
    });
}

// Add comment
async function addComment(photoId, commentText) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photo_id: photoId, comment_text: commentText })
        });

        const result = await response.json();

        if (response.ok) {
            loadComments(photoId);
        } else {
            showAlert(result.error, 'error');
        }
    } catch (error) {
        console.error('Add comment error:', error);
        showAlert('Błąd podczas dodawania komentarza', 'error');
    }
}

// Open photo modal
function openPhotoModal(photoId) {
    const modal = document.getElementById('photoModal');
    const modalContent = document.getElementById('modalContent');
    
    // Find photo data
    const photoCard = document.querySelector(`[data-photo-id="${photoId}"]`);
    if (!photoCard) return;
    
    const photoImg = photoCard.querySelector('.photo-image img');
    const photoTitle = photoCard.querySelector('.photo-info h3').textContent;
    const photoAuthor = photoCard.querySelector('.photo-author').textContent;
    const photoDescription = photoCard.querySelector('.photo-description').textContent;
    const likesCount = photoCard.querySelector('.stat-count').textContent;
    
    // Check if current user owns this photo
    const deleteButton = photoCard.querySelector('.btn-danger');
    const isOwner = deleteButton !== null;
    
    // Create modal content
    modalContent.innerHTML = `
        <div class="photo-modal-content" id="modal-content-${photoId}">
            <div class="photo-modal-image">
                <img src="${photoImg.src}" alt="${photoTitle}">
            </div>
            <div class="photo-modal-info">
                <h2>${photoTitle}</h2>
                <p class="photo-author">${photoAuthor}</p>
                <p class="photo-description">${photoDescription}</p>
                
                <div class="photo-modal-actions">
                    <button onclick="likePhoto(${photoId})" class="btn btn-like">❤️ Polub</button>
                    
                    <div class="rating-section">
                        <label>Oceń zdjęcie:</label>
                        <div class="rating-stars">
                            <span class="star" onclick="ratePhoto(${photoId}, 1)">⭐</span>
                            <span class="star" onclick="ratePhoto(${photoId}, 2)">⭐</span>
                            <span class="star" onclick="ratePhoto(${photoId}, 3)">⭐</span>
                            <span class="star" onclick="ratePhoto(${photoId}, 4)">⭐</span>
                            <span class="star" onclick="ratePhoto(${photoId}, 5)">⭐</span>
                        </div>
                    </div>
                    
                    ${isOwner ? `<button onclick="confirmDeletePhoto(${photoId})" class="btn btn-danger">🗑️ Usuń Zdjęcie</button>` : ''}
                </div>
                
                <div class="comments-section">
                    <h3>Komentarze</h3>
                    <div id="comments-${photoId}">
                        <!-- Comments will be loaded here -->
                    </div>
                    
                    <div class="add-comment">
                        <textarea id="commentText-${photoId}" placeholder="Dodaj komentarz..." required></textarea>
                        <button onclick="addComment(${photoId}, document.getElementById('commentText-${photoId}').value)" class="btn btn-primary">Dodaj Komentarz</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    loadComments(photoId);
}

// Close photo modal
function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Open album modal
function openAlbumModal(albumId, albumName) {
    // Implementation for album modal
    console.log('Open album modal:', albumId, albumName);
    // You can implement this similar to photo modal
}

// Open profile photo modal
function openProfilePhotoModal() {
    const modal = document.getElementById('profilePhotoModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close profile photo modal
function closeProfilePhotoModal() {
    const modal = document.getElementById('profilePhotoModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Toggle user menu with animation
function toggleUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu) return;
    
    userMenu.classList.toggle('active');
    
    // Add ripple effect
    const button = userMenu.querySelector('.user-button');
    if (button && event) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Show sort confirmation
function showSortConfirmation() {
    const sortSelect = document.getElementById('sort');
    const confirmation = document.getElementById('sortConfirmation');
    const optionText = document.getElementById('sortOptionText');
    
    if (!sortSelect || !confirmation || !optionText) return;
    
    // Store the selected value
    pendingSortValue = sortSelect.value;
    
    // Get the text of selected option
    const selectedOption = sortSelect.options[sortSelect.selectedIndex];
    optionText.textContent = selectedOption.textContent;
    
    // Show confirmation
    confirmation.classList.add('show');
    
    // Reset select to current value
    const currentSort = new URLSearchParams(window.location.search).get('sort') || 'newest';
    sortSelect.value = currentSort;
}

// Confirm sorting
function confirmSorting() {
    if (pendingSortValue) {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('sort', pendingSortValue);
        window.location.href = currentUrl.toString();
    }
}

// Cancel sorting
function cancelSorting() {
    const confirmation = document.getElementById('sortConfirmation');
    if (confirmation) {
        confirmation.classList.remove('show');
    }
    pendingSortValue = null;
}

// Change album filter
function changeAlbumFilter() {
    const albumSelect = document.getElementById('album-filter');
    if (!albumSelect) return;
    
    const currentUrl = new URL(window.location);
    if (albumSelect.value) {
        currentUrl.searchParams.set('album', albumSelect.value);
    } else {
        currentUrl.searchParams.delete('album');
    }
    window.location.href = currentUrl.toString();
}

// Logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const photoModal = document.getElementById('photoModal');
    const profilePhotoModal = document.getElementById('profilePhotoModal');
    
    if (event.target === photoModal) {
        closePhotoModal();
    }
    if (event.target === profilePhotoModal) {
        closeProfilePhotoModal();
    }
}