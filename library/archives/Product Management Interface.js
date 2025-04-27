// [Add this code after the order modal functions]

// Product Management Functions
async function loadProducts() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '<div class="col-span-full text-center py-8">Loading products...</div>';
    
    try {
        const snapshot = await db.collection('products').orderBy('name').get();
        
        if (snapshot.empty) {
            productsList.innerHTML = '<div class="col-span-full text-center py-8">No products found</div>';
            return;
        }
        
        productsList.innerHTML = '';
        snapshot.forEach(doc => {
            const product = { id: doc.id, ...doc.data() };
            const productCard = document.createElement('div');
            productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden';
            productCard.innerHTML = `
                <div class="h-48 bg-gray-100 flex items-center justify-center">
                    ${product.imageUrl ? 
                        `<img src="${product.imageUrl}" alt="${product.name}" class="h-full object-contain">` : 
                        '<div class="text-gray-400">No Image</div>'}
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-1">${product.name}</h3>
                    <p class="text-primary font-bold mb-2">$${product.price.toFixed(2)}</p>
                    <p class="text-sm text-gray-600 line-clamp-2 mb-4">${product.description || 'No description'}</p>
                    <div class="flex justify-between">
                        <button data-product-id="${product.id}" class="edit-product-btn text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
                            Edit
                        </button>
                        <button data-product-id="${product.id}" class="delete-product-btn text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded">
                            Delete
                        </button>
                    </div>
                </div>
            `;
            productsList.appendChild(productCard);
        });
        
        // Add event listeners
        document.querySelectorAll('.edit-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                openProductModal(productId);
            });
        });
        
        document.querySelectorAll('.delete-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                confirmDeleteProduct(productId);
            });
        });
        
    } catch (error) {
        console.error("Error loading products:", error);
        productsList.innerHTML = `<div class="col-span-full text-center py-8 text-red-500">Error loading products: ${error.message}</div>`;
    }
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const imagePreview = document.getElementById('imagePreview');
    
    // Reset form
    form.reset();
    imagePreview.classList.add('hidden');
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
                document.getElementById('productName').value = product.name;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productDescription').value = product.description || '';
                
                if (product.imageUrl) {
                    document.getElementById('previewImage').src = product.imageUrl;
                    imagePreview.classList.remove('hidden');
                }
            }
        });
    }
    
    // Show modal
    modal.classList.remove('hidden');
}

// Handle image preview
document.getElementById('productImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('previewImage').src = event.target.result;
            document.getElementById('imagePreview').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// Save product
document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveProductBtn');
    const cancelBtn = document.getElementById('cancelProductBtn');
    const productId = document.getElementById('productId').value;
    
    saveBtn.disabled = true;
    cancelBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
        const productData = {
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            description: document.getElementById('productDescription').value,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Handle image upload if a file was selected
        const imageFile = document.getElementById('productImage').files[0];
        if (imageFile) {
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`products/${Date.now()}_${imageFile.name}`);
            await fileRef.put(imageFile);
            productData.imageUrl = await fileRef.getDownloadURL();
        }
        
        // Save to Firestore
        if (productId) {
            // Update existing product
            await db.collection('products').doc(productId).update(productData);
        } else {
            // Add new product
            productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('products').add(productData);
        }
        
        // Update UI
        saveBtn.textContent = 'Saved!';
        setTimeout(() => {
            document.getElementById('closeProductModal').click();
            loadProducts();
        }, 1000);
        
    } catch (error) {
        console.error("Error saving product:", error);
        saveBtn.textContent = 'Error! Try Again';
        saveBtn.disabled = false;
        cancelBtn.disabled = false;
    }
});

// Delete product
function confirmDeleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        db.collection('products').doc(productId).delete()
            .then(() => {
                loadProducts();
            })
            .catch(error => {
                console.error("Error deleting product:", error);
                alert('Error deleting product. Please try again.');
            });
    }
}

// Modal close handlers
document.getElementById('closeProductModal').addEventListener('click', () => {
    document.getElementById('productModal').classList.add('hidden');
});

document.getElementById('cancelProductBtn').addEventListener('click', () => {
    document.getElementById('productModal').classList.add('hidden');
});

// Initialize Firebase Storage (add to your Firebase config section)
// Add this to your Firebase imports at the top of the file:
// <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js"></script>