// [Add this code after displayChronologicalOrders function]

function displayOrdersByUser(orders) {
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = '';
    
    // Group orders by user
    const usersMap = orders.reduce((acc, order) => {
        const userKey = order.customer.userPhone || order.customer.phone;
        if (!acc[userKey]) {
            acc[userKey] = {
                customer: order.customer,
                orders: [],
                totalSpent: 0,
                totalOrders: 0
            };
        }
        acc[userKey].orders.push(order);
        acc[userKey].totalSpent += parseFloat(order.total);
        acc[userKey].totalOrders++;
        return acc;
    }, {});

    // Convert to array and sort by total spent
    const userGroups = Object.values(usersMap).sort((a, b) => b.totalSpent - a.totalSpent);

    userGroups.forEach(userGroup => {
        const userSection = document.createElement('div');
        userSection.className = 'bg-white rounded-lg shadow-md p-4 mb-6';
        userSection.innerHTML = `
            <div class="border-b pb-3 mb-3">
                <h3 class="font-bold text-lg">
                    ${userGroup.customer.name || 'Guest Customer'}
                    ${userGroup.customer.userPhone ? `<span class="text-sm font-normal text-gray-600">(Registered User)</span>` : ''}
                </h3>
                <div class="flex justify-between text-sm">
                    <span>${userGroup.customer.phone}</span>
                    <div>
                        <span class="mr-4">Orders: ${userGroup.totalOrders}</span>
                        <span class="text-primary font-bold">Total: $${userGroup.totalSpent.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div class="user-orders space-y-3">
                ${userGroup.orders.map(order => `
                    <div class="order-item pl-3 border-l-2 border-primary">
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="font-medium">Order #${order.id}</span>
                                <span class="text-sm text-gray-600 ml-2">${new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm ${getStatusColor(order.status)}">${order.status}</span>
                                <button data-order-id="${order.id}" 
                                    class="view-details-btn text-primary hover:text-secondary text-sm font-medium">
                                    View
                                </button>
                            </div>
                        </div>
                        <div class="text-sm">
                            ${order.items.length} items - $${order.total}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        ordersContainer.appendChild(userSection);
    });

    // Add event listeners to view buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const orderId = e.target.getAttribute('data-order-id');
            const order = orders.find(o => o.id === orderId);
            showOrderDetails(order);
        });
    });
}

// [Add this utility function at the top with other helpers]
function getStatusColor(status) {
    const statusColors = {
        'pre-order': 'text-blue-600',
        'processing': 'text-yellow-600',
        'shipped': 'text-green-600',
        'delivered': 'text-gray-600'
    };
    return statusColors[status] || 'text-gray-600';
}