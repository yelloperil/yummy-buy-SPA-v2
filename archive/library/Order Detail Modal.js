// [Add this code after the product view functions]

// Order Detail Modal Functions
async function showOrderDetails(order) {
    const modal = document.getElementById('orderDetailModal');
    const content = document.getElementById('orderDetailContent');
    
    // Show loading state
    content.innerHTML = '<div class="text-center py-8">Loading order details...</div>';
    modal.classList.remove('hidden');

    try {
        // Format dates
        const orderDate = new Date(order.orderDate).toLocaleString();
        const updateDate = order.lastUpdated 
            ? new Date(order.lastUpdated.toDate()).toLocaleString() 
            : 'N/A';

        // Build order items table
        const itemsTable = order.items.map(item => `
            <tr class="border-b border-gray-200">
                <td class="py-3">${item.productName}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">$${item.price.toFixed(2)}</td>
                <td class="text-right">$${item.subtotal}</td>
            </tr>
        `).join('');

        // Build status options
        const statusOptions = ['pre-order', 'processing', 'shipped', 'delivered']
            .map(status => `
                <option value="${status}" ${order.status === status ? 'selected' : ''}>
                    ${status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
            `).join('');

        // Populate modal content
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h4 class="font-bold mb-2">Order Information</h4>
                    <div class="space-y-1 text-sm">
                        <div class="flex">
                            <span class="w-32 text-gray-600">Order ID:</span>
                            <span>${order.id}</span>
                        </div>
                        <div class="flex">
                            <span class="w-32 text-gray-600">Date:</span>
                            <span>${orderDate}</span>
                        </div>
                        <div class="flex">
                            <span class="w-32 text-gray-600">Last Updated:</span>
                            <span>${updateDate}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="w-32 text-gray-600">Status:</span>
                            <select id="orderStatus" class="p-1 border rounded ${getStatusBgColor(order.status)}">
                                ${statusOptions}
                            </select>
                            <button id="saveStatusBtn" class="ml-2 bg-primary hover:bg-secondary text-white px-3 py-1 rounded text-sm">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 class="font-bold mb-2">Customer Information</h4>
                    <div class="space-y-1 text-sm">
                        <div class="flex">
                            <span class="w-32 text-gray-600">Name:</span>
                            <span>${order.customer.name}</span>
                        </div>
                        <div class="flex">
                            <span class="w-32 text-gray-600">Phone:</span>
                            <span>${order.customer.phone}</span>
                        </div>
                        <div class="flex">
                            <span class="w-32 text-gray-600">Email:</span>
                            <span>${order.customer.email || 'N/A'}</span>
                        </div>
                        ${order.customer.userId ? `
                        <div class="flex">
                            <span class="w-32 text-gray-600">User ID:</span>
                            <span class="text-xs">${order.customer.userId}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="mb-6">
                <h4 class="font-bold mb-2">Shipping Address</h4>
                <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                    ${order.customer.address.replace(/\n/g, '<br>')}
                </div>
            </div>
            
            <div class="mb-6">
                <h4 class="font-bold mb-2">Order Items</h4>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-gray-300">
                                <th class="text-left pb-2">Product</th>
                                <th class="text-center pb-2">Qty</th>
                                <th class="text-right pb-2">Price</th>
                                <th class="text-right pb-2">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsTable}
                            <tr class="border-t border-gray-300 font-bold">
                                <td colspan="3" class="text-right pt-3">Total:</td>
                                <td class="text-right pt-3">$${order.total}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            ${order.customer.notes ? `
            <div class="mb-6">
                <h4 class="font-bold mb-2">Customer Notes</h4>
                <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                    ${order.customer.notes.replace(/\n/g, '<br>')}
                </div>
            </div>
            ` : ''}
            
            <div class="flex justify-end space-x-2">
                <button id="printOrderBtn" class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md">
                    Print
                </button>
                <button id="closeModalBtn" class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md">
                    Close
                </button>
            </div>
        `;

        // Add event listeners
        document.getElementById('saveStatusBtn').addEventListener('click', () => updateOrderStatus(order.id));
        document.getElementById('printOrderBtn').addEventListener('click', printOrder);
        document.getElementById('closeOrderModal').addEventListener('click', () => {
            modal.classList.add('hidden');
        });

    } catch (error) {
        console.error("Error loading order details:", error);
        content.innerHTML = `
            <div class="text-center py-8 text-red-500">
                Error loading order details: ${error.message}
            </div>
            <div class="flex justify-end">
                <button id="closeModalBtn" class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md">
                    Close
                </button>
            </div>
        `;
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
}

async function updateOrderStatus(orderId) {
    const newStatus = document.getElementById('orderStatus').value;
    const saveBtn = document.getElementById('saveStatusBtn');
    
    try {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        
        await db.collection('orders').doc(orderId).update({
            status: newStatus,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update UI
        document.getElementById('orderStatus').className = `p-1 border rounded ${getStatusBgColor(newStatus)}`;
        saveBtn.textContent = 'Updated!';
        
        // Refresh order list after a delay
        setTimeout(() => {
            const currentView = document.querySelector('[id$="View"].bg-primary').id;
            loadOrders(currentView.replace('View', ''));
            document.getElementById('closeOrderModal').click();
        }, 1000);
        
    } catch (error) {
        console.error("Error updating status:", error);
        saveBtn.textContent = 'Error! Try Again';
        saveBtn.disabled = false;
    }
}

function printOrder() {
    const printContent = document.getElementById('orderDetailContent').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div class="container mx-auto p-6" style="font-size: 14px;">
            <h1 class="text-2xl font-bold mb-4">Order Details</h1>
            ${printContent}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    // Re-attach event listeners after restoring content
    document.getElementById('closeOrderModal').addEventListener('click', () => {
        document.getElementById('orderDetailModal').classList.add('hidden');
    });
}

// [Add this utility function with other helpers]
function getStatusBgColor(status) {
    const statusColors = {
        'pre-order': 'bg-blue-100 text-blue-800',
        'processing': 'bg-yellow-100 text-yellow-800',
        'shipped': 'bg-green-100 text-green-800',
        'delivered': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
}