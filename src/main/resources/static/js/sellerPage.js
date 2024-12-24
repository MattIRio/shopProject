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
            const imageArray = JSON.parse(product.image); // Масив зображень для кожного товару
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <div class="product-image-container">
                    <img src="${imageArray[0]}" alt="${product.productName}">
                </div>
                <div class="product-info-container">
                    <h2>${product.productName}</h2>
                    <p><strong>Price:</strong> $${product.retailPrice}</p>
                    <p><strong>Discounted Price:</strong> $${product.discountedPrice}</p>
                    <p><strong>Description:</strong> ${product.description}</p>
                </div>
                <div class="product-edit-buttons-wrapper">
                    <button class="edit-info-button" data-product-id="${product.uniqId}">Edit</button>
                </div>
            `;
            productList.appendChild(productDiv);

            // Обробник кнопки "Edit" - використовуємо замикання, щоб передати правильні дані
            const editButton = productDiv.querySelector('.edit-info-button');
            editButton.addEventListener('click', () => {
                openEditModal(product, imageArray); // Передаємо товар і його масив зображень
            });
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        productList.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    }
}

let photoToUpload = [];

function openEditModal(product, imageArray) {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'flex';

    document.querySelector('.overlay').style.display = 'block';

    // Заповнюємо форму даними
    document.getElementById('edit-name').value = product.productName;
    document.getElementById('edit-price').value = product.retailPrice;
    document.getElementById('edit-discount-price').value = product.discountedPrice || '';
    document.getElementById('edit-description').value = product.description;

    // Очищаємо попередній вміст галереї
    const galleryContainer = document.getElementById('editGalleryContainer');
    galleryContainer.innerHTML = ''; // Очищаємо галерею
    photoToUpload = [];

    // Завантажуємо фото товару з бази даних
    if (imageArray && imageArray.length > 0) {
        imageArray.forEach((imageUrl) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('edit-image-wrapper');

            urlToBlob(imageUrl);

            const img = document.createElement('img');
            img.src = imageUrl; // URL зображення з бази даних
            img.alt = product.productName;

            imgWrapper.appendChild(img);
            galleryContainer.appendChild(imgWrapper);

            // Додаємо функціонал для видалення фото
            imgWrapper.addEventListener('click', () => {
                removeImageFromGallery(imgWrapper, product, imageArray);
            });
        });
    }

    // Додаємо обробник для збереження
    const editForm = document.getElementById('edit-form');
    editForm.onsubmit = async (e) => {
        e.preventDefault();
        await saveEditedProduct(product.id, product.brand); // Зберігаємо зміни
        modal.style.display = 'none';
    };

    // Закриття модального вікна
    document.getElementById('close-modal').onclick = () => {
        modal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    };
}

// Функція для видалення зображення з галереї товару
function removeImageFromGallery(imageElement, product, imageArray) {
    const imageUrl = imageElement.querySelector('img').src;

    // Видаляємо зображення з масиву
    const updatedImages = imageArray.filter(image => image !== imageUrl);

    // Оновлюємо масив зображень у базі даних (необхідно відправити оновлені дані на сервер)
    product.image = JSON.stringify(updatedImages);

    // Видаляємо елемент з DOM
    imageElement.remove();

    photoToUpload.splice(imageArray.indexOf(imageUrl), 1);

    // Можна додати код для відправки оновлених даних на сервер через API (наприклад, PUT запит)
    console.log('Image removed, new image array:', updatedImages);

    
}

async function saveEditedProduct(productId, brand) {
    // Отримуємо дані, які змінюються в процесі редагування
    const updatedProduct = {
        productName: document.getElementById('edit-name').value,
        retailPrice: document.getElementById('edit-price').value,
        discountedPrice: document.getElementById('edit-discount-price').value,
        description: document.getElementById('edit-description').value,
        //сюда збереження товара дописать
    };

    // Завантажуємо поточні дані товару для збереження інших полів без змін
    try {
        const response = await fetch(`http://localhost:3000/items/${productId}`);
        const product = await response.json();

        // Залишаємо старі значення для полів, яких не торкаємось
        const finalProduct = {
            ...product, // зберігаємо всі поточні поля продукту
            ...updatedProduct // оновлюємо лише змінені поля

            //Додать масив зображень photoToUpload

        };

        // Відправляємо PUT запит з оновленими даними
        const putResponse = await fetch(`http://localhost:3000/items/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalProduct),
        });

        if (putResponse.ok) {
            alert('Product updated successfully!');
            getItemsFromSeller(brand); // Оновлюємо список для того ж бренду
        } else {
            alert('Failed to update product');
        }
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

// Викликаємо функцію з конкретним брендом
getItemsFromSeller('Alisha'); // Тут можна передати будь-який бренд



//add-item
const openModalBtn = document.getElementById('add-item');
const closeModalBtn = document.getElementById('closeModalBtn');
const modal = document.getElementById('modal');

// Відкриття модального вікна
openModalBtn.addEventListener('click', () => {
    photoToUpload = [];
    modal.style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
});

// Закриття модального вікна при кліку на кнопку закриття
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
});

// Закриття модального вікна при кліку поза ним
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
});

// //Crop Images
// const fileInput = document.getElementById('fileInput');
// const image = document.getElementById('image');
// const cropButton = document.getElementById('cropButton');
// const exitCross = document.getElementById('exitCross');
// const galleryContainer = document.getElementById('galleryContainer');
// const galleryFiles = [];
// let cropper;
// let originalFileName = ''; // Змінна для зберігання імені файлу

// // Завантаження зображення
// fileInput.addEventListener('change', (event) => {
//     const file = event.target.files[0];
//     document.querySelector('.cropContainerWrapper').style.display = 'block';
//     document.querySelector('.overlay').style.display = 'block';

//     if (file) {
//         originalFileName = file.name;
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             image.src = e.target.result; // Завантажене фото
//             image.style.display = 'block';

//             // Ініціалізація Cropper.js
//             if (cropper) cropper.destroy(); // Знищує попередній cropper
//             cropper = new Cropper(image, {
//                 aspectRatio: 1, // Співвідношення сторін (1 = квадрат)
//                 viewMode: 2,    // Режим відображення
//                 movable: true,  // Можливість переміщення області
//                 zoomable: false, // Масштабування
//                 responsive: false,
//             });
//         };
//         reader.readAsDataURL(file);
//     }
//     else {
//         fileInput.value = "";
//     }

// });

// // Закриття вікна без додавання
// exitCross.addEventListener('click', () => {
//     closeCropper();
// });


// cropButton.addEventListener('click', () => {
//     if (cropper) {
//         // 1. Показати зображення у природному розмірі
//         const naturalCanvas = cropper.getCroppedCanvas(); // Без фіксованих розмірів
//         const naturalUrl = naturalCanvas.toDataURL('image/jpeg');

//         addImageToGallery(naturalUrl); // Додаємо до галереї

//         // 2. Створити зображення з фіксованими розмірами для надсилання
//         const fixedCanvas = cropper.getCroppedCanvas({
//             width: 300,  // Фіксована ширина
//             height: 300, // Фіксована висота
//         });

//         fixedCanvas.toBlob((blob) => {
//             // const file = new File([blob], `fixed_image_${Date.now()}.jpg`, { type: 'image/jpeg' });
//             const file = new File([blob], originalFileName, { type: 'image/jpeg' });
//             console.log('Зображення для надсилання:', file);
//             // 
//             galleryFiles.push(file); // Додаємо файл до масиву
//             logGalleryFiles();

//             const dataTransfer = new DataTransfer();
//             galleryFiles.forEach((file) => {
//                 dataTransfer.items.add(file);
//             });
//             fileInput.files = dataTransfer.files; // Оновлюємо список файлів у input


//         }, 'image/jpeg', 0.9); // Формат і якість зображення

//         // Закрити модальне вікно
//         closeCropper();
//     }
// });

// // Функція для додавання зображення у галерею
// function addImageToGallery(url) {
//     const imgWrapper = document.createElement('div');
//     imgWrapper.classList.add('image-wrapper');

//     const img = document.createElement('img');
//     img.src = url;
//     img.alt = 'Cropped Image';
//     img.classList.add('gallery-image');

//     imgWrapper.appendChild(img);
//     document.getElementById('galleryContainer').appendChild(imgWrapper);

//     imgWrapper.addEventListener('click', () => {
//         removeImageFromGallery(imgWrapper);
//     });
// }

// // Закриття модального вікна
// function closeCropper() {
//     document.querySelector('.cropContainerWrapper').style.display = 'none';
//     document.querySelector('.overlay').style.display = 'none';
//     if (cropper) cropper.destroy();
//     fileInput.value = ""; // Очищаємо значення інпуту
//     cropper = null;
// }

// let resizeTimeout;

// window.addEventListener('resize', () => {
//     clearTimeout(resizeTimeout); // Скидаємо попередній таймер
//     resizeTimeout = setTimeout(() => {
//         if (cropper) {
//             cropper.destroy(); // Знищуємо попередній екземпляр Cropper
//         }
//         cropper = new Cropper(image, { // Створюємо новий
//             aspectRatio: 1,
//             movable: true,  // Можливість переміщення області
//             zoomable: false, // Масштабування
//             viewMode: 1,
//             responsive: false
//         });
//     }, 0);

// });

// function logGalleryFiles() {
//     console.log('All files:');
//     galleryFiles.forEach((file, index) => {
//         console.log(`${index + 1}: ${file.name}, ${file.size} байт`);
//     });
// }

// function removeImageFromGallery(imageElement) {
//     const index = Array.from(document.querySelectorAll('.image-wrapper')).indexOf(imageElement);
//     if (index !== -1) {
//         galleryFiles.splice(index, 1); // Видаляємо файл із масиву
//         imageElement.remove(); // Видаляємо з DOM
//         console.log(`Image #${index + 1} deleted.`);
//         logGalleryFiles(); // Оновлюємо лог файлів
//     }
// }

function setupImageCropper(inputId, galleryId, imgContainerClass) {
    const fileInput = document.getElementById(inputId);
    const galleryContainer = document.getElementById(galleryId);
    const image = document.getElementById('image');
    const cropButton = document.getElementById('cropButton');
    const exitCross = document.getElementById('exitCross');

    const galleryFiles = [];
    let cropper;
    let originalFileName = '';

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        document.querySelector('.cropContainerWrapper').style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';

        if (file) {
            originalFileName = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                image.src = e.target.result;
                image.style.display = 'block';

                if (cropper) cropper.destroy();
                cropper = new Cropper(image, { aspectRatio: 1, viewMode: 2, zoomable: false });
            };
            reader.readAsDataURL(file);
        }
    });

    cropButton.addEventListener('click', () => {
        if (cropper) {
            const naturalCanvas = cropper.getCroppedCanvas();
            const naturalUrl = naturalCanvas.toDataURL('image/jpeg');

            addImageToGallery(naturalUrl, galleryContainer, galleryFiles);

            const fixedCanvas = cropper.getCroppedCanvas({ width: 300, height: 300 });
            fixedCanvas.toBlob((blob) => {
                const file = new File([blob], originalFileName, { type: 'image/jpeg' });
                galleryFiles.push(file);
                logGalleryFiles();
                updateInputFiles(fileInput, galleryFiles);
                photoToUpload.push(file);
            }, 'image/jpeg', 0.9);

            closeCropper();
        }
    });

    exitCross.addEventListener('click', () => closeCropper());

    function addImageToGallery(url, container, filesArray) {
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add(imgContainerClass);

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Cropped Image';
        img.classList.add('gallery-image');

        imgWrapper.appendChild(img);
        container.appendChild(imgWrapper);

        imgWrapper.addEventListener('click', () => removeImageFromGallery(imgWrapper, filesArray, container));
    }

    function removeImageFromGallery(imageElement, filesArray, container) {
        const index = Array.from(container.querySelectorAll(`.${imgContainerClass}`)).indexOf(imageElement);
        if (index !== -1) {
            filesArray.splice(index, 1); // Видаляємо файл із масиву
            imageElement.remove(); // Видаляємо з DOM
            console.log(`Image #${index + 1} deleted.`);
            logGalleryFiles();
            updateInputFiles(fileInput, filesArray);
        }
    }

    function updateInputFiles(input, filesArray) {
        const dataTransfer = new DataTransfer();
        filesArray.forEach((file) => dataTransfer.items.add(file));
        input.files = dataTransfer.files;
    }

    function closeCropper() {
        document.querySelector('.cropContainerWrapper').style.display = 'none';
        // document.querySelector('.overlay').style.display = 'none';
        if (cropper) cropper.destroy();
        cropper = null;
        fileInput.value = '';
    }

    function logGalleryFiles() {
        console.log('All files:');
        galleryFiles.forEach((file, index) => {
            console.log(`${index + 1}: ${file.name}, ${file.size} байт`);
        });
    }

    let resizeTimeout;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout); // Скидаємо попередній таймер

        resizeTimeout = setTimeout(() => {
            if (cropper) {
                cropper.destroy(); // Знищуємо попередній екземпляр Cropper

                cropper = new Cropper(image, {
                    aspectRatio: 1,
                    movable: true,
                    zoomable: false,
                    viewMode: 1,
                    responsive: false, // Оновлення після зміни розміру
                });
            }
        }, 0); // Додаємо невелику затримку, щоб уникнути надмірних викликів
    });
}

// Ініціалізація для обох форм

setupImageCropper('editFileInput', 'editGalleryContainer', 'edit-image-wrapper');
setupImageCropper('fileInput', 'galleryContainer', 'image-wrapper');

//Add Form Gathering
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

    Array.from(fileInput.files).forEach((file, index) => {
        formDataPhoto.append(`file${index + 1}`, file); // Додаємо кожен файл з унікальним ключем
    });

    formDataPhoto.forEach((value, key) => {
        console.log(key, value);
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

function urlToBlob(urlFile) {
    const file = new File([urlFile], urlFile.split('/').pop(), { type: 'image/jpeg' });
    photoToUpload.push(file);
    console.log(photoToUpload);
}