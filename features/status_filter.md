I'll implement the product filtering feature with a dropdown or toggle tabs to filter products by status and add the default sorting by lastUpdated. Here's the solution:

```js
// 1. First, add the filter UI to the HTML section
// Add this right after the product management heading and add product button
// This goes in the productsSection div

// Add this HTML to your productsSection div after the heading and button:
`<div class="mb-4 flex items-center">
    <label for="productFilter" class="mr-2 text-sm">Filter by:</label>
    <select id="productFilter" class="border rounded-md p-1 text-sm">
        <option value="all">All Products</option>
        <option value="released">Released</option>
        <option value="unreleased">Unreleased</option>
    </select>
</div>`

// 2. Modify the loadProducts function to include filtering
async function loadProducts(filter = 'all') {
    const productsList = document.getElementById('productsList');
    if (!productsList) {
        console.error("Products list element not found");
        return;
    }
    
    productsList.innerHTML = '<div class="col-span-full text-center py-8">Loading products...</div>';
    
    try {
        let products = [];
        
        try {
            // Create a query based on filter
            let query = db.collection('products');
            
            // Default sorting by lastUpdated (most recent first)
            query = query.orderBy('lastUpdated', 'desc');
            
            // Apply filter if needed
            if (filter === 'released' || filter === 'unreleased') {
                query = query.where('status', '==', filter);
            }
            
            const snapshot = await query.get();
            
            if (snapshot.empty) {
                productsList.innerHTML = `<div class="col-span-full text-center py-8">No ${filter !== 'all' ? filter : ''} products found</div>`;
                return;
            }
            
            snapshot.forEach((doc) => {
                products.push({ id: doc.id, ...doc.data() });
            });
        } catch (error) {
            console.warn("Error fetching products from Firestore, using sample data:", error);
            
            // Use sample data for local testing
            products = [
                {
                    id: "sample-product-1",
                    name: "Fresh Vegetables",
                    price: 12.99,
                    description: "A selection of fresh seasonal vegetables",
                    status: "released",
                    lastUpdated: new Date(2025, 3, 28),
                    images: [
                        {
                            url: "images-v2/A_meticulously_organized_arran(1).jpeg",
                            name: "vegetables.jpg"
                        }
                    ]
                },
                {
                    id: "sample-product-2",
                    name: "Premium Meat",
                    price: 19.99,
                    description: "High-quality premium meat selection",
                    status: "released",
                    lastUpdated: new Date(2025, 3, 29),
                    images: [
                        {
                            url: "images-v2/A_meticulously_organized_arran(2).jpeg",
                            name: "meat.jpg"
                        }
                    ]
                },
                {
                    id: "sample-product-3",
                    name: "Fresh Fruit Basket",
                    price: 32.50,
                    description: "Assorted fresh fruits",
                    status: "unreleased",
                    lastUpdated: new Date(2025, 3, 30),
                    imageUrl: "images-v2/A_meticulously_organized_arran(3).jpeg"
                }
            ];
            
            // Filter sample data if needed
            if (filter !== 'all') {
                products = products.filter(p => p.status === filter);
            }
            
            // Sort by lastUpdated
            products.sort((a, b) => {
                return (b.lastUpdated || 0) - (a.lastUpdated || 0);
            });
        }
        
        productsList.innerHTML = '';
        products.forEach((product) => {
            const productCard = document.createElement('div');
            productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden';
            
            // Get the main image (first in the images array) or use the legacy imageUrl field
            const mainImageUrl = (product.images && product.images.length > 0) 
                ? product.images[0].url 
                : (product.imageUrl || '');
            
            // Format the last updated date if available
            let lastUpdatedText = '';
            if (product.lastUpdated) {
                const date = product.lastUpdated instanceof Date ? 
                    product.lastUpdated : 
                    product.lastUpdated.toDate ? product.lastUpdated.toDate() : new Date(product.lastUpdated);
                
                lastUpdatedText = `Updated: ${date.toLocaleDateString()}`;
            }
            
            productCard.innerHTML = `
                <div class="h-48 bg-gray-100 flex items-center justify-center">
                    ${mainImageUrl ? 
                        `<img src="${mainImageUrl}" alt="${product.name}" class="h-full object-contain">` : 
                        '<div class="text-gray-400">No Image</div>'}
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-1">${product.name}</h3>
                    <p class="text-primary font-bold mb-2">$${product.price ? product.price.toFixed(2) : '0.00'}</p>
                    <p class="text-sm text-gray-600 line-clamp-2 mb-4">${product.description || 'No description'}</p>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm ${product.status === 'released' ? 'text-green-600' : 'text-gray-600'}">
                            ${product.status || 'unreleased'}
                        </span>
                        <span class="text-sm text-gray-500">
                            ${lastUpdatedText}
                        </span>
                    </div>
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
        
        // Event listeners setup (same as before)
        // ...
        
    } catch (error) {
        console.error("Error loading products:", error);
        if (productsList) {
            productsList.innerHTML = `<div class="col-span-full text-center py-8 text-red-500">Error loading products: ${error.message}</div>`;
        }
    }
}

// 3. Update the product tab click event to use the default filter
document.getElementById('productsTab').addEventListener('click', () => {
    document.getElementById('ordersSection').classList.add('hidden');
    document.getElementById('productsSection').classList.remove('hidden');
    document.getElementById('ordersTab').classList.remove('tab-active');
    document.getElementById('productsTab').classList.add('tab-active');
    
    // Load all products sorted by lastUpdated (default)
    loadProducts('all');
});

// 4. Add an event listener for the filter dropdown
document.addEventListener('DOMContentLoaded', function() {
    // Add existing initialization code
    
    // Add event listener for the filter dropdown
    const productFilter = document.getElementById('productFilter');
    if (productFilter) {
        productFilter.addEventListener('change', function() {
            loadProducts(this.value);
        });
    }
    
    // Load products with default filter on page load
    loadProducts('all');
});

// 5. Update the save product function to refresh with the current filter
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            // Existing save product logic...
            
            // When complete, update this part to maintain the current filter:
            setTimeout(() => {
                document.getElementById('productModal').classList.add('hidden');
                
                // Get current filter value
                const currentFilter = document.getElementById('productFilter')?.value || 'all';
                
                // Reload products with current filter
                loadProducts(currentFilter);
            }, 1000);
            
            // Rest of the function remains the same
        });
    }
});
```


---


# Product Filtering Implementation Guide

I've created a solution to add product filtering functionality to your admin dashboard. Here's how to implement it:

## 1. Add the Filter UI

First, add the dropdown filter UI to your products section. Insert this HTML right after your "Product Management" heading and "Add New" button in the `productsSection` div:

```html
<div class="mb-4 flex items-center">
    <label for="productFilter" class="mr-2 text-sm">Filter by:</label>
    <select id="productFilter" class="border rounded-md p-1 text-sm">
        <option value="all">All Products</option>
        <option value="released">Released</option>
        <option value="unreleased">Unreleased</option>
    </select>
</div>
```

## 2. Update the loadProducts Function

Replace your existing `loadProducts()` function with the new version that supports filtering and sorting by lastUpdated. The key changes are:

- Added a filter parameter (defaulting to 'all')
- Modified the Firestore query to filter by status when needed
- Added default sorting by lastUpdated in descending order (newest first)
- Updated the product card to display the last updated date
- Applied the same filter logic to the sample data for testing

## 3. Update Event Listeners

Update your event handlers to use the new filter functionality:

1. Modified the products tab click handler to load all products sorted by lastUpdated
2. Added an event listener for the filter dropdown changes
3. Updated the product save function to maintain the current filter when refreshing the list

## 4. Testing

To test this implementation:

1. Make sure the filter dropdown appears on your products page
2. Test each filter option: All, Released, and Unreleased
3. Verify that products are sorted by lastUpdated (newest first)
4. Verify that after adding or editing a product, the current filter is maintained

## Additional Notes

- The lastUpdated field is displayed on each product card for reference
- The solution handles both Firestore Timestamp objects and regular Date objects
- Filter state is preserved when adding or editing products
- Sample data is properly filtered and sorted for local testing


---
I've created a solution to add product filtering by status and sorting by lastUpdated. Here's what the implementation includes:

1. **Filter Dropdown UI**: A simple dropdown menu with three options:
   - All Products (default)
   - Released
   - Unreleased

2. **Updated loadProducts Function**:
   - Added filtering capability based on product status
   - Implemented default sorting by lastUpdated (newest first)
   - Updated the query to Firebase to filter and sort server-side

3. **Modified Event Handlers**:
   - Added a change event listener for the filter dropdown
   - Updated product saving to maintain the current filter view
   - Set the default view to show all products sorted by last update date

The changes are minimal and integrate well with your existing code. The filter appears directly below your product management heading, keeping the UI clean and intuitive.

To implement this, copy the code from the first artifact into your JavaScript section, and add the HTML snippet for the filter dropdown to your products section HTML.

After implementation, your users will be able to:
- See all products sorted by most recently updated (default view)
- Filter to see only released products
- Filter to see only unreleased products
- Maintain their current filter view when adding or editing products

Would you like me to provide any clarification or make any adjustments to the implementation?