// id, category, description, image, price, title
let currentUrl = window.location.href;
console.log(currentUrl);

function getImages(product) {
    let imageArray = [];

    if (product && product.image) {
        const imageData = product.image;

        if (typeof imageData === 'string' && imageData.startsWith("http")) {
            imageArray = [imageData];
        } else if (imageData.startsWith("/uploads")) {
            imageArray = [imageData];
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

let currentPage = 1; // Номер сторінки для завантаження
let isLoading = false; // Для уникнення дублювання запитів
const itemCatalog = document.querySelector('.item-catalog');

const loadProducts = () => {
    if (isLoading) return; // Перевірка, чи йде вже завантаження
    isLoading = true;

    fetch(`http://localhost:8080/api/products/getallproducts?page=${currentPage}`)
        .then(res => res.json())
        .then(json => {
            if (json.length === 0) {
                console.log("No more products to load.");
                window.removeEventListener("scroll", handleScroll); // Вимикаємо подію, якщо більше немає товарів
                return;
            }

            json.forEach((item) => {
                // Створення картки товару
                const itemWrapper = document.createElement("li");
                const itemTitle = document.createElement('h4');
                const itemPrice = document.createElement("p");
                const itemDiscountedPrice = document.createElement("p");
                const itemBrand = document.createElement("p");

                // Створення контейнера для зображення
                const itemImageWrapper = document.createElement('div');
                itemImageWrapper.classList.add('item-image-wrapper'); // Додаємо клас для стилізації

                // Створення зображення
                const itemImage = document.createElement("img");
                let imageArray = getImages(item);
                itemImage.src = imageArray[0]; // Встановлюємо перше зображення
                itemImage.classList.add('item-image');

                // Створення посилання для зображення
                const sanitizedProductName = item.productName.replace(/\//g, '-');
                const itemLink = document.createElement('a');
                itemLink.href = `/itempage/${item.uniqId}/${sanitizedProductName}`;
                itemLink.appendChild(itemImageWrapper);
                itemImageWrapper.appendChild(itemImage);

                // Створення посилання для назви товару
                const itemTitleLink = document.createElement('a');
                itemTitleLink.href = `/itempage/${item.uniqId}/${sanitizedProductName}`;
                itemTitleLink.textContent = item.productName;
                itemTitleLink.classList.add('item-title-link');
                itemTitle.appendChild(itemTitleLink);

                // Відображення текстових даних
                itemBrand.innerHTML = item.brand;

                // Відображення цін
                if (item.discountedPrice && item.discountedPrice < item.retailPrice) {
                    itemPrice.innerHTML = `<s>${item.retailPrice} $</s>`;
                    itemDiscountedPrice.innerHTML = `${item.discountedPrice} $`;
                    itemDiscountedPrice.classList.add('item-discounted-price');
                } else {
                    itemPrice.innerHTML = item.retailPrice ? `${item.retailPrice} $` : 'Not available';
                    if (!item.retailPrice) {
                        itemImage.classList.add('not-available-image');
                    }
                }

                // Додавання класів для текстових елементів
                itemTitle.classList.add('item-title');
                itemBrand.classList.add('item-brand');
                itemPrice.classList.add('item-price');

                // Вставка всіх елементів у картку товару
                if (item.discountedPrice && item.discountedPrice < item.retailPrice) {
                    itemWrapper.append(itemLink, itemTitle, itemBrand, itemPrice, itemDiscountedPrice);
                } else {
                    itemWrapper.append(itemLink, itemTitle, itemBrand, itemPrice);
                }

                itemCatalog.appendChild(itemWrapper); // Вставка картки в каталог
            });

            currentPage++; // Збільшуємо номер сторінки
            isLoading = false; // Завершуємо завантаження
        })
        .catch(error => {
            console.error("Error loading products:", error);
            isLoading = false;
        });
};

// Обробник прокрутки
const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadProducts(); // Завантажуємо нові товари, якщо досягнуто низу сторінки
    }
};

// Додаємо слухач подій
window.addEventListener("scroll", handleScroll);

// Завантажуємо перші товари
loadProducts();