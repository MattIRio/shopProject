// id, category, description, image, price, title
let currentUrl = window.location.href;
console.log(currentUrl);


fetch('http://localhost:8080/api/products/getallproducts')
    .then(res => res.json())
    .then(json => {

        const itemCatalog = document.querySelector('.item-catalog');
        json.forEach((item) => {
            // creating elements
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
            let imageArray = JSON.parse(item.image);
            itemImage.src = imageArray[0]; // Встановлюємо перше зображення

            // Додавання класу для зображення
            itemImage.classList.add('item-image');
            const sanitizedProductName = item.productName.replace(/\//g, '-');
            // Створюємо посилання і обгортаємо картинку
            const itemLink = document.createElement('a');
            itemLink.href = `/itempage/${item.uniqId}/${sanitizedProductName}`; // Встановлюємо посилання на основі item.uniqId
            itemLink.appendChild(itemImageWrapper); // Додаємо картинку в посилання

            // Додавання зображення в контейнер
            itemImageWrapper.appendChild(itemImage);

            // Створюємо посилання для назви товару
            const itemTitleLink = document.createElement('a');
            itemTitleLink.href = `/itempage/${item.uniqId}/${sanitizedProductName}`; // Посилання на товар
            itemTitleLink.textContent = item.productName; // Встановлюємо текст посилання
            itemTitleLink.classList.add('item-title-link'); // Додаємо клас для стилізації
            itemTitle.appendChild(itemTitleLink); // Додаємо посилання в заголовок

            // Відображення текстових даних
            itemBrand.innerHTML = item.brand;

            // Відображення цін
            if (item.discountedPrice && item.discountedPrice < item.retailPrice) {
                // Якщо є знижка
                itemPrice.innerHTML = `<s>${item.retailPrice} $</s>`; // Закреслюємо стару ціну
                itemDiscountedPrice.innerHTML = `${item.discountedPrice} $`; // Відображаємо нову ціну
                itemDiscountedPrice.classList.add('item-discounted-price');
            } else {
                // Якщо немає знижки
                itemPrice.innerHTML = `${item.retailPrice} $`;
            }

            // Додавання класів для текстових елементів
            itemTitle.classList.add('item-title');
            itemBrand.classList.add('item-brand');
            itemPrice.classList.add('item-price');

            // Вставка всіх елементів в картку товару
            if (item.discountedPrice && item.discountedPrice < item.retailPrice) {
                itemWrapper.append(itemLink, itemTitle, itemBrand, itemPrice, itemDiscountedPrice);
            } else {
                itemWrapper.append(itemLink, itemTitle, itemBrand, itemPrice);
            }

            itemCatalog.appendChild(itemWrapper); // Вставка картки в каталог
        });
    });