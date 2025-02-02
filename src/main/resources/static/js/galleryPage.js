function getImages(product) {
    let imageArray = [];

    if (product && product.image) {
        const imageData = product.image[0];

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
                    itemPrice.style.paddingBottom = '28px';
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

            currentPage++;
            isLoading = false;
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

fetch('http://localhost:3000/categories')
    .then(response => response.json())
    .then(data => {
        console.log('API Response:', data); // Лог для перевірки

        const categoryWrappers = document.querySelectorAll('.category-wrapper');
        const allDetails = []; // Масив для зберігання всіх елементів details

        categoryWrappers.forEach(wrapper => {
            const categoryLink = wrapper.querySelector('a.category');
            const categoryName = categoryLink.textContent.trim();

            const categoryData = data.find(cat => cat.name === categoryName);

            if (categoryData && categoryData.subcategories) {
                const details = document.createElement('details');
                details.className = 'category-item';

                const summary = document.createElement('summary');
                summary.appendChild(wrapper.cloneNode(true));
                details.appendChild(summary);

                const ul = createSubcategoryList(categoryData.subcategories, categoryName);
                details.appendChild(ul);

                wrapper.replaceWith(details);

                // Додаємо details до масиву
                allDetails.push(details);

                // Додаємо подію для відкриття/закриття при натисканні на category-wrapper
                const categoryWrapper = details.querySelector('.category-wrapper');
                categoryWrapper.addEventListener('click', (event) => {
                    event.preventDefault(); // Зупиняємо перехід за посиланням
                    const isOpen = details.hasAttribute('open');
                    details.open = !isOpen;

                    // Закриваємо всі інші елементи details
                    allDetails.forEach(d => {
                        if (d !== details) {
                            d.removeAttribute('open');
                        }
                    });
                });
            }
        });
    })
    .catch(error => console.error('Error fetching categories:', error));


// Функція для створення списку підкатегорій з посиланнями
function createSubcategoryList(subcategories, categoryName) {
    const ul = document.createElement('ul');
    ul.classList.add('subcategory-list');

    subcategories.forEach(subcategory => {
        const li = document.createElement('li');

        // Створюємо посилання
        const link = document.createElement('a');
        const subcategoryName = subcategory.name;
        const categoryEncoded = encodeURIComponent(categoryName); // Кодуємо категорію
        const subcategoryEncoded = encodeURIComponent(subcategoryName); // Кодуємо підкатегорію
        link.href = `http://localhost:8080/mainpage/search?category=${categoryEncoded} >> ${subcategoryEncoded}`;
        link.textContent = subcategoryName;

        // Додаємо стиль для посилання
        link.style.margin = '5px 0';
        link.style.cursor = 'pointer';
        li.appendChild(link);
        ul.appendChild(li);
    });

    return ul;
}