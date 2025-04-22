// [Add this code after the existing JavaScript in admin.html]

// Order Loading Functions
async function loadOrders(viewType) {
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = '<div class="col-span-full text-center py-8">Loading orders...</div>';
    
    try {
        let query = db.collection('orders').orderBy('orderDate', 'desc');
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        
        // Apply filters
        if (statusFilter !== 'all') {
            query = query.where('status', '==', statusFilter);
        }
        if (dateFilter) {
            const startDate = new Date(dateFilter);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            query = query.where('orderDate', '>=', startDate.toISOString())
                        .where('orderDate', '<', endDate.toISOString());
        }
        
        const snapshot = await query.get();
        
        if (snapshot.empty) {
            ordersContainer.innerHTML = '<div class="col-span-full text-center py-8">No orders found</div>';
            return;
        }
        
        let orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        
        // Group orders based on view type
        switch(viewType) {
            case 'user':
                displayOrdersByUser(orders);
                break;
            case 'product':
                displayOrdersByProduct(orders);
                break;
            default:
                displayChronologicalOrders(orders);
        }
        
    } catch (error) {
        console.error("Error loading orders:", error);
        ordersContainer.innerHTML = `<div class="col-span-full text-center py-8 text-red-500">Error loading orders: ${error.message}</div>`;
    }
}

function displayChronologicalOrders(orders) {
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = '';
    
    orders.forEach(order => {
        const orderDate = new Date(order.orderDate).toLocaleString();
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        
        const orderCard = document.createElement('div');
        orderCard.className = 'bg-white rounded-lg shadow-md p-4 order-card transition-all';
        orderCard.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold">Order #${order.id}</h3>
                <span class="text-sm ${getStatusColor(order.status)}">${order.status}</span>
            </div>
            <div class="flex justify-between text-sm mb-2">
                <span>${order.customer.name}</span>
                <span>${orderDate}</span>
            </div>
            <div class="text-sm mb-2">
                <span class="font-medium">${totalItems} items</span> - 
                <span class="text-primary font-bold">$${order.total}</span>
            </div>
            <button data-order-id="${order.id}" class="view-details-btn text-primary hover:text-secondary text-sm font-medium">
                View Details
            </button>
        `;
        ordersContainer.appendChild(orderCard);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = e.target.getAttribute('data-order-id');
            showOrderDetails(orders.find(o => o.id === orderId));
        });
    });
}

// [Continued in next message...]