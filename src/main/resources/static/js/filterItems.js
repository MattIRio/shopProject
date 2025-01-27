const params = new URLSearchParams(window.location.search);

const category = params.get('category');
const brand = params.get('brand');
console.log(category);

let currentPage = 1; // Номер сторінки для завантаження
let isLoading = false; // Для уникнення дублювання запитів
const itemCatalog = document.querySelector('.item-catalog');

const loadProducts = () => {
    if (isLoading) return; // Перевірка, чи йде вже завантаження
    isLoading = true;

    fetch(`http://localhost:8080/api/products/getproductsbycategory/${category}`)
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


function getBrandsByCategory(category) {
    return fetch(`/api/products/getbrandsbycategory/${category}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(brands => {
            const filteredBrands = brands.filter(brand => brand !== null);
            document.querySelector('.number-of-brands').innerHTML = ` (${filteredBrands.length})`;
            return filteredBrands.sort((a, b) => a.localeCompare(b));
        })
        .catch(error => {
            console.error('Error fetching brands:', error);
            return [];
        });
}

const brandContainer = document.querySelector('.brand-filter-brands');
const brandFilterInput = document.querySelector('#brand-filter-input');

// Функція для оновлення списку брендів
function updateBrandList(filteredBrands) {
    brandContainer.innerHTML = ''; // Очищаємо контейнер

    if (filteredBrands.length === 0) {
        const noBrandsMessage = document.createElement('span');
        noBrandsMessage.textContent = 'No such brand';
        brandContainer.appendChild(noBrandsMessage);
        return; // Завершуємо виконання функції, якщо немає брендів
    }

    filteredBrands.forEach(brand => {
        // Створюємо контейнер для кожного бренду
        const brandItemContainer = document.createElement('div');
        brandItemContainer.className = 'brand-item-container';
        
        // Створюємо чекбокс для кожного бренду
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'brand-checkbox';
        checkbox.id = brand; // Можна задати id, використовуючи назву бренду

        // Створюємо мітку (label), щоб вона була пов'язана з чекбоксом
        const label = document.createElement('label');
        label.htmlFor = brand; // Вказуємо на id чекбокса
        label.className = 'brand-item';
        label.textContent = brand;

        // Додаємо чекбокс і мітку в контейнер
        brandItemContainer.appendChild(checkbox);
        brandItemContainer.appendChild(label);

        // Додаємо обробник події на весь контейнер, щоб кліки перемикали чекбокс
        brandItemContainer.addEventListener('click', (event) => {
            // Перевіряємо, чи клік був не на чекбоксі, і перемикаємо його стан
            if (event.target !== checkbox && event.target !== label) {
                checkbox.checked = !checkbox.checked; // Перемикаємо стан чекбокса
            }
        });

        // Додаємо контейнер бренду в основний контейнер
        brandContainer.appendChild(brandItemContainer);
    });
}

// Отримуємо бренди і виводимо їх на екран
getBrandsByCategory(category)
    .then(brands => {
        const brandsArray = brands;
        updateBrandList(brandsArray);
        brandFilterInput.addEventListener('input', () => {
            const filterValue = brandFilterInput.value.toLowerCase();

            const filteredBrands = brandsArray.filter(brand =>
                brand.toLowerCase().includes(filterValue)
            );

            updateBrandList(filteredBrands);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });