// Display all items from seller
async function getItemsFromSeller(brand) {
    const productList = document.querySelector('.items-container');
    productList.innerHTML = '';

    try {
        // Завантаження JSON даних з сервера
        const response = await fetch('http://localhost:3000/items');
        const products = await response.json();

        // Фільтрація товарів за брендом
        const filteredProducts = products.filter(product =>
            product.brand.toLowerCase() === brand.toLowerCase()
        );

        // Виведення результатів
        if (filteredProducts.length === 0) {
            productList.innerHTML = `<p>No products found for brand: <strong>${brand}</strong>.</p>`;
            return;
        }

        // Відображення товарів
        filteredProducts.forEach(product => {
            const productDiv = document.createElement('div');
            imageArray = JSON.parse(product.image);
            productDiv.classList.add('product');
            productDiv.innerHTML = `
            <div class="product-image-container"><img src="${imageArray[0]}" alt="${product.product_name}"></div>
            <div class="product-info-container">
            <h2>${product.product_name}</h2>
                <p><strong>Price:</strong> $${product.retail_price}</p>
                <p><strong>Discounted Price:</strong> $${product.discounted_price}</p>
                <p><strong>Description:</strong> ${product.description}</p>
            </div>
                
                
            `;
            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        productList.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    }
}

// Викликаємо функцію з конкретним брендом
getItemsFromSeller('aw'); // Тут можна передати будь-який бренд



//add-item
const openModalBtn = document.getElementById('add-item');
const closeModalBtn = document.getElementById('closeModalBtn');
const modal = document.getElementById('modal');

// Відкриття модального вікна
openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Закриття модального вікна при кліку на кнопку закриття
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Закриття модального вікна при кліку поза ним
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

//Crop Images
const fileInput = document.getElementById('fileInput');
const image = document.getElementById('image');
const cropButton = document.getElementById('cropButton');
const exitCross = document.getElementById('exitCross');
const galleryContainer = document.getElementById('galleryContainer');
const galleryFiles = [];
let cropper;

// Завантаження зображення
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    document.querySelector('.cropContainerWrapper').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';


    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            image.src = e.target.result; // Завантажене фото
            image.style.display = 'block';

            // Ініціалізація Cropper.js
            if (cropper) cropper.destroy(); // Знищує попередній cropper
            cropper = new Cropper(image, {
                aspectRatio: 1, // Співвідношення сторін (1 = квадрат)
                viewMode: 2,    // Режим відображення
                movable: true,  // Можливість переміщення області
                zoomable: false, // Масштабування
                responsive: false,
            });
        };
        reader.readAsDataURL(file);
    }
    else {
        fileInput.value = "";
    }

});

// Закриття вікна без додавання
exitCross.addEventListener('click', () => {
    closeCropper();
});

cropButton.addEventListener('click', () => {
    if (cropper) {
        // 1. Показати зображення у природному розмірі
        const naturalCanvas = cropper.getCroppedCanvas(); // Без фіксованих розмірів
        const naturalUrl = naturalCanvas.toDataURL('image/jpeg');

        addImageToGallery(naturalUrl); // Додаємо до галереї

        // 2. Створити зображення з фіксованими розмірами для надсилання
        const fixedCanvas = cropper.getCroppedCanvas({
            width: 300,  // Фіксована ширина
            height: 300, // Фіксована висота
        });

        fixedCanvas.toBlob((blob) => {
            const file = new File([blob], `fixed_image_${Date.now()}.jpg`, { type: 'image/jpeg' });
            console.log('Зображення для надсилання:', file);
            // 
            galleryFiles.push(file); // Додаємо файл до масиву
            logGalleryFiles();

            const dataTransfer = new DataTransfer();
            galleryFiles.forEach((file) => {
                dataTransfer.items.add(file);
            });
            fileInput.files = dataTransfer.files; // Оновлюємо список файлів у input


        }, 'image/jpeg', 0.9); // Формат і якість зображення

        // Закрити модальне вікно
        closeCropper();
    }
});

// Функція для додавання зображення у галерею
function addImageToGallery(url) {
    const imgWrapper = document.createElement('div');
    imgWrapper.classList.add('image-wrapper');

    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Cropped Image';
    img.classList.add('gallery-image');

    imgWrapper.appendChild(img);
    document.getElementById('galleryContainer').appendChild(imgWrapper);

    imgWrapper.addEventListener('click', () => {
        removeImageFromGallery(imgWrapper);
    });
}

// Закриття модального вікна
function closeCropper() {
    document.querySelector('.cropContainerWrapper').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    if (cropper) cropper.destroy();
    fileInput.value = ""; // Очищаємо значення інпуту
    cropper = null;
}

let resizeTimeout;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout); // Скидаємо попередній таймер
    resizeTimeout = setTimeout(() => {
        if (cropper) {
            cropper.destroy(); // Знищуємо попередній екземпляр Cropper
        }
        cropper = new Cropper(image, { // Створюємо новий
            aspectRatio: 1,
            movable: true,  // Можливість переміщення області
            zoomable: false, // Масштабування
            viewMode: 1,
            responsive: false
        });
    }, 0);

});

function logGalleryFiles() {
    console.log('All files:');
    galleryFiles.forEach((file, index) => {
        console.log(`${index + 1}: ${file.name}, ${file.size} байт`);
    });
}

function removeImageFromGallery(imageElement) {
    const index = Array.from(document.querySelectorAll('.image-wrapper')).indexOf(imageElement);
    if (index !== -1) {
        galleryFiles.splice(index, 1); // Видаляємо файл із масиву
        imageElement.remove(); // Видаляємо з DOM
        console.log(`Image #${index + 1} deleted.`);
        logGalleryFiles(); // Оновлюємо лог файлів
    }
}

//Form Gathering
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const quantityInput = document.getElementById('quantity');
const brandInput = document.getElementById('brand');
const discountPriceInput = document.getElementById('discountPrice');
const descriptionInput = document.getElementById('description');

document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Перешкоджаємо стандартному відправленню форми

    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    // Створюємо об'єкт для даних з форми
    const userData = {
        name: nameInput.value,
        price: priceInput.value,
        quantity: quantityInput.value,
        brand: brandInput.value,
        discountPrice: discountPriceInput.value,
        description: descriptionInput.value
    };

    console.log(userData);

    // // Відправляємо запит на сервер через fetch
    // fetch('/????????????', {
    //     method: 'PUT',
    //     body: JSON.stringify(userData),
    //     headers: {
    //         'Content-Type': 'application/json',
    //         [csrfHeader]: csrfToken // CSRF токен
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Success:', data);
    // })
    // .catch((error) => {
    //     console.error('Error:', error);
    // });

    const formDataPhoto = new FormData();
    const fileInput = document.querySelector('input[type="file"]');

    formDataPhoto.append('file', fileInput.files);




    Array.from(fileInput.files).forEach((file, index) => {
        formDataPhoto.append('file[]', file);
    });

    formDataPhoto.forEach((value, key) => {
        console.log(key, value);  // key = 'file[]', value = файл
    });


    // fetch('/upload', {
    //     method: 'POST',
    //     body: formDataPhoto,
    //     headers: {
    //         [csrfHeader]: csrfToken // Додаємо CSRF токен в заголовки
    //     }
    // }).then(response => {
    //     console.log(response);
    //     if (response.ok) {
    //         // Якщо запит успішний, можна перенаправити користувача або відобразити повідомлення
    //         console.log('Login successful');
    //     } else {
    //         // Обробка помилок
    //         console.log('Login failed');
    //     }
    // }).catch(error => {
    //     console.error('Error during fetch', error);
    // });
});