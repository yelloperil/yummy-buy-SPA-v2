// [Add this code after displayOrdersByUser function]

function displayOrdersByProduct(orders) {
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = '';
    
    // Aggregate product data across all orders
    const productsMap = orders.reduce((acc, order) => {
        order.items.forEach(item => {
            const key = item.productId || item.productName;
            if (!acc[key]) {
                acc[key] = {
                    productId: item.productId,
                    name: item.productName,
                    price: item.price,
                    totalQuantity: 0,
                    totalRevenue: 0,
                    orders: [],
                    customers: new Set(),
                    firstOrderDate: order.orderDate,
                    lastOrderDate: order.orderDate
                };
            }
            
            acc[key].totalQuantity += item.quantity;
            acc[key].totalRevenue += item.quantity * item.price;
            acc[key].orders.push(order.id);
            acc[key].customers.add(order.customer.userPhone || order.customer.phone);
            
            // Update date range
            if (new Date(order.orderDate) < new Date(acc[key].firstOrderDate)) {
                acc[key].firstOrderDate = order.orderDate;
            }
            if (new Date(order.orderDate) > new Date(acc[key].lastOrderDate)) {
                acc[key].lastOrderDate = order.orderDate;
            }
        });
        return acc;
    }, {});

    // Convert to array and sort by total quantity
    const productGroups = Object.values(productsMap).sort((a, b) => b.totalQuantity - a.totalQuantity);

    productGroups.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md p-4 mb-6';
        productCard.innerHTML = `
            <div class="border-b pb-3 mb-3">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-lg">${product.name}</h3>
                        <p class="text-sm text-gray-600">$${product.price.toFixed(2)} per unit</p>
                    </div>
                    <div class="text-right">
                        <div class="text-primary font-bold text-xl">${product.totalQuantity}</div>
                        <div class="text-sm">units sold</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                    <div>
                        <div class="text-gray-600">Revenue</div>
                        <div class="font-medium">$${product.totalRevenue.toFixed(2)}</div>
                    </div>
                    <div>
                        <div class="text-gray-600">Customers</div>
                        <div class="font-medium">${product.customers.size}</div>
                    </div>
                    <div>
                        <div class="text-gray-600">First Ordered</div>
                        <div class="font-medium">${new Date(product.firstOrderDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                        <div class="text-gray-600">Last Ordered</div>
                        <div class="font-medium">${new Date(product.lastOrderDate).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
            <div class="product-orders">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-medium">Recent Orders</h4>
                    <button class="toggle-orders text-primary hover:text-secondary text-sm font-medium">
                        Show/Hide Orders
                    </button>
                </div>
                <div class="orders-list hidden space-y-2">
                    ${product.orders.slice(0, 5).map(orderId => {
                        const order = orders.find(o => o.id === orderId);
                        return `
                            <div class="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                <div>
                                    <span class="font-medium">Order #${orderId}</span>
                                    <span class="text-gray-600 ml-2">
                                        ${new Date(order.orderDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <button data-order-id="${orderId}" 
                                    class="view-details-btn text-primary hover:text-secondary font-medium">
                                    View
                                </button>
                            </div>
                        `;
                    }).join('')}
                    ${product.orders.length > 5 ? 
                        `<div class="text-center text-sm text-gray-600 mt-2">
                            + ${product.orders.length - 5} more orders
                        </div>` : ''}
                </div>
            </div>
        `;
        ordersContainer.appendChild(productCard);

        // Add toggle functionality
        const toggleBtn = productCard.querySelector('.toggle-orders');
        const ordersList = productCard.querySelector('.orders-list');
        toggleBtn.addEventListener('click', () => {
            ordersList.classList.toggle('hidden');
            toggleBtn.textContent = ordersList.classList.contains('hidden') 
                ? 'Show Orders' 
                : 'Hide Orders';
        });
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