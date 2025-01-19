const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

let isHandlersCreated = false;
async function uploadUserPhotoAndName() {
    const isUserAuthenticated = await fetch("/isuserauthenticated");
    if (isUserAuthenticated.ok) {
        const userDataFetch = await fetch("/getcurrentuserdata");
        const userData = await userDataFetch.json();
        const profilePicturePath = userData.profilePicture;

        let profilePicture = profilePicturePath.split("/uploads")[1]; // Отримуємо все після '/uploads'
        profilePicture = "/uploads" + profilePicture;  // Додаємо '/uploads' назад
        document.querySelector('.signup-badge-href').href = "/sellerPage";

        document.getElementById('user-name-header').innerHTML = userData.userName;
        document.querySelector('.seller-name').innerHTML = userData.userName;
        document.querySelector('.seller-phone').innerHTML = userData.phoneNumber;
        document.getElementById('seller-photo').src = profilePicture;
        document.getElementById('default-user-icon').src = profilePicture;

        if (isHandlersCreated) {
            return;
        } else {
            addEditHandlers(userData);
        }
    }
}

function addEditHandlers(userData) {
    isHandlersCreated = true;
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
            const sanitizedProductName = product.productName.replace(/\//g, '-');

            const productDiv = document.createElement('div');
            let imageArray = [];

            if (product.image) {
                try {
                    // Форматуємо рядок, щоб він став коректним JSON
                    const fixedJson = product.image
                        .replace(/\\/g, '/') // Змінюємо зворотні слеші на прямі
                        .replace(/,\s*C:/g, ',"C:') // Додаємо лапки після ком
                        .replace(/\[C:/g, '["C:') // Додаємо лапки для першого елемента
                        .replace(/C:/g, '"C:') // Додаємо лапки для C:
                        .replace(/\.jpg(?!")/g, '.jpg"') // Закриваємо лапки після .jpg
                        .replace(/\.webp(?!")/g, '.webp"') // Закриваємо лапки після .webp
                        .replace(/\.png(?!")/g, '.png"') // Закриваємо лапки після .png
                        .replace(/"C:/g, 'C:'); // Виправляємо зайві лапки навколо C:


                    // Парсимо оброблений JSON
                    imageArray = JSON.parse(fixedJson || '[]').map(imageUrl =>
                        imageUrl.includes('/uploads') ? '/uploads' + imageUrl.split('uploads')[1] : imageUrl
                    );
                } catch (error) {
                    console.error("Error parsing product.image:", error);
                    imageArray = []; // У разі помилки повертаємо порожній масив
                }
            }

            productDiv.classList.add('product');

            // Перевірка на наявність зображення
            let imageSrc = '';
            if (imageArray.length > 0) {
                imageSrc = imageArray[0];
            } else {
                imageSrc = '../css/img/noImageAvailable.png'; // Вкажіть шлях до плейсхолдера
            }

            productDiv.innerHTML = `
                <div class="product-image-container">
                    <img src="${imageSrc}" alt="${product.productName}">
                </div>
                <div class="product-info-container">
                    <a href="/itempage/${product.uniqId}/${sanitizedProductName}"><h2>${product.productName}</h2></a>
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

async function openEditModal(product, imageArray) {
    const modal = document.getElementById('edit-modal');
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Опціонально: додає плавний ефект прокрутки
    });
    modal.style.display = 'flex';

    document.querySelector('.overlay').style.display = 'block';

    // Заповнюємо форму даними
    document.getElementById('edit-name').value = product.productName;
    document.getElementById('edit-price').value = product.retailPrice;
    document.getElementById('edit-discount-price').value = product.discountedPrice || '';
    document.getElementById('edit-category').value = product.category;
    document.getElementById('edit-brand').value = product.brand;
    document.getElementById('edit-description').value = product.description;
    document.getElementById('edit-quantity').value = product.quantity;

    const galleryContainer = document.getElementById('editGalleryContainer');
    galleryContainer.innerHTML = ''; // Очищаємо галерею
    photoToUploadEditItem = [];

    if (imageArray && imageArray.length > 0) {
        for (const imageUrl of imageArray) { // Використовуємо for...of для послідовності
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('edit-image-wrapper');

            await urlToBlobEditing(imageUrl); // Чекаємо завершення fetch

            const img = document.createElement('img');
            img.src = imageUrl; // URL зображення з бази даних
            img.alt = product.productName;

            imgWrapper.appendChild(img);
            galleryContainer.appendChild(imgWrapper);

            // Додаємо функціонал для видалення фото
            imgWrapper.addEventListener('click', () => {
                removeImageFromEditGallery(imgWrapper, product, imageArray);
            });
        }
    }

    editItemCategoryHandler();

    document.querySelector('.delete-item-btn').addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`/deleteproductfromcurrentseller/${product.uniqId}`, {
                method: 'DELETE',
                headers: {
                    [csrfHeader]: csrfToken, // Додаємо CSRF токен
                },
            });

            const responseData = await response.text(); // Чекаємо завершення запиту
            console.log('Product deleted successfully:', responseData);
            modal.style.display = "none";
            document.querySelector('.overlay').style.display = 'none';
            document.querySelectorAll('.product').forEach(element => element.remove());
            getItemsFromSeller()

        } catch (error) {
            modal.style.display = "none";
            document.querySelector('.overlay').style.display = 'none';
            console.error('Unexpected item delete error:', error);
        }
    });

    // Додаємо обробник для збереження
    const editForm = document.getElementById('edit-form');
    editForm.onsubmit = async (e) => {
        e.preventDefault();
        await saveEditedProduct(product.uniqId); // Зберігаємо зміни
        modal.style.display = 'none';
    };

    // Закриття модального вікна
    document.getElementById('close-modal').onclick = () => {
        modal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    };

}

let isHandlerAttached = false;  // Флаг для контролю кількості обробників

function editItemCategoryHandler() {
    const editButton = document.querySelector(".edit-category-btn");
    const inputField = document.querySelector("#edit-category");
    const categoryContainer = document.querySelector(".category-container");
    const confirmButton = document.querySelector(".confirm-category-btn");
    const cancelButton = document.querySelector(".cancel-category-btn");

    function cleanupCategoryEdit() {
        cancelButton.style.display = 'none';
        confirmButton.style.display = 'none';
        document.querySelectorAll('.select-category-list').forEach(element => element.remove());
        editButton.style.display = "inline-block"; // Показуємо кнопку редагування
    }

    // Оголошуємо обробник події
    const editButtonHandler = () => {
        const originalValue = inputField.value;
        inputField.value = '';
        editButton.style.display = "none"; // Ховаємо кнопку редагування
        cancelButton.style.display = "inline-block";
        confirmButton.style.display = 'inline-block';

        confirmButton.addEventListener("click", () => {
            const newValue = inputField.value.trim();
            if (newValue) {
                cleanupCategoryEdit();
            } else {
                alert("Поле не може бути порожнім");
            }
        });

        // Обробка натискання кнопки скасування
        cancelButton.addEventListener("click", () => {
            inputField.value = originalValue;
            cleanupCategoryEdit();
        });

        fetch('http://localhost:3000/categories')
            .then(response => response.json())
            .then(data => {
                const categoryData = data;

                const container = document.getElementById("category-list-container");

                // Функція для створення нового <select>
                const createSelect = (options, onChangeCallback) => {
                    const select = document.createElement("select");
                    select.classList.add('select-category-list');
                    select.innerHTML = `<option value="">Select an option</option>`;
                    for (const option of options) {
                        const optionElement = document.createElement("option");
                        optionElement.value = option.name;
                        optionElement.textContent = option.name;
                        select.appendChild(optionElement);
                    }
                    select.addEventListener("change", () => onChangeCallback(select));
                    return select;
                };

                // Функція для обробки вибору
                const handleSelection = (parent, data, selectedCategories) => {
                    while (parent.nextSibling) {
                        parent.nextSibling.remove();
                    }

                    const selectedValue = parent.value;
                    if (selectedValue) {
                        const currentIndex = Array.from(container.children).indexOf(parent);
                        selectedCategories.length = currentIndex + 1; // Зберігаємо тільки до поточного рівня
                        selectedCategories[currentIndex] = selectedValue;

                        inputField.value = `${selectedCategories.join(" >> ")}`;

                        const selectedCategory = data.find(category => category.name === selectedValue);
                        if (selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0) {
                            const subCategories = selectedCategory.subcategories;
                            const newSelect = createSelect(subCategories, (newSelectParent) => {
                                handleSelection(newSelectParent, selectedCategory.subcategories, selectedCategories);
                            });
                            container.appendChild(newSelect);
                        }
                    }
                };

                const selectedCategories = [];
                const rootSelect = createSelect(categoryData, (select) => {
                    handleSelection(select, categoryData, selectedCategories);
                    confirmButton.disabled = selectedCategories.length === 0; // Оновлюємо стан кнопки
                });
                container.appendChild(rootSelect);

                confirmButton.addEventListener("click", () => {
                    const selectedCategory = categoryData.find(category => category.name === selectedCategories[0]);

                    let currentCategory = selectedCategory;
                    for (let i = 1; i < selectedCategories.length; i++) {
                        if (currentCategory && currentCategory.subcategories) {
                            currentCategory = currentCategory.subcategories.find(sub => sub.name === selectedCategories[i]);
                        }
                    }

                    if (currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0) {
                        console.warn("Warning: There are still subcategories available for the current selection.");
                    } else {
                        console.log(`Selected Categories: ${selectedCategories.join(" >> ")}`);
                    }
                });
            })
            .catch(error => console.error('Error loading JSON:', error));
    };

    // Перевіряємо, чи вже додано обробник
    if (!isHandlerAttached) {
        editButton.addEventListener("click", editButtonHandler); // Додаємо обробник тільки якщо він ще не доданий
        isHandlerAttached = true;  // Оновлюємо флаг, що обробник тепер доданий
    }
}

function removeImageFromEditGallery(imageElement, product, imageArray) {
    const imageUrl = imageElement.querySelector('img').src;
    const updatedImages = imageArray.filter(image => image !== imageUrl);
    product.image = JSON.stringify(updatedImages);
    imageElement.remove();
    const imageIndex = photoToUploadEditItem.findIndex(image => image.name === imageUrl.split('/').pop());
    if (imageIndex !== -1) {
        photoToUploadEditItem.splice(imageIndex, 1);
    }

    console.log('Image removed, new image array:', photoToUploadEditItem);
}


async function saveEditedProduct(productId) {

    const updatedProduct = {
        uniqId: productId,
        productName: document.getElementById('edit-name').value,
        retailPrice: document.getElementById('edit-price').value,
        discountedPrice: document.getElementById('edit-discount-price').value,
        description: document.getElementById('edit-description').value,
        brand: document.getElementById('edit-brand').value,
        category: document.getElementById('edit-category').value,
        quantity: document.getElementById('edit-quantity').value
    };

    const putResponse = await fetch(`/api/products/changeproductinfo`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        },
        body: JSON.stringify(updatedProduct),
    });

    const formDataPhoto = new FormData();

    photoToUploadEditItem.forEach((file) => {
        formDataPhoto.append(`file`, file);
    });

    formDataPhoto.forEach((value, key) => {
        console.log(key, value);
    });

    fetch(`/upload/uploadproductspics/${productId}`, {
        // fetch(`/upload/uploadeditedproductspics/${productId}`, {
        method: 'POST',
        body: formDataPhoto,
        headers: {
            [csrfHeader]: csrfToken
        }
    }).then(response => {
        console.log(response);
        if (response.ok) {
            console.log('Photo uploaded');
        } else {
            console.log('Photo not uploaded');
        }
    }).catch(error => {
        console.error('Error during fetch', error);
    });


    if (putResponse.ok) {
        alert('Product updated successfully!');
        document.querySelector('.overlay').style.display = 'none';
        getItemsFromSeller(brand); // Оновлюємо список для того ж бренду
    } else {
        document.querySelector('.overlay').style.display = 'none';
        alert('Failed to update product');
    }
}



//add-item
const openModalBtn = document.getElementById('add-item');
const closeModalBtn = document.getElementById('closeModalBtn');
const modal = document.querySelector('.modal');

// Відкриття модального вікна
openModalBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    photoToUploadEditItem = [];
    modal.style.display = 'flex';
    document.querySelector('.overlay').style.display = 'block';
});

// Закриття модального вікна при кліку на кнопку закриття
closeModalBtn.addEventListener('click', () => {
    photoToUploadEditItem = [];
    modal.style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';

});

// Закриття модального вікна при кліку поза ним
window.addEventListener('click', (e) => {
    const editModal = document.getElementById('edit-modal');
    if (e.target === editModal) {
        editModal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
    if (e.target === modal) {
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
                    setTimeout(async () => {
                        await uploadUserPhotoAndName();
                    }, 1000);
                    console.log('Image Uploaded');
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
                updateInputFiles(fileInput, galleryFiles);
                if (imgContainerClass === 'edit-image-wrapper') {
                    photoToUploadEditItem.push(file);
                    console.log(photoToUploadEditItem);
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
            photoToUploadEditItem.splice(index, 1);
            console.log(photoToUploadEditItem);
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
const categoryInput = document.getElementById('category');

document.querySelector('.form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const userData = {
        productName: nameInput.value,
        retailPrice: priceInput.value,
        quantity: quantityInput.value,
        brand: brandInput.value,
        discountedPrice: discountPriceInput.value,
        description: descriptionInput.value,
        category: categoryInput.value,
    };

    console.log(userData);

    // Відправляємо запит на сервер через fetch
    await fetch('http://localhost:8080/api/products/saveproduct', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);

            if (photoToUploadAddItem.length > 0) {
                const formDataPhoto = new FormData();

                photoToUploadAddItem.forEach((file) => {
                    formDataPhoto.append(`file`, file); // Додаємо кожен файл з унікальним ключем
                });

                formDataPhoto.forEach((value, key) => {
                    console.log(key, value);
                });

                fetch(`/upload/uploadproductspics/${data}`, {
                    method: 'POST',
                    body: formDataPhoto,
                    headers: {
                        [csrfHeader]: csrfToken // Додаємо CSRF токен в заголовки
                    }
                }).then(response => {
                    console.log(response);
                    if (response.ok) {
                        console.log('Photo uploaded');
                    } else {
                        console.log('Photo not uploaded');
                    }
                }).catch(error => {
                    console.error('Error during fetch', error);
                });
            }

            nameInput.value = '';
            priceInput.value = '';
            quantityInput.value = '';
            brandInput.value = '';
            discountPriceInput.value = '';
            descriptionInput.value = '';
            categoryInput.value = '';
            document.querySelectorAll('.image-wrapper').forEach(element => element.remove());
            photoToUploadAddItem = [];

            modal.style.display = "none";
            document.querySelector('.overlay').style.display = 'none';
            document.querySelectorAll('.product').forEach(element => element.remove());
            setTimeout(() => { getItemsFromSeller() }, 1000)



        })
        .catch((error) => {
            console.error('Error:', error);
        });


});

function urlToBlobAdding(urlFile) {
    const file = new File([urlFile], urlFile.split('/').pop(), { type: 'image/jpeg' });
    photoToUploadAddItem.push(file);
    console.log(photoToUploadAddItem);
}

async function urlToBlobEditing(urlFile) {
    try {
        const response = await fetch(urlFile);

        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const blob = await response.blob();
        const file = new File([blob], urlFile.split('/').pop(), { type: 'image/jpeg' });

        photoToUploadEditItem.push(file);
        console.log(photoToUploadEditItem);
    } catch (error) {
        console.error('Error during file conversion:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfInput = document.querySelector('form#logout-form input[name="_csrf"]');
    if (csrfInput) {
        csrfInput.value = csrfToken;
    }
});