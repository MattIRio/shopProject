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
                const fixedJson = product.image
                .replace(/\\/g, '\\\\') 
                .replace(/,\s*C:/g, ',"C:')
                .replace(/\[C:/g, '["C:')
                .replace(/\.jpg/g, '.jpg"')
                .replace(/\.webp/g, '.webp"') 
                .replace(/\.png/g, '.png"'); 

                imageArray = JSON.parse(fixedJson || '[]')
                    .map(imageUrl => imageUrl.includes("\\uploads")
                        ? "/uploads" + imageUrl.split("uploads")[1].replace(/\\/g, '/')
                        : imageUrl
                    );
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

const searchBar = document.getElementById('search-bar');
const searchResultsContainer = document.getElementById('results-container');
const overlay = document.querySelector('.search-overlay');
let searchTimer;

// Функція для виконання пошуку
const fetchResults = (query) => {
    fetch(`/api/products/getproductsbyname/${query}`)
        .then(response => response.json())
        .then(data => {
            data = data.slice(0, 10);
            searchResultsContainer.style.display = 'block';
            searchResultsContainer.innerHTML = ""; // Очищаємо контейнер

            if (data.length === 0) {
                searchResultsContainer.innerHTML = "<div>No results found</div>";
                return;
            }

            // Створюємо список результатів
            const ul = document.createElement("ul");
            ul.classList.add("results-list"); // Додаємо клас для стилізації

            data.forEach(item => {
                const li = document.createElement("li");

                const link = document.createElement("a");
                link.textContent = item.productName;
                const sanitizedProductName = item.productName.replace(/\//g, '-');
                link.href = `/itempage/${item.uniqId}/${sanitizedProductName}`;

                li.appendChild(link);
                ul.appendChild(li);
            });

            searchResultsContainer.appendChild(ul); // Додаємо список до контейнера
        })
        .catch(error => {
            searchResultsContainer.innerHTML = "<div>No such item</div>";
        });
};

// Обробка події "input"
searchBar.addEventListener("input", () => {
    clearTimeout(searchTimer); // Скидаємо попередній таймер

    searchTimer = setTimeout(() => {
        const query = searchBar.value.trim();

        if (query) {
            searchResultsContainer.style.padding = "10px";
            fetchResults(query); // Викликаємо пошук
        } else {
            searchResultsContainer.innerHTML = "";
            searchResultsContainer.style.padding = "0px";

        }
    }, 500);
});

// Обробка події "focus"
searchBar.addEventListener("focus", () => {
    const query = searchBar.value.trim();
    overlay.style.display = "block";
    searchResultsContainer.style.display = 'block';

    if (query) {
        fetchResults(query); // Викликаємо пошук, якщо поле не порожнє
    }
});

document.addEventListener("mousedown", (event) => {
    if (!searchBar.contains(event.target) && !searchResultsContainer.contains(event.target)) {
        overlay.style.display = "none";
        searchResultsContainer.style.display = 'none';
        searchBar.blur();
    }
});
