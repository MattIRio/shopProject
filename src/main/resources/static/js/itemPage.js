let currentUrl = window.location.href;

const idMatch = currentUrl.match(/\/itempage\/([^/]+)/);
const productId = idMatch ? idMatch[1] : null;

const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

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


async function isUserAuthenticated() {
    const isUserAuthenticatedResponse = await fetch("/isuserauthenticated");
    if (!isUserAuthenticatedResponse.ok) {
        throw new Error(`Failed to check user authentication. Status: ${isUserAuthenticatedResponse.status}`);
    }

    const isUserAuthenticated = await isUserAuthenticatedResponse.json();
    return isUserAuthenticated;
}

document.addEventListener('DOMContentLoaded', async () => {

    if (await isUserAuthenticated()) {
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
    }

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
        <p><strong>Brand:</strong> ${brand || "No Brand"}</p>
        <div class="price">
            <p class="price-title">Price:</p>
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

            if (!price) {
                // itemImage.classList.add('not-available-image');
                document.querySelector('.final-price').innerHTML = 'Not available';
                document.getElementById('add-to-cart-btn').disabled = true;
                document.querySelector('.price-title').style.display = 'none';
            }


            let categoryData = product.category;

            // Перевіряємо, чи це JSON-рядок
            try {
                categoryData = JSON.parse(categoryData);
            } catch (e) {
                // Якщо це не JSON, залишаємо як є
                console.warn("Category is not JSON formatted. Proceeding as raw string.");
            }
            
            // Нормалізуємо категорію до масиву
            let parsedCategory;
            if (Array.isArray(categoryData)) {
                // Якщо це масив, об'єднуємо в рядок
                parsedCategory = categoryData.join(", ").trim();
            } else if (typeof categoryData === "string") {
                // Якщо це рядок, просто обрізаємо пробіли
                parsedCategory = categoryData.trim();
            } else {
                // Якщо категорія не відповідає очікуваному формату
                console.error("Unexpected category format:", categoryData);
                parsedCategory = ""; // Значення за замовчуванням
            }
            
            // Отримуємо збережені категорії
            const storedCategories = JSON.parse(localStorage.getItem("lastCategories")) || [];
            
            // Додаємо нову категорію, якщо вона існує
            if (parsedCategory) {
                storedCategories.push(parsedCategory);
            }
            
            // Обрізаємо список до останніх 5 елементів
            const updatedCategories = storedCategories.slice(-5);
            
            // Зберігаємо оновлений список у localStorage
            localStorage.setItem("lastCategories", JSON.stringify(updatedCategories));
            
            // Читаємо збережені категорії для перевірки
            const viewedCategories = JSON.parse(localStorage.getItem("lastCategories"));
            console.log("Viewed Categories:", viewedCategories);

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

                            if (!item.retailPrice) {
                                itemImage.classList.add('not-available-image');
                                itemPrice.innerHTML = 'Not available';
                            }
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
                // Перевіряємо, чи користувач залогований
                isUserAuthenticated().then(isAuthenticated => {
                    let url = '';
                    let requestOptions = {};

                    if (isAuthenticated) {
                        // Якщо користувач залогований, робимо запит на отримання товарів
                        url = 'http://localhost:8080/getrecomendations';
                        requestOptions = {
                            method: 'GET'
                        };
                    } else {
                        // Якщо користувач не залогований, відправляємо категорії
                        url = 'http://localhost:8080/getrecomendationsfornotloggeduser';
                        requestOptions = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                [csrfHeader]: csrfToken
                            },
                            body: JSON.stringify(viewedCategories) || '',
                        };
                    }

                    fetch(url, requestOptions)
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

                                if (!item.retailPrice) {
                                    itemImage.classList.add('not-available-image');
                                    itemPrice.innerHTML = 'Not available';
                                }
                            });

                            // Ініціалізуємо слайдер
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
                });
            }

            showRecommendedItems();
        });
});
