function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-badge').innerHTML = totalCount;
}

// Додавання товару в кошик
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Отримати існуючий кошик або пустий масив
    const existingProductIndex = cart.findIndex(item => item.id === product.uniq_id);

    if (existingProductIndex !== -1) {
        // Якщо товар вже є в кошику, збільшуємо його кількість
        cart[existingProductIndex].quantity += 1;
    } else {
        // Додаємо новий товар до кошика
        const productToAdd = {
            id: product.uniq_id,
            name: product.product_name,
            price: product.discounted_price,
            image: JSON.parse(product.image)[0],
            quantity: 1
        };
        cart.push(productToAdd);
    }

    // Зберігаємо оновлений кошик у Local Storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Оновлюємо лічильник товарів
    updateCartCount();

    updateCartModal()
}

// Оновлення вмісту модального вікна
function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartTotalElement = document.getElementById('cart-total');

    cartItemsContainer.innerHTML = ''; // Очищаємо список товарів в кошику

    cart.forEach(item => {
        const listItem = document.createElement('li');
        const itemImage = document.createElement('img')
        const itemContainer = document.createElement('div')

        itemImage.classList.add('cart-item-image');
        itemContainer.classList.add('item-container');

        listItem.innerHTML = `${item.name} - ${item.quantity} pcs. for ${item.price}$`;
        itemImage.src = item.image;

        itemContainer.append(itemImage, listItem)
        cartItemsContainer.append(itemContainer);
    });

    cartTotalElement.innerHTML = `Total amount: ${cartTotal}$`;
}

// Відкриття модального вікна
const cartIcon = document.getElementById('cart-icon');
const cartBadge = document.querySelector('.cart-badge')
const cartModal = document.getElementById('cart-modal');
const closeCartButton = document.getElementById('close-cart');

cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

cartBadge.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeCartButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Закриття модального вікна, якщо користувач натискає за його межами
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

function clearCart() {
    // Видаляємо дані про кошик з localStorage
    localStorage.removeItem('cart');

    updateCartCount();
    updateCartModal();
}

document.getElementById('clear-cart-btn').addEventListener('click', clearCart);

updateCartCount();
updateCartModal();