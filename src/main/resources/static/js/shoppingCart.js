function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-badge').innerHTML = totalCount;
}

function getImages(product) {
    let imageArray = [];

    if (product && product.image) {
        const imageData = product.image;

        if (typeof imageData === 'string' && imageData.startsWith("http")) {
            imageArray = [imageData];
        } else if (imageData.startsWith("/uploads")) {
            imageArray = [imageData];
            console.log(imageArray);
        } else {
            try {
                imageArray = JSON.parse(imageData || '[]')
                    .map(imageUrl => imageUrl.replace(/\\/g, '/')); // Заміняємо зворотні слеші на прямі
                    console.log(imageArray);
            } catch (error) {
                console.error("Error parsing image JSON:", error);
                imageArray = []; // Якщо помилка, повертаємо порожній масив
            }
        }
    }

    return imageArray; // Завжди повертаємо масив
}

// Додавання товару в кошик
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Отримати існуючий кошик або пустий масив
    const existingProductIndex = cart.findIndex(item => item.id === product.uniqId);

    if (existingProductIndex !== -1) {
        // Якщо товар вже є в кошику, збільшуємо його кількість
        cart[existingProductIndex].quantity += 1;
    } else {
        // Додаємо новий товар до кошика
        const productToAdd = {
            id: product.uniqId,
            name: product.productName,
            price: product.retailPrice,
            image: getImages(product)[0] || '../../css/img/noImageAvailable.png',
            discountPrice: product.discountedPrice,
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

    cart.forEach((item, index) => {
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
        const deleteButtonWrapper = document.createElement('div'); // Контейнер для кнопки видалення
        const deleteButton = document.createElement('button'); // Кнопка видалення товару

        itemImage.classList.add('cart-item-image');
        itemContainer.classList.add('item-container');
        quantityContainer.classList.add('quantity-container');
        priceContainer.classList.add('price-container');
        discountPriceContainer.classList.add('discount-price-container');
        itemFooterContainer.classList.add('item-footer-container');
        itemQuantity.classList.add('item-quantity');
        priceWrapper.classList.add('price-wrapper');
        deleteButton.classList.add('delete-btn'); // Додаємо клас для стилізації кнопки видалення
        deleteButtonWrapper.classList.add('delete-btn-wrapper'); // Клас для контейнера кнопки видалення

        // Виведення інформації про товар
        itemImage.src = getImages(item)[0] || '../../css/img/noImageAvailable.png';
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

        // Обробник для видалення товару
        deleteButton.addEventListener('click', () => {
            cart.splice(index, 1); // Видаляємо товар з масиву
            localStorage.setItem('cart', JSON.stringify(cart)); // Оновлюємо кошик в локальному сховищі
            updateCartModal();
            updateCartCount();
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
            priceWrapper.append(discountPriceContainer); // Додаємо контейнер зі знижкою, якщо вона є
        } else {
            priceWrapper.append(priceContainer);
            priceContainer.style = 'font-size: 20px';
        }

        // Додаємо елементи до DOM
        itemQuantity.append(item.quantity);

        quantityContainer.append(decreaseButton, itemQuantity, increaseButton);
        itemContainer.append(itemImage, listItem);

        // Обертаємо кнопку видалення в контейнер і додаємо його в itemContainer
        deleteButtonWrapper.appendChild(deleteButton);
        itemContainer.appendChild(deleteButtonWrapper);

        itemFooterContainer.append(quantityContainer, priceWrapper);

        const itemInCartWrapper = document.createElement('div');
        itemInCartWrapper.classList.add('item-in-cart-wrapper');
        itemInCartWrapper.append(itemContainer, itemFooterContainer);

        cartItemsContainer.append(itemInCartWrapper);
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