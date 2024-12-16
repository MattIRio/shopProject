fetch('http://localhost:3000/items')
    .then(response => response.json())
    .then(data => {
        // Вибираємо перший товар з масиву для прикладу
        const product = data[0];

        // Витягуємо дані
        const imageUrl = JSON.parse(product.image)[0]; // Перше фото
        const productName = product.product_name;
        const description = product.description;
        const price = product.retail_price;
        const discountedPrice = product.discounted_price;
        const brand = product.brand;

        // Заповнюємо фото
        document.getElementById('product-image').innerHTML = `
            <img src="${imageUrl}" alt="${productName}">
        `;

        // Заповнюємо деталі товару
        document.getElementById('product-details').innerHTML = `
            <h2>${productName}</h2>
            <p><strong>Brand:</strong> ${brand}</p>
            <p>${description}</p>
            <p class="price">Price: <del>    ${price}</del>    ${discountedPrice} $</p>
            <button id="add-to-cart-btn">Add to cart</button>
        `;

        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
            addToCart(product);
        });

    })
    .catch(error => console.error('Помилка завантаження товару:', error));
