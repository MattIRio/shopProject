const params = new URLSearchParams(window.location.search);

const category = params.get('category');
// const minPrice = params.get('minPrice');
// const maxPrice = params.get('maxPrice');

const productSearchText = params.get('productName');


let currentPage = 0; // Номер сторінки для завантаження
let isLoading = false; // Для уникнення дублювання запитів
const itemCatalog = document.querySelector('.item-catalog');


async function loadProducts() { // Додаємо async, оскільки використовується await
    if (isLoading) return; // Перевірка, чи йде вже завантаження
    isLoading = true;

    try {
        const products = await fetchProductsFromFilterURL(); // Очікуємо результати запиту

        if (products.length === 0) { // Використовуємо products замість json
            console.log("No more products to load.");
            window.removeEventListener("scroll", handleScroll); // Вимикаємо подію, якщо більше немає товарів
            isLoading = false;
            return;

        }

        products.forEach((item) => {
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
        isLoading = false;

        currentPage++;

    } catch (error) { // Обробка помилок
        console.error("Error loading products:", error);
    }

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



async function fetchProductsFromFilterURL() {
    const baseUrl = "http://localhost:8080/api/products/search";

    // Отримуємо query-параметри з поточного URL
    const urlParams = new URLSearchParams(window.location.search);

    // Створюємо об'єкт параметрів для запиту
    const params = {
        category: urlParams.get("category"),
        brand: urlParams.getAll("brand"), // Отримуємо всі значення для ключа "brand"
        minPrice: urlParams.get("minPrice"),
        maxPrice: urlParams.get("maxPrice"),
        productName: urlParams.get("productName"),
        page: currentPage,
        // size: urlParams.get("size"),
        // size: 10,
    };

    // Формуємо рядок запиту
    const searchParams = new URLSearchParams();

    if (params.category) searchParams.append("category", params.category);
    if (params.brand) {
        params.brand.forEach(brand => searchParams.append("brand", brand));
    }
    if (params.minPrice) searchParams.append("minPrice", params.minPrice);
    if (params.maxPrice) searchParams.append("maxPrice", params.maxPrice);
    if (params.productName) searchParams.append("productName", params.productName);
    searchParams.append("page", params.page);
    if (params.size) searchParams.append("size", params.size);

    // Формуємо фінальний URL
    const url = `${baseUrl}?${searchParams.toString()}`;
    // console.log(searchParams.toString());



    await fetch(`/api/products/count-Products-By-Brands-Category-In-Price-Range?${searchParams.toString()}`)
        .then(response => response.text()) // Очікуємо текстову відповідь
        .then(count => {
            document.querySelector('.filtered-amount').innerText = `Found ${count} items`;
        })

    if (productSearchText) {
        document.querySelector('.title').innerText = `Results for «${productSearchText}»`;
    } else {
        document.querySelector('.title').innerText = `Results for ${category.split(">>")[1].trim()}:`

    }

    searchParams.delete('page');

    getMaxAndMinPrice(searchParams.toString());

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Fetched products:", data);
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

const brandContainer = document.querySelector('.brand-filter-brands');
const brandFilterInput = document.querySelector('#brand-filter-input');
const selectedFilters = new Set();

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
        const brandItemContainer = document.createElement('div');
        brandItemContainer.className = 'brand-item-container';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'brand-checkbox';
        checkbox.id = brand;
        checkbox.value = brand;

        const label = document.createElement('label');
        label.htmlFor = brand;
        label.className = 'brand-item';
        label.textContent = brand;

        // Додаємо чекбокс і мітку в контейнер
        brandItemContainer.appendChild(checkbox);
        brandItemContainer.appendChild(label);

        brandItemContainer.addEventListener('click', (event) => {
            if (event.target !== checkbox && event.target !== label) {
                checkbox.checked = !checkbox.checked;
            }

            const wasAdded = checkbox.checked; // Перевіряємо, чи бренд додано
            if (wasAdded && !selectedFilters.has(brand)) {
                selectedFilters.add(brand);
            } else if (!wasAdded && selectedFilters.has(brand)) {
                selectedFilters.delete(brand);
            } else {
                return; // Стан не змінився, тому завершимо обробку
            }

            updateQueryParameters();

            const selectedFiltersContainer = document.getElementById('selected-filters');
            if (!selectedFiltersContainer) {
                console.error("Container for selected brands not found!");
                return;
            }

            const existingBrandBlock = document.querySelector(`.selected-filter[data-brand="${brand}"]`);

            if (checkbox.checked && !existingBrandBlock) {
                // Якщо бренд обраний, додаємо блок
                const brandBlock = document.createElement('div');
                brandBlock.className = 'selected-filter';
                brandBlock.dataset.brand = brand; // Зберігаємо бренд в атрибуті
                brandBlock.textContent = brand;

                // Додаємо кнопку для видалення
                const removeImg = document.createElement('img');
                removeImg.src = '../../css/img/close-cross.png';
                removeImg.className = 'remove-filter-btn';

                // Видалення блоку при кліку на будь-яку його частину
                brandBlock.addEventListener('click', () => {
                    brandBlock.remove(); // Видаляємо блок
                    checkbox.checked = false; // Скидаємо чекбокс
                    selectedFilters.delete(brand); // Видаляємо бренд із фільтрів
                    updateQueryParameters(); // Оновлюємо URL-параметри
                });

                brandBlock.appendChild(removeImg);
                selectedFiltersContainer.appendChild(brandBlock);

                // Додаємо бренд у глобальну змінну
                selectedFilters.add(brand);
            } else if (!checkbox.checked && existingBrandBlock) {
                existingBrandBlock.remove();
                selectedFilters.delete(brand);
            }
        });

        // Додаємо контейнер бренду в основний контейнер
        brandContainer.appendChild(brandItemContainer);
    });

    if (!document.querySelector('.selected-price')) {
        initializeFiltersFromURL();
    } 
}

function updateQueryParameters() {
    const queryParams = new URLSearchParams(window.location.search);

    if (selectedFilters.size > 0) {
        queryParams.set('brand', Array.from(selectedFilters).join(','));
        itemCatalog.innerHTML = '';
    } else {
        queryParams.delete('brand'); // Видаляємо параметр, якщо немає обраних брендів
        itemCatalog.innerHTML = '';
    }



    if (selectedPrice.length > 0) {
        queryParams.set('minPrice', selectedPrice[0]);
        queryParams.set('maxPrice', selectedPrice[1]);
        itemCatalog.innerHTML = '';
    };

    // Формуємо новий URL
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
    currentPage = 0;
    window.addEventListener("scroll", handleScroll);
    loadProducts();
}



function getBrands() {

    const urlParams = new URLSearchParams(window.location.search);

    // Створюємо об'єкт параметрів для запиту
    const params = {
        category: urlParams.get("category"),
        brand: urlParams.getAll("brand"), // Отримуємо всі значення для ключа "brand"
        minPrice: urlParams.get("minPrice"),
        maxPrice: urlParams.get("maxPrice"),
        productName: urlParams.get("productName"),
        page: currentPage,
        // size: urlParams.get("size"),
        // size: 10,
    };

    // Формуємо рядок запиту
    const searchParams = new URLSearchParams();

    if (params.category) searchParams.append("category", params.category);
    if (params.brand) {
        params.brand.forEach(brand => searchParams.append("brand", brand));
    }
    if (params.minPrice) searchParams.append("minPrice", params.minPrice);
    if (params.maxPrice) searchParams.append("maxPrice", params.maxPrice);
    if (params.productName) searchParams.append("productName", params.productName);

    const url = `/api/products/get-brands?${searchParams.toString()}`;

    getBrandsByQuery(url)
        .then(brands => {
            const brandsArray = brands;
            updateBrandList(brandsArray);
            activateBrandCheckboxes();

            // Фільтрація брендів по введеному значенню
            brandFilterInput.addEventListener('input', () => {
                const filterValue = brandFilterInput.value.toLowerCase();
                const filteredBrands = brandsArray.filter(brand =>
                    brand.toLowerCase().includes(filterValue)
                );
                updateBrandList(filteredBrands);
                activateBrandCheckboxes();
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

getBrands();


function getBrandsByQuery(query) {
    return fetch(query)
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

const minPriceInput = document.getElementById('min-price-number-input');
const maxPriceInput = document.getElementById('max-price-number-input');
const priceFilterButton = document.getElementById('price-filter-btn');


async function getMaxAndMinPrice(query) {
    const baseUrl = "/api/products/get-max-and-min-price-by-category-brand-or-name?";
    const url = `${baseUrl}${query}`;


    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    const urlParams = new URLSearchParams(window.location.search);
    const minPrice = urlParams.get("minPrice");
    const maxPrice = urlParams.get("maxPrice");

    const minValue = minPrice && maxPrice ? minPrice : data.minValue;
    const maxValue = minPrice && maxPrice ? maxPrice : data.maxValue;


    minPriceInput.value = minValue;
    maxPriceInput.value = maxValue;

    priceValidaton(minValue, maxValue);

}

function priceValidaton(minValue, maxValue) {
    minPriceInput.addEventListener('input', () => {
        // Перевірка для minPriceInput
        if (Number(minPriceInput.value) < minValue ||
            Number(minPriceInput.value) > maxValue
            || Number(minPriceInput.value) > Number(maxPriceInput.value)) {
            minPriceInput.style.borderColor = 'red';
            priceFilterButton.disabled = true;
            priceFilterButton.style.cursor = 'default';
        } else {
            minPriceInput.style.borderColor = 'grey';
            priceFilterButton.disabled = false;
            priceFilterButton.style.cursor = 'pointer';
        }
    });

    maxPriceInput.addEventListener('input', () => {
        // Перевірка для maxPriceInput
        if (Number(maxPriceInput.value) < Number(minPriceInput.value) ||
            Number(maxPriceInput.value) < minValue ||
            Number(maxPriceInput.value) > maxValue) {
            maxPriceInput.style.borderColor = 'red';
            priceFilterButton.disabled = true;
            priceFilterButton.style.cursor = 'default';
        } else {
            maxPriceInput.style.borderColor = 'grey';
            priceFilterButton.disabled = false;
            priceFilterButton.style.cursor = 'pointer';
        }
    });
}

loadProducts();
const selectedPrice = [];


priceFilterButton.addEventListener('click', () => {
    const minPrice = minPriceInput.value;
    const maxPrice = maxPriceInput.value;
    createPriceFilterBlock(minPrice, maxPrice)
})


function initializeFiltersFromURL() {

    const urlParams = new URLSearchParams(window.location.search);
    const minPrice = urlParams.get("minPrice");
    const maxPrice = urlParams.get("maxPrice");

    if (minPrice && maxPrice) {
        createPriceFilterBlock(minPrice, maxPrice);
    }

    // Якщо є бренди - додаємо чекбокси
    if (urlParams.has("brand")) {
        const brandList = urlParams.get("brand").split(",");
        brandList.forEach(brand => {
            createBrandFilterBlock(brand);  // Створюємо блок для кожного бренду
        });
    }

}

function createPriceFilterBlock(minPrice, maxPrice) {
    selectedPrice.length = 0;

    try {
        document.querySelector(".selected-price").remove();
    } catch { }

    selectedPrice.push(minPrice, maxPrice);

    const priceFilterBlock = document.createElement("div");
    priceFilterBlock.classList.add("selected-price");
    priceFilterBlock.innerText = `${minPrice}$ - ${maxPrice}$`;

    const removeImg = document.createElement("img");
    removeImg.src = "../../css/img/close-cross.png";
    removeImg.className = "remove-filter-btn";

    priceFilterBlock.appendChild(removeImg);
    document.getElementById("selected-filters").appendChild(priceFilterBlock);

    // Видалення блоку при кліку
    priceFilterBlock.addEventListener("click", () => {
        priceFilterBlock.remove();
        selectedPrice.length = 0;
        params.delete('minPrice');
        params.delete('maxPrice');
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
        updateQueryParameters();
    });

    updateQueryParameters();
    getBrands();
}


function createBrandFilterBlock(brand) {
    if (selectedFilters.has(brand)) return;

    selectedFilters.add(brand);

    const brandBlock = document.createElement("div");
    brandBlock.className = "selected-filter";
    brandBlock.dataset.brand = brand;
    brandBlock.textContent = brand;

    const removeImg = document.createElement("img");
    removeImg.src = "../../css/img/close-cross.png";
    removeImg.className = "remove-filter-btn";

    brandBlock.appendChild(removeImg);
    document.getElementById("selected-filters").appendChild(brandBlock);

    // Знаходимо чекбокс і активуємо його
    console.log("Всі чекбокси на сторінці:", document.querySelectorAll("input[type='checkbox']"));
    const checkbox = document.querySelector(`input[type="checkbox"][value="${brand}"]`);
    if (checkbox) checkbox.checked = true;

    // Видалення блоку та оновлення URL
    brandBlock.addEventListener("click", () => {
        brandBlock.remove();
        selectedFilters.delete(brand);
        if (checkbox) checkbox.checked = false;
        updateQueryParameters(); // Оновлюємо параметри в URL
    });
    updateQueryParameters(); // Оновлюємо параметри в URL
}

function activateBrandCheckboxes() {
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get("brand"); // Отримуємо всі бренди з URL

    if (brandParam) {
        const brands = brandParam.split(",");

        brands.forEach(brand => {
            // Знайти чекбокс по значенню бренду
            const checkbox = document.querySelector(`input[type="checkbox"][value="${brand}"]`);
            // Якщо чекбокс є, ставимо його в активний стан
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
    
}


