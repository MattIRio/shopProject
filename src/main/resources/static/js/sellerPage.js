const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

async function uploadUserPhotoAndName() {
    const isUserAuthenticated = await fetch("/isuserauthenticated");
    if (isUserAuthenticated.ok) {
        const userDataFetch = await fetch("/getcurrentuserdata");
        const userData = await userDataFetch.json();
        const profilePicturePath = userData.profilePicture;

        let profilePicture = profilePicturePath.split("/uploads")[1]; // Отримуємо все після '/uploads'
        profilePicture = "/uploads" + profilePicture;  // Додаємо '/uploads' назад

        document.getElementById('user-name-header').innerHTML = userData.userName;
        document.querySelector('.seller-name').innerHTML = userData.userName;
        document.querySelector('.seller-phone').innerHTML = userData.phoneNumber;
        document.getElementById('seller-photo').src = profilePicture;
        document.getElementById('default-user-icon').src = profilePicture;

        addEditHandlers(userData);
    }
}

function addEditHandlers(userData) {
    const editNameButton = document.querySelector('.edit-name-btn');
    const editPhoneButton = document.querySelector('.edit-phone-btn');

    // Редагування імені
    editNameButton.addEventListener('click', () => handleEdit('.seller-name', 'userName', userData, editNameButton));

    // Редагування телефону
    editPhoneButton.addEventListener('click', () => handleEdit('.seller-phone', 'phoneNumber', userData, editPhoneButton));
}

function handleEdit(selector, field, userData, button) {
    const element = document.querySelector(selector);
    const originalValue = element.innerText;

    element.innerHTML = `<input type="text" class="edit-input" value="${originalValue}" />`;
    const input = element.querySelector('.edit-input');
    input.focus();

    button.style.display = 'none';
    const confirmButton = document.createElement('button');
    const cancelButton = document.createElement('button');

    confirmButton.innerHTML = '✔';
    confirmButton.classList.add('confirm-btn');
    cancelButton.innerHTML = 'X';
    cancelButton.classList.add('cancel-btn');

    button.parentElement.appendChild(confirmButton);
    button.parentElement.appendChild(cancelButton);

    confirmButton.addEventListener('click', async () => {
        const newValue = input.value.trim();

        if (
            (field === 'userName' && /^[A-Za-z ]{2,}$/.test(newValue)) ||
            (field === 'phoneNumber' && /^\+(\d{10,15})$/.test(newValue))
        ) {
            element.innerText = newValue;
            document.querySelector('.data-validation-error').style.display = "none";
            // Відправка змін на сервер
            await updateUserData({ ...userData, [field]: newValue });

            // Повернення кнопки "Редагувати"
            cleanupEdit(button, confirmButton, cancelButton);
        } else {
            document.querySelector('.data-validation-error').style.display = "block";
        }
    });

    // Обробка скасування змін
    cancelButton.addEventListener('click', () => {
        element.innerText = originalValue;
        cleanupEdit(button, confirmButton, cancelButton);
    });


    function handleDocumentClick(event) {
        const isInput = event.target.classList.contains('edit-input');
        const isConfirmButton = event.target.classList.contains('confirm-btn');
        const isCancelButton = event.target.classList.contains('cancel-btn');
        const isEditButton = event.target.classList.contains('edit-btn');

        if (!(isInput || isConfirmButton || isCancelButton || isEditButton)) {
            element.innerText = originalValue;
            cleanupEdit(button, confirmButton, cancelButton);
        }
    }

    // Додаємо обробник події на документ, щоб обробляти натискання поза інпутом
    document.addEventListener('click', handleDocumentClick);
}

function cleanupEdit(editButton, confirmButton, cancelButton) {
    confirmButton.remove();
    cancelButton.remove();

    editButton.style.display = 'inline-block';
}

async function updateUserData(updatedData) {
    try {
        const response = await fetch('/saveuserinfo', {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            }
        });

        if (response.ok) {
            console.log('User data updated successfully');
        } else {
            console.error('Failed to update user data', await response.text());
        }
    } catch (error) {
        console.error('Error updating user data', error);
    }
}

uploadUserPhotoAndName();



async function getItemsFromSeller() {
    const productList = document.querySelector('.items-container');
    productList.innerHTML = '';

    try {
        const response = await fetch('/currentusersproducts');
        const products = await response.json();

        products.forEach(product => {
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

getItemsFromSeller();

let photoToUploadAddItem = [];
let photoToUploadEditItem = [];

function openEditModal(product, imageArray) {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'flex';

    document.querySelector('.overlay').style.display = 'block';

    // Заповнюємо форму даними
    document.getElementById('edit-name').value = product.productName;
    document.getElementById('edit-price').value = product.retailPrice;
    document.getElementById('edit-discount-price').value = product.discountedPrice || '';
    document.getElementById('edit-category').value = product.category;
    document.getElementById('edit-brand').value = product.brand;
    document.getElementById('edit-description').value = product.description;

    const galleryContainer = document.getElementById('editGalleryContainer');
    galleryContainer.innerHTML = ''; // Очищаємо галерею
    photoToUploadEditItem = [];

    if (imageArray && imageArray.length > 0) {
        imageArray.forEach((imageUrl) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('edit-image-wrapper');

            urlToBlobEditing(imageUrl);

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
        await saveEditedProduct(product.uniqId, product.brand); // Зберігаємо зміни
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

    imageElement.remove();

    photoToUploadEditItem.splice(imageArray.indexOf(imageUrl), 1);

    console.log('Image removed, new image array:', updatedImages);


}

async function saveEditedProduct(productId) {
    // Отримуємо дані, які змінюються в процесі редагування
    const updatedProduct = {
        productName: document.getElementById('edit-name').value,
        retailPrice: document.getElementById('edit-price').value,
        discountedPrice: document.getElementById('edit-discount-price').value,
        description: document.getElementById('edit-description').value,
        brand: document.getElementById('edit-brand').value,
        category: document.getElementById('edit-category').value,
    };



    // Завантажуємо поточні дані товару для збереження інших полів без змін
    try {
        const response = await fetch(`/upload/uploadproductspics/${productId}`);
        const product = await response.json();

        // Залишаємо старі значення для полів, яких не торкаємось
        const finalProduct = {
            ...product,
            ...updatedProduct
        };

        // // Відправляємо PUT запит з оновленими даними
        // const putResponse = await fetch(`http://localhost:3000/items/${productId}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(finalProduct),
        // });

        // if (putResponse.ok) {
        //     alert('Product updated successfully!');
        //     getItemsFromSeller(brand); // Оновлюємо список для того ж бренду
        // } else {
        //     alert('Failed to update product');
        // }
    } catch (error) {
        console.error('Error updating product:', error);
    }
}






//add-item
const openModalBtn = document.getElementById('add-item');
const closeModalBtn = document.getElementById('closeModalBtn');
const modal = document.getElementById('modal');

// Відкриття модального вікна
openModalBtn.addEventListener('click', () => {
    photoToUpload = [];
    photoToUploadEditItem = [];
    modal.style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
});

// Закриття модального вікна при кліку на кнопку закриття
closeModalBtn.addEventListener('click', () => {
    photoToUpload = [];
    photoToUploadEditItem = [];
    modal.style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
});

// Закриття модального вікна при кліку поза ним
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        photoToUpload = [];
        photoToUploadEditItem = [];
        modal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
});

function updateProfileImage() {
    sellerPhotoInput = document.getElementById('seller-photo-input');
    sellerPhoto = document.getElementById('seller-photo');
    const image = document.getElementById('image');
    const cropButton = document.getElementById('cropButton');
    const exitCross = document.getElementById('exitCross');

    let cropper;
    let originalFileName = '';

    sellerPhoto.addEventListener('click', () => {
        sellerPhotoInput.click();
    });

    sellerPhotoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            document.querySelector('.cropContainerWrapper').style.display = 'block';
            document.querySelector('.overlay').style.display = 'block';
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

    cropButton.addEventListener('click', async () => {
        if (cropper) {
            // Отримуємо обрізане зображення у вигляді Canvas
            const croppedCanvas = cropper.getCroppedCanvas({ width: 300, height: 300 });

            // Чекаємо на перетворення канвасу в Blob
            const blob = await new Promise((resolve, reject) => {
                croppedCanvas.toBlob((resultBlob) => {
                    if (resultBlob) {
                        resolve(resultBlob);
                    } else {
                        reject('Error creating blob');
                    }
                }, 'image/jpeg');
                closeCropper();
            });

            // Створюємо файл з Blob
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });

            // Створюємо FormData для передачі на сервер
            const formData = new FormData();
            formData.append('file', file); // Додаємо файл у FormData

            // Тепер чекаємо на завершення fetch перед тим, як рухатися далі
            try {
                const response = await fetch('/upload/uploadprofilepic', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        [csrfHeader]: csrfToken // Додаємо CSRF токен в заголовки
                    }
                });

                console.log(response);
                if (response.ok) {
                    console.log('Image Uploaded');
                    setTimeout(async () => {
                        await uploadUserPhotoAndName();
                    }, 1000);
                } else {
                    console.log('Image not uploaded');
                }
            } catch (error) {
                console.error('Error during fetch', error);
            }
        }
    });

    exitCross.addEventListener('click', () => closeCropper());

    function closeCropper() {
        document.querySelector('.cropContainerWrapper').style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
        if (cropper) cropper.destroy();
        cropper = null;
        fileInput.value = '';
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
updateProfileImage();

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


        if (file) {
            document.querySelector('.cropContainerWrapper').style.display = 'block';
            document.querySelector('.overlay').style.display = 'block';
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
                if (imgContainerClass === 'edit-image-wrapper') {
                    photoToUploadEditItem.push(file);
                }
                else {
                    photoToUploadAddItem.push(file);
                }

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
            photoToUploadAddItem.splice(index, 1)
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
// const nameInput = document.getElementById('name');
// const priceInput = document.getElementById('price');
// const quantityInput = document.getElementById('quantity');
// const brandInput = document.getElementById('brand');
// const discountPriceInput = document.getElementById('discountPrice');
// const descriptionInput = document.getElementById('description');

// document.querySelector('form').addEventListener('submit', function (event) {
//     event.preventDefault();

//     const userData = {
//         name: nameInput.value,
//         price: priceInput.value,
//         quantity: quantityInput.value,
//         brand: brandInput.value,
//         discountPrice: discountPriceInput.value,
//         description: descriptionInput.value
//     };

//     console.log(userData);

//     // Відправляємо запит на сервер через fetch
//     fetch('/upload', {
//         method: 'PUT',
//         body: JSON.stringify(userData),
//         headers: {
//             'Content-Type': 'application/json',
//             [csrfHeader]: csrfToken // CSRF токен
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Success:', data);
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//         });

//     const formDataPhoto = new FormData();

//     photoToUpload.files.forEach((file, index) => {
//         formDataPhoto.append(`file${index + 1}`, file); // Додаємо кожен файл з унікальним ключем
//     });

//     formDataPhoto.forEach((value, key) => {
//         console.log(key, value);
//     });

//     fetch('/upload', {
//         method: 'POST',
//         body: formDataPhoto,
//         headers: {
//             [csrfHeader]: csrfToken // Додаємо CSRF токен в заголовки
//         }
//     }).then(response => {
//         console.log(response);
//         if (response.ok) {
//             // Якщо запит успішний, можна перенаправити користувача або відобразити повідомлення
//             console.log('Login successful');
//         } else {
//             // Обробка помилок
//             console.log('Login failed');
//         }
//     }).catch(error => {
//         console.error('Error during fetch', error);
//     });
// });

function urlToBlobAdding(urlFile) {
    const file = new File([urlFile], urlFile.split('/').pop(), { type: 'image/jpeg' });
    photoToUploadAddItem.push(file);
    console.log(photoToUploadAddItem);
}

function urlToBlobEditing(urlFile) {
    const file = new File([urlFile], urlFile.split('/').pop(), { type: 'image/jpeg' });
    photoToUploadEditItem.push(file);
    console.log(photoToUploadEditItem);
}