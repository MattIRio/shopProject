// id, category, description, image, price, title

// fetch('http://localhost:8080/getallproducts')
fetch('http://localhost:3000/items')
    .then(res => res.json())
    .then(json => {

        const itemCatalog = document.querySelector('.item-catalog');
        json.forEach((item) => {
            //creating elements
            const itemWrapper = document.createElement("li");
            const itemTitle = document.createElement('h4');
            const itemPrice = document.createElement("p");

            // Створення контейнера для зображення
            const itemImageWrapper = document.createElement('div');
            itemImageWrapper.classList.add('item-image-wrapper'); // Додаємо клас для стилізації

            // Створення зображення
            const itemImage = document.createElement("img");
            let imageArray = JSON.parse(item.image);
            itemImage.src = imageArray[0]; // Встановлюємо перше зображення

            // Додавання класу для зображення
            itemImage.classList.add('item-image');

            // Додавання елементів
            itemImageWrapper.appendChild(itemImage); // Додаємо зображення в контейнер
            itemTitle.innerHTML = item.product_name; // Додаємо назву товару
            itemPrice.innerHTML = `${item.retail_price} $`; // Додаємо ціну

            // Додавання класів для текстових елементів
            itemTitle.classList.add('item-title');
            itemPrice.classList.add('item-price');

            // Вставка всіх елементів в картку товару
            itemWrapper.append(itemImageWrapper, itemTitle, itemPrice);
            itemCatalog.appendChild(itemWrapper); // Вставка картки в каталог


        })
    })