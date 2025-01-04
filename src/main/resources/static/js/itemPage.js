


document.addEventListener('DOMContentLoaded', () => {

    fetch('http://localhost:3000/items')
        .then(response => response.json())
        .then(data => {
            // Вибираємо перший товар з масиву для прикладу
            const product = data[1];

            // Витягуємо дані
            const imageUrl = JSON.parse(product.image)[0]; // Перше фото
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
                    <p class="price">
                        Price: 
                        ${discountedPrice ? `<del>${price} $</del> ${discountedPrice} $` : `${price} $`}
                    </p>
                    <button id="add-to-cart-btn">Add to cart</button>
                </div>`;

            document.querySelector('.product-description').innerHTML = `<p>${description}</p>`;

            document.getElementById('add-to-cart-btn').addEventListener('click', () => {
                addToCart(product);
            });

            const product2 = data[0]; // Зміна назви, щоб уникнути конфлікту
            const images = JSON.parse(product2.image);

            const mainSliderWrapper = document.getElementById('main-slider-wrapper');
            const thumbsSliderWrapper = document.getElementById('thumbs-slider-wrapper');

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
                const filteredItems = data.filter(item => item.brand === 'Alisha');
                const sameBrandItemsSliderWrapper = document.getElementById('same-brand-items-slider-wrapper');
                filteredItems.forEach(item => {
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
                    let imageArray = JSON.parse(item.image);
                    itemImage.src = imageArray[0];
                    
                    // Додавання класу для зображення
                    itemImage.classList.add('item-image');
                    
                    // Додавання елементів
                    itemImageWrapper.appendChild(itemImage);
                    itemTitle.innerHTML = item.productName;
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
                    itemTitleWrapper.classList.add('item-title-wrapper')
                    itemTitle.classList.add('item-title');
                    itemBrand.classList.add('item-brand');
                    
                    // Вставка всіх елементів в картку товару
                    itemTitleWrapper.appendChild(itemTitle);
                    itemWrapper.append(itemImageWrapper, itemTitleWrapper, itemBrand, itemPrice);
                    
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
            }
            showSameBrandItems();
        });
});