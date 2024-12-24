fetch('http://localhost:3000/items')
    .then(response => response.json())
    .then(data => {
        // Вибираємо перший товар з масиву для прикладу
        const product = data[0];

        // Витягуємо дані
        const imageUrl = JSON.parse(product.image)[0]; // Перше фото
        const productName = product.productName;
        const description = product.description;
        const price = product.retailPrice;
        const discountedPrice = product.discountedPrice;
        const brand = product.brand;

        // Заповнюємо фото
        document.getElementById('product-image').innerHTML = `
            <img src="${imageUrl}" alt="${productName}">
        `;

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
        </div>
    `;

    document.querySelector('.product-description').innerHTML = `

            <p>${description}</p>
        `;

        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
            addToCart(product);
        });

    })
    .catch(error => console.error('Помилка завантаження товару:', error));
