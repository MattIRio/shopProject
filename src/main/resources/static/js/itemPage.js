let currentUrl = window.location.href;

const idMatch = currentUrl.match(/\/itempage\/([^/]+)/);
const productId = idMatch ? idMatch[1] : null;

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

function getImages(product) {
    let imageArray = [];

    // Перевіряємо, чи існує властивість image у product
    if (product && product.image) {
        const imageData = product.image;
        console.log("product.image:", imageData);  // Діагностика: перевіряємо, що містить image

        // Якщо це URL-адреса (починається з http), додаємо її як є
        if (typeof imageData === 'string' && imageData.startsWith("http")) {
            imageArray = [imageData]; // Додаємо без змін
        } else if (imageData.startsWith("/uploads")) {
            // Якщо це локальний шлях, обробляємо як локальне зображення
            imageArray = [imageData]; // Залишаємо локальний шлях без змін
        } else {
            // Якщо це інший формат (наприклад, JSON-рядок), намагаємось його обробити
            try {
                // Пробуємо парсити як JSON
                imageArray = JSON.parse(imageData || '[]')
                    .map(imageUrl => imageUrl.replace(/\\/g, '/')); // Заміняємо зворотні слеші на прямі
            } catch (error) {
                console.error("Error parsing image JSON:", error);
                imageArray = []; // Якщо помилка, повертаємо порожній масив
            }
        }
    }

    return imageArray; // Завжди повертаємо масив
}

document.addEventListener('DOMContentLoaded', () => {

    fetch(`/addrecomendationtouser/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        }
    })
        .then(response => {

            if (!response.ok) {
                return Promise.reject(`Server error: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            console.log('Response text:', text);
        })
        .catch(error => {
            console.error('Error:', error);
        });


    fetch(`http://localhost:8080/api/products/getproductbyid/${productId}`)
        .then(response => response.json())
        .then(product => {

            const productName = product.productName;
            const description = product.description;
            const price = product.retailPrice;
            const discountedPrice = product.discountedPrice;
            const brand = product.brand;

            // Заповнюємо деталі товару
            document.getElementById('product-details').innerHTML = `
    <div class="product-main">
        <h2>${productName}</h2>
        <p><strong>Brand:</strong> ${brand}</p>
        <div class="price">
            <p>Price:</p>
            ${discountedPrice && discountedPrice < price
                    ? `
                    <p class="original-price"><del>${price} $</del></p>
                    <p class="discounted-price">${discountedPrice} $</p>
                `
                    : `
                    <p class="final-price">${price} $</p>
                `
                }
        </div>
        <button id="add-to-cart-btn">Add to cart</button>
    </div>`;

            document.querySelector('.product-description').innerHTML = `<p>${description}</p>`;

            document.getElementById('add-to-cart-btn').addEventListener('click', () => {
                addToCart(product);
                document.getElementById('cart-modal').style.display = 'block';
            });

            // const product2 = data[0]; // Зміна назви, щоб уникнути конфлікту

            let images = [];
            images = getImages(product);

            const mainSliderWrapper = document.getElementById('main-slider-wrapper');
            const thumbsSliderWrapper = document.getElementById('thumbs-slider-wrapper');

            if (images.length > 0) {
                images.forEach(imageUrl => {
                    const mainSlide = document.createElement('div');
                    mainSlide.className = 'swiper-slide';
                    mainSlide.innerHTML = `<img src="${imageUrl}" alt="Main Image">`;
                    mainSliderWrapper.appendChild(mainSlide);

                    const thumbSlide = document.createElement('div');
                    thumbSlide.className = 'swiper-slide';
                    thumbSlide.innerHTML = `<img src="${imageUrl}" alt="Thumbnail">`;
                    thumbsSliderWrapper.appendChild(thumbSlide);
                });
            } else {
                const mainSlide = document.createElement('div');
                mainSlide.className = 'swiper-slide';
                mainSlide.innerHTML = `<img src="../../css/img/noImageAvailable.png" alt="Main Image">`;
                mainSliderWrapper.appendChild(mainSlide);
                document.querySelector('.thumbs-slider').style.display = 'none';
            }


            // Ініціалізація Swiper
            const thumbsSwiper = new Swiper('.thumbs-slider', {
                loop: false,
                spaceBetween: 10,
                slidesPerView: 6,
                allowTouchMove: false,
                watchSlidesProgress: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });

            const mainSwiper = new Swiper('.main-slider', {
                loop: true,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true,
                },
                thumbs: {
                    swiper: thumbsSwiper,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });

            // Заповнення товарів від того самого продавця
            function showSameBrandItems() {
                fetch(`http://localhost:8080/api/products/getproductsbysellerid/${product.sellerId}`)
                    .then(response => response.json())
                    .then(filteredItems => {
                        const sameBrandItemsSliderWrapper = document.getElementById('same-brand-items-slider-wrapper');
                        filteredItems.forEach(item => {

                            if (item.uniqId === productId) {
                                return; // Пропускаємо цей товар
                            }

                            const itemWrapper = document.createElement("div");
                            const itemTitleWrapper = document.createElement('div');
                            const itemTitle = document.createElement('h4');
                            const itemDiscountPrice = document.createElement('p');
                            const itemPrice = document.createElement('p');
                            const itemBrand = document.createElement('p');
                            const itemImageWrapper = document.createElement('div');

                            itemImageWrapper.classList.add('item-image-wrapper');

                            // Створення зображення
                            const itemImage = document.createElement('img');
                            let imageArray = getImages(item);
                            if (imageArray.length > 0) {
                                itemImage.src = imageArray[0];
                            } else {
                                itemImage.src = '../../css/img/noImageAvailable.png';
                            }


                            // Додавання класу для зображення
                            itemImage.classList.add('item-image');

                            // Створюємо посилання для фото
                            const sanitizedProductName = item.productName.replace(/\//g, '-');

                            const imageLink = document.createElement('a');
                            imageLink.href = `/itempage/${item.uniqId}/${sanitizedProductName}`;
                            imageLink.appendChild(itemImage); // Обгортаємо зображення в посилання
                            itemImageWrapper.appendChild(imageLink);

                            // Створюємо посилання для назви
                            const titleLink = document.createElement('a');
                            titleLink.href = `/itempage/${item.uniqId}/${sanitizedProductName}`;
                            titleLink.textContent = item.productName;
                            titleLink.classList.add('item-title-link'); // Клас для стилізації
                            itemTitle.appendChild(titleLink);

                            itemBrand.innerHTML = item.brand;

                            // Перевірка, чи є знижена ціна
                            if (item.discountedPrice && item.discountedPrice < item.retailPrice) {
                                itemPrice.innerHTML = `<del>${item.retailPrice} $</del>`; // Звичайна ціна
                                itemDiscountPrice.innerHTML = `${item.discountedPrice} $`; // Знижена ціна
                                itemPrice.classList.add('item-price');
                                itemDiscountPrice.classList.add('item-discounted-price');
                            } else {
                                itemPrice.innerHTML = `${item.retailPrice} $`; // Якщо знижки немає
                                itemPrice.classList.add('item-price');
                                itemPrice.classList.add('item-price-no-discount');
                            }

                            // Додавання класів для текстових елементів
                            itemTitleWrapper.classList.add('item-title-wrapper');
                            itemTitle.classList.add('item-title');
                            itemBrand.classList.add('item-brand');

                            // Вставка всіх елементів в картку товару
                            itemTitleWrapper.appendChild(itemTitle);
                            itemWrapper.append(itemImageWrapper, itemTitleWrapper, itemPrice);

                            // Додаємо блок зі знижкою, якщо є
                            if (item.discountedPrice && item.discountedPrice < item.retailPrice) {
                                itemWrapper.append(itemDiscountPrice);
                            }

                            itemWrapper.className = 'swiper-slide';
                            sameBrandItemsSliderWrapper.append(itemWrapper);
                        });

                        const sameBrandItemsSlider = new Swiper('.same-brand-items-slider', {
                            loop: false,
                            spaceBetween: 0,
                            slidesPerView: 6,
                            allowTouchMove: true,
                            watchSlidesProgress: true,
                            navigation: {
                                prevEl: '.swiper-button-prev',
                                nextEl: '.swiper-button-next',
                            },
                        });
                    });
            }
            showSameBrandItems();

            function showRecommendedItems() {
                fetch('http://localhost:8080/getrecomendations')
                    .then(response => response.json())
                    .then(recommendedItems => {
                        const recommendedItemsSliderWrapper = document.getElementById('recommended-items-slider-wrapper');
                        recommendedItems.forEach(item => {

                            const itemWrapper = document.createElement("div");
                            const itemTitleWrapper = document.createElement('div');
                            const itemTitle = document.createElement('h4');
                            const itemDiscountPrice = document.createElement('p');
                            const itemPrice = document.createElement('p');
                            const itemBrand = document.createElement('p');
                            const itemImageWrapper = document.createElement('div');

                            itemImageWrapper.classList.add('item-image-wrapper');

                            // Створення зображення
                            const itemImage = document.createElement('img');
                            let imageArray = getImages(item);
                            if (imageArray.length > 0) {
                                itemImage.src = imageArray[0];
                            } else {
                                itemImage.src = '../../css/img/noImageAvailable.png';
                            }

                            // Додавання класу для зображення
                            itemImage.classList.add('item-image');

                            // Створюємо посилання для фото
                            const sanitizedProductName = item.productName.replace(/\//g, '-');

                            const imageLink = document.createElement('a');
                            imageLink.href = `/itempage/${item.uniqId}/${sanitizedProductName}`;
                            imageLink.appendChild(itemImage); // Обгортаємо зображення в посилання
                            itemImageWrapper.appendChild(imageLink);

                            // Створюємо посилання для назви
                            const titleLink = document.createElement('a');
                            titleLink.href = `/itempage/${item.uniqId}/${sanitizedProductName}`;
                            titleLink.textContent = item.productName;
                            titleLink.classList.add('item-title-link'); // Клас для стилізації
                            itemTitle.appendChild(titleLink);

                            itemBrand.innerHTML = item.brand;

                            // Перевірка, чи є знижена ціна
                            if (item.discountedPrice && item.discountedPrice < item.retailPrice) {
                                itemPrice.innerHTML = `<del>${item.retailPrice} $</del>`; // Звичайна ціна
                                itemDiscountPrice.innerHTML = `${item.discountedPrice} $`; // Знижена ціна
                                itemPrice.classList.add('item-price');
                                itemDiscountPrice.classList.add('item-discounted-price');
                            } else {
                                itemPrice.innerHTML = `${item.retailPrice} $`; // Якщо знижки немає
                                itemPrice.classList.add('item-price');
                                itemPrice.classList.add('item-price-no-discount');
                            }

                            // Додавання класів для текстових елементів
                            itemTitleWrapper.classList.add('item-title-wrapper');
                            itemTitle.classList.add('item-title');
                            itemBrand.classList.add('item-brand');

                            // Вставка всіх елементів в картку товару
                            itemTitleWrapper.appendChild(itemTitle);
                            itemWrapper.append(itemImageWrapper, itemTitleWrapper, itemPrice);

                            // Додаємо блок зі знижкою, якщо є
                            if (item.discountedPrice && item.discountedPrice < item.retailPrice) {
                                itemWrapper.append(itemDiscountPrice);
                            }

                            itemWrapper.className = 'swiper-slide';
                            recommendedItemsSliderWrapper.append(itemWrapper);
                        });

                        // Ініціалізація слайдера Swiper
                        const recommendedItemsSlider = new Swiper('.recommended-items-slider', {
                            loop: false,
                            spaceBetween: 0,
                            slidesPerView: 6,
                            allowTouchMove: true,
                            watchSlidesProgress: true,
                            navigation: {
                                prevEl: '.swiper-button-prev',
                                nextEl: '.swiper-button-next',
                            },
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching recommended items:', error);
                    });
            }

            // Викликаємо функцію для відображення рекомендацій
            showRecommendedItems();
        });
});