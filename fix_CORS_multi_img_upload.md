I'll focus on fixing the bugs in your image upload and submission functionality. Looking at the code and the errors, there are several issues to address.

I've fixed several issues in your code that were causing the image upload and submission to fail:

1. **CORS errors fix:**
   - Fixed the file path generation for Firebase Storage, using proper URL encoding
   - Added error handling around image uploads to prevent single image failures from stopping the entire process

2. **Missing dependencies and elements:**
   - Added the Sortable.js script which was referenced but not included
   - Added the missing HTML modal structure that was referenced in the JavaScript
   - Added missing `showToast()` function implementation

3. **Process and event handling improvements:**
   - Improved file handling by converting data URLs to Blobs when needed
   - Fixed event listener registration by ensuring DOM is loaded before attaching listeners
   - Added proper checks for element existence before using them
   - Enhanced error handling throughout the code

4. **Firebase persistence warning:**
   - Fixed the Firebase persistence implementation with proper error handling
   - Wrapped in try-catch to prevent any initialization errors

The main issue was likely in the image upload process, where the Firebase Storage paths weren't being properly encoded, causing the CORS errors. I've also added better error handling so that if one image fails to upload, the rest of the process can continue.


---

# The Code

---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>

<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
</head>

<body>
    <!-- Modal HTML structure is missing, adding it here -->
    <div id="productModal" class="hidden">
        <div class="modal-content">
            <h2 id="productModalTitle">Add New Product</h2>
            <form id="productForm">
                <input type="hidden" id="productId">
                
                <div class="form-group">
                    <label for="productName">Product Name</label>
                    <input type="text" id="productName" required>
                </div>
                
                <div class="form-group">
                    <label for="productPrice">Price</label>
                    <input type="number" id="productPrice" step="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="productDescription">Description</label>
                    <textarea id="productDescription"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="productStatus">Status</label>
                    <select id="productStatus">
                        <option value="unreleased">Unreleased</option>
                        <option value="active">Active</option>
                        <option value="discontinued">Discontinued</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Images</label>
                    <div id="imageGallery" class="image-gallery"></div>
                    <input type="file" id="productImageInput" accept="image/*" style="display: none;">
                </div>
                
                <div class="modal-actions">
                    <button type="button" id="cancelProductBtn">Cancel</button>
                    <button type="submit" id="saveProductBtn">Save Product</button>
                </div>
            </form>
            <button id="closeProductModal" type="button">×</button>
        </div>
    </div>

    <script>
    // Firebase Configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCTUZbw1qSdFEBG2SGo7smQgqXEKZZWCaw",
      authDomain: "mei-wen-ti.firebaseapp.com",
      projectId: "mei-wen-ti",
      storageBucket: "mei-wen-ti.appspot.com",
      messagingSenderId: "103509830524",
      appId: "1:103509830524:web:5ddef022db357ce99152f9",
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const auth = firebase.auth();
    const storage = firebase.storage();

    // Updated persistence code with proper error handling
    try {
      firebase.firestore().enablePersistence({
        synchronizeTabs: true
      }).catch(err => {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore persistence could not be enabled: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore persistence is not available in this browser');
        }
      });
    } catch (e) {
      console.warn('Error enabling persistence:', e);
    }

    // Variable to store images for the current product
    let currentProductImages = [];

    // Show toast notification
    function showToast(message, type = 'success') {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            document.body.appendChild(toast);
        }
        
        // Set message and styling
        toast.textContent = message;
        toast.className = 'toast ' + type;
        
        // Show and hide after delay
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Load products function (needed for the reload after save)
    function loadProducts() {
        db.collection('products').orderBy('createdAt', 'desc').get()
            .then(snapshot => {
                console.log('Products loaded:', snapshot.size);
                // Implementation would be here to display products
            })
            .catch(error => {
                console.error("Error loading products:", error);
                showToast('Error loading products', 'error');
            });
    }

    function openProductModal(productId = null) {
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        
        // Reset form and images array
        form.reset();
        currentProductImages = [];
        refreshImageGallery();
        
        document.getElementById('productId').value = '';
        
        // Set title
        document.getElementById('productModalTitle').textContent = 
            productId ? 'Edit Product' : 'Add New Product';
        
        // If editing, load product data
        if (productId) {
            db.collection('products').doc(productId).get().then(doc => {
                if (doc.exists) {
                    const product = doc.data();
                    document.getElementById('productId').value = doc.id;
                    document.getElementById('productName').value = product.name || '';
                    document.getElementById('productPrice').value = product.price || '';
                    document.getElementById('productDescription').value = product.description || '';
                    
                    // Add status field handling
                    const statusSelect = document.getElementById('productStatus');
                    if (statusSelect) {
                        statusSelect.value = product.status || 'unreleased';
                    }
                    
                    // Handle images
                    if (product.images && Array.isArray(product.images)) {
                        // Use the new images array structure
                        currentProductImages = [...product.images];
                    } else if (product.imageUrl) {
                        // Convert legacy single imageUrl to the new format
                        currentProductImages = [{
                            url: product.imageUrl,
                            name: 'Legacy Image',
                            path: product.imagePath || ''
                        }];
                    }
                    
                    refreshImageGallery();
                    
                    // Ensure the save button is visible
                    document.getElementById('saveProductBtn').style.display = 'block';
                }
            }).catch(error => {
                console.error("Error getting product:", error);
                showToast('Error loading product data. Please try again.', 'error');
            });
        } else {
            // Ensure the save button is visible for new products
            document.getElementById('saveProductBtn').style.display = 'block';
        }
        
        // Show modal
        modal.classList.remove('hidden');
    }

    // Function to refresh the image gallery based on currentProductImages
    function refreshImageGallery() {
        const gallery = document.getElementById('imageGallery');
        if (!gallery) return;
        
        // Clear all items
        gallery.innerHTML = '';
        
        // Add each image to the gallery
        currentProductImages.forEach((image, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.setAttribute('data-index', index);
            
            imageItem.innerHTML = `
                ${index === 0 ? '<span class="main-image-badge">Main</span>' : ''}
                <img src="${image.url}" alt="${image.name || 'Product image'}">
                <div class="delete-image" data-index="${index}">×</div>
            `;
            
            gallery.appendChild(imageItem);
            
            // Add delete event listener
            imageItem.querySelector('.delete-image').addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(e.target.getAttribute('data-index'));
                currentProductImages.splice(idx, 1);
                refreshImageGallery();
            });
        });
        
        // Add the add button
        const addBtn = document.createElement('div');
        addBtn.id = 'addImageBtn';
        addBtn.className = 'add-image-btn';
        addBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
        `;
        gallery.appendChild(addBtn);
        
        // Setup sortable functionality
        if (typeof Sortable !== 'undefined') {
            new Sortable(gallery, {
                animation: 150,
                filter: '#addImageBtn', // Don't allow dragging the add button
                onEnd: function(evt) {
                    // Skip if we moved the add button (shouldn't happen due to filter, but just in case)
                    if (evt.item.id === 'addImageBtn') return;
                    
                    // Get old and new indices
                    const oldIndex = evt.oldIndex;
                    const newIndex = evt.newIndex;
                    
                    // Move the image in the array
                    const movedImage = currentProductImages.splice(oldIndex, 1)[0];
                    currentProductImages.splice(newIndex, 0, movedImage);
                    
                    // Refresh to update the "Main" badge
                    refreshImageGallery();
                }
            });
        }
        
        // Add image button click handler
        const addImageBtn = document.getElementById('addImageBtn');
        if (addImageBtn) {
            addImageBtn.addEventListener('click', () => {
                document.getElementById('productImageInput').click();
            });
        }
    }

    // Set up event listeners once DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Handle image file selection
        const fileInput = document.getElementById('productImageInput');
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                const files = e.target.files;
                if (!files.length) return;
                
                const file = files[0];
                if (!file.type.match('image.*')) {
                    showToast('Please select an image file', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Add the new image to the current images array
                    currentProductImages.push({
                        url: event.target.result,
                        name: file.name,
                        file: file, // Keep the file object for later upload
                        isNew: true // Flag to indicate this is a new upload
                    });
                    
                    refreshImageGallery();
                    fileInput.value = ''; // Reset the input for the next selection
                };
                
                reader.readAsDataURL(file);
            });
        }

        // Set up cancel button
        const cancelBtn = document.getElementById('cancelProductBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.getElementById('productModal').classList.add('hidden');
            });
        }

        // Set up close button
        const closeBtn = document.getElementById('closeProductModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('productModal').classList.add('hidden');
            });
        }
    });

    // Save product with multiple images
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('productForm');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const saveBtn = document.getElementById('saveProductBtn');
                const cancelBtn = document.getElementById('cancelProductBtn');
                const productId = document.getElementById('productId').value;
                
                if (!saveBtn || !cancelBtn) return;
                
                saveBtn.disabled = true;
                cancelBtn.disabled = true;
                saveBtn.textContent = 'Saving...';
                
                try {
                    const productData = {
                        name: document.getElementById('productName').value,
                        price: parseFloat(document.getElementById('productPrice').value),
                        description: document.getElementById('productDescription').value,
                        status: document.getElementById('productStatus').value,
                        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    // Process images
                    const updatedImages = [];
                    
                    // First, upload any new images to Firebase Storage
                    for (let i = 0; i < currentProductImages.length; i++) {
                        const image = currentProductImages[i];
                        
                        if (image.isNew && image.file) {
                            try {
                                // This is a new image that needs to be uploaded
                                const storageRef = storage.ref();
                                
                                // Fix: Generate a more unique file path with safer URL encoding
                                const timestamp = Date.now();
                                const safeFileName = encodeURIComponent(image.name).replace(/%20/g, '_');
                                const filePath = `products/${timestamp}_${safeFileName}`;
                                const fileRef = storageRef.child(filePath);
                                
                                // Convert data URL to blob if needed
                                let fileToUpload = image.file;
                                if (typeof image.url === 'string' && image.url.startsWith('data:')) {
                                    // It's a data URL, convert to blob
                                    const response = await fetch(image.url);
                                    fileToUpload = await response.blob();
                                }
                                
                                await fileRef.put(fileToUpload, {contentType: image.file.type});
                                const url = await fileRef.getDownloadURL();
                                
                                updatedImages.push({
                                    url: url,
                                    name: image.name,
                                    path: fileRef.fullPath
                                });
                            } catch (error) {
                                console.error("Error uploading image:", error);
                                // Continue with the next image instead of stopping the entire process
                                showToast(`Error uploading image ${image.name}: ${error.message}`, 'warning');
                            }
                        } else {
                            // This is an existing image, keep it as is
                            updatedImages.push({
                                url: image.url,
                                name: image.name || '',
                                path: image.path || ''
                            });
                        }
                    }
                    
                    // Update the images array in the product data
                    productData.images = updatedImages;
                    
                    // Set the first image as the main image for backward compatibility
                    if (updatedImages.length > 0) {
                        productData.imageUrl = updatedImages[0].url;
                        productData.imagePath = updatedImages[0].path;
                    } else {
                        // No images, clear the fields
                        productData.imageUrl = '';
                        productData.imagePath = '';
                    }
                    
                    // Save to Firestore
                    if (productId) {
                        // Update existing product
                        await db.collection('products').doc(productId).update(productData);
                        showToast('Product updated successfully!');
                    } else {
                        // Add new product
                        productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                        await db.collection('products').add(productData);
                        showToast('Product added successfully!');
                    }
                    
                    // Update UI
                    saveBtn.textContent = 'Saved!';
                    setTimeout(() => {
                        document.getElementById('productModal').classList.add('hidden');
                        loadProducts(); // Reload products to show changes
                    }, 1000);
                    
                } catch (error) {
                    console.error("Error saving product:", error);
                    showToast('Error saving product: ' + error.message, 'error');
                    saveBtn.textContent = 'Save Product';
                } finally {
                    saveBtn.disabled = false;
                    cancelBtn.disabled = false;
                }
            });
        }
    });

    // Initialize - add a global event listener for opening the modal
    document.addEventListener('DOMContentLoaded', () => {
        // Add any initialization code here
        loadProducts();
        
        // Example: Add button to open modal on the page
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => openProductModal());
        }
    });
    </script>
</body>
</html>