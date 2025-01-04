// id, category, description, image, price, title
let currentUrl = window.location.href;
console.log(currentUrl);


fetch('http://localhost:8080/api/products/getallproducts')
// fetch('http://localhost:3000/items')
    .then(res => res.json())
    .then(json => {

        const itemCatalog = document.querySelector('.item-catalog');
        json.forEach((item) => {
            // creating elements
            const itemWrapper = document.createElement("li");
            const itemTitle = document.createElement('h4');
            const itemPrice = document.createElement("p");
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

            // Створюємо посилання і обгортаємо картинку
            const itemLink = document.createElement('a');
            itemLink.href = `/itempage/${item.uniqId}`; // Встановлюємо посилання на основі item.uniqId
            itemLink.appendChild(itemImageWrapper); // Додаємо картинку в посилання

            // Додавання елементів
            itemImageWrapper.appendChild(itemImage); // Додаємо зображення в контейнер

            itemTitle.innerHTML = item.productName; // Додаємо назву товару
            itemBrand.innerHTML = item.brand;
            itemPrice.innerHTML = `${item.retailPrice} $`; // Додаємо ціну

            // Додавання класів для текстових елементів
            itemTitle.classList.add('item-title');
            itemBrand.classList.add('item-brand');
            itemPrice.classList.add('item-price');

            // Вставка всіх елементів в картку товару
            itemWrapper.append(itemLink, itemTitle, itemBrand, itemPrice);
            itemCatalog.appendChild(itemWrapper); // Вставка картки в каталог
        })
    })