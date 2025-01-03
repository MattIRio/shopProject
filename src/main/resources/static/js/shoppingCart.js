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
            price: product.retail_price,
            image: JSON.parse(product.image)[0],
            discountPrice: product.discounted_price,
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
    const cartTotal = cart.reduce((total, item) => {
        // Якщо є знижка, додаємо знижену ціну
        const itemPrice = item.discountPrice ? item.discountPrice * item.quantity : item.price * item.quantity;
        return total + itemPrice;
    }, 0);
    const cartTotalElement = document.getElementById('cart-total');

    cartItemsContainer.innerHTML = ''; // Очищаємо список товарів в кошику

    cart.forEach(item => {
        const listItem = document.createElement('li');
        const itemImage = document.createElement('img');
        const itemContainer = document.createElement('div');
        const quantityContainer = document.createElement('div');
        const priceContainer = document.createElement('div');
        const discountPriceContainer = document.createElement('div');
        const increaseButton = document.createElement('button');
        const decreaseButton = document.createElement('button');
        const itemFooterContainer = document.createElement('div');
        const itemQuantity = document.createElement('div');
        const priceWrapper = document.createElement('div');

        itemImage.classList.add('cart-item-image');
        itemContainer.classList.add('item-container');
        quantityContainer.classList.add('quantity-container');
        priceContainer.classList.add('price-container');
        discountPriceContainer.classList.add('discount-price-container');
        itemFooterContainer.classList.add('item-footer-container');
        itemQuantity.classList.add('item-quantity');
        priceWrapper.classList.add('price-wrapper');

        // Виведення інформації про товар
        itemImage.src = item.image;
        listItem.innerHTML = `${item.name}`;

        // Кнопки збільшення та зменшення кількості
        increaseButton.textContent = '+';
        decreaseButton.textContent = '–';

        increaseButton.classList.add('quantity-btn');
        decreaseButton.classList.add('quantity-btn');

        // Функція для оновлення кількості
        increaseButton.addEventListener('click', () => {
            item.quantity++;
            localStorage.setItem('cart', JSON.stringify(cart)); // Оновлюємо кошик в локальному сховищі
            updateCartModal();
            updateCartCount();
        });

        decreaseButton.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                localStorage.setItem('cart', JSON.stringify(cart)); // Оновлюємо кошик в локальному сховищі
                updateCartModal();
                updateCartCount();
            }
        });

        // Обчислюємо ціни
        const totalPrice = item.price * item.quantity;
        const discountPrice = item.discountPrice ? item.discountPrice * item.quantity : null;  // Якщо є знижка, обчислюємо, якщо ні - null

        // Додаємо інформацію про ціну
        priceContainer.innerHTML = `${totalPrice} $`;


        
        // Оновлюємо container для ціни зі знижкою, якщо знижка існує
        if (discountPrice) {
            discountPriceContainer.innerHTML = `${discountPrice} $`;

            priceWrapper.append(priceContainer);
            priceContainer.style.textDecoration = 'line-through';
            priceWrapper.append(discountPriceContainer);  // Додаємо контейнер зі знижкою, якщо вона є
        } else {
            priceWrapper.append(priceContainer);
            priceContainer.style = 'font-size: 20px';
        }

        // Додаємо елементи до DOM
        itemQuantity.append(item.quantity);
        
        quantityContainer.append(decreaseButton, itemQuantity, increaseButton);
        itemContainer.append(itemImage, listItem);
        itemFooterContainer.append(quantityContainer, priceWrapper)
        cartItemsContainer.append(itemContainer, itemFooterContainer);
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