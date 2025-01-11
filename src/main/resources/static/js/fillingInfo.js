const sellerButton = document.getElementById("sellerButton");
const customerButton = document.getElementById("customerButton");
// Отримуємо CSRF токен та заголовок
const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');


sellerButton.addEventListener("click", (event) => {
    if (!sellerButton.classList.contains('pressed')) {
        sellerButton.classList.add('pressed');
        customerButton.classList.remove('pressed');
    }
    const sellerForm = document.getElementById('fillingInfoSeller');
    const customerForm = document.getElementById('fillingInfoCustomer');

    sellerForm.style.display = 'block';
    customerForm.style.display = 'none';
})

customerButton.addEventListener("click", (event) => {
    if (!customerButton.classList.contains('pressed')) {
        customerButton.classList.add('pressed');
        sellerButton.classList.remove('pressed');

        const sellerForm = document.getElementById('fillingInfoSeller');
        const customerForm = document.getElementById('fillingInfoCustomer');

        sellerForm.style.display = 'none';
        customerForm.style.display = 'block';
    }

})

const input = document.getElementById('fileInput');
const image = document.getElementById('image');
const cropButton = document.getElementById('cropButton');
const croppedImage = document.getElementById('croppedImage');
const exitCross = document.getElementById('exitCross');
let cropper;

// Завантаження зображення
input.addEventListener('change', (event) => {
    document.querySelector('.cropContainerWrapper').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';

    const file = event.target.files[0];
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

            exitCross.addEventListener('click', () => {
                document.querySelector('.cropContainerWrapper').style.display = 'none';
                document.querySelector('.overlay').style.display = 'none';
                if (cropper) cropper.destroy();

            })
        };
        reader.readAsDataURL(file);
    } else {
        input.value = "";
    }
});

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

const fileInput = document.getElementById('fileInput');

// Обрізка зображення
cropButton.addEventListener('click', () => {
    document.querySelector('.cropContainerWrapper').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    document.getElementById('addPhotoImg').style.display = 'none';
    if (cropper) {
        const croppedCanvas = cropper.getCroppedCanvas({ width: 300, height: 300 }); // Отримати обрізане зображення
        croppedCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            croppedImage.src = url; // Відображення результату


            const file = new File([blob], `${fileInput.files[0].name}`, { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files; // Оновлюємо поле input
            console.log(fileInput.files)
        });
    }
});


//Відправка інформації користувача
document.getElementById('fillingInfoCustomer').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = document.querySelector('#fillingInfoCustomer');
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');

    const namePattern = /^[A-Za-z ]{6,}$/;
    const phonePattern = /^\+(\d{10,15})$/;

    if (!namePattern.test(nameInput.value)) {
        this.querySelector('.name-error-text').style.display = 'block';
    } else {
        this.querySelector('.name-error-text').style.display = 'none';
    }

    if (!phonePattern.test(phoneInput.value)) {
        this.querySelector('.phone-error-text').style.display = 'block';
    } else {
        this.querySelector('.phone-error-text').style.display = 'none';
    }

    if (namePattern.test(nameInput.value) && phonePattern.test(phoneInput.value)) {
        const formData = {
            userName: nameInput.value,
            phoneNumber: phoneInput.value,
            userType: "BUYER",
        };

        try {
            // Виконуємо асинхронний запит на сервер
            const response = await fetch('/saveuserinfo', {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    [csrfHeader]: csrfToken // Додаємо CSRF токен в заголовки
                }
            });

            if (response.ok) {
                console.log('Login successful');
                // Можна додати перенаправлення або повідомлення для користувача
            } else {
                console.error('Login failed', await response.text());
            }
        } catch (error) {
            console.error('Error during fetch', error);
        }
    }
});


//Відправка інформації продавцем
document.getElementById('fillingInfoSeller').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = document.querySelector('#fillingInfoSeller');
    const nameInput = document.getElementById('sellerName');
    const phoneInput = document.getElementById('sellerPhone');

    const namePattern = /^[A-Za-z ]{2,}$/;
    const phonePattern = /^\+(\d{10,15})$/;

    // Перевірка полів
    if (!namePattern.test(nameInput.value)) {
        this.querySelector('.name-error-text').style.display = 'block';
    } else {
        this.querySelector('.name-error-text').style.display = 'none';
    }

    if (!phonePattern.test(phoneInput.value)) {
        this.querySelector('.phone-error-text').style.display = 'block';
    } else {
        this.querySelector('.phone-error-text').style.display = 'none';
    }

    if (namePattern.test(nameInput.value) && phonePattern.test(phoneInput.value)) {
        const userData = {
            userName: nameInput.value,
            phoneNumber: phoneInput.value,
            userType: 'SELLER'
        };

        try {
            // Відправка текстових даних
            const userResponse = await fetch('/saveuserinfo', {
                method: 'PUT',
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json',
                    [csrfHeader]: csrfToken // CSRF токен
                }
            });

            if (userResponse.ok) {
                console.log('Text data uploaded');
            } else {
                console.error('Text data not uploaded', await userResponse.text());
            }

            // Відправка фото
            const formDataPhoto = new FormData();
            const fileInput = form.querySelector('input[type="file"]');

            if (fileInput.files.length > 0) {
                formDataPhoto.append('file', fileInput.files[0]);

                const photoResponse = await fetch('/upload/uploadprofilepic', {
                    method: 'POST',
                    body: formDataPhoto,
                    headers: {
                        [csrfHeader]: csrfToken // CSRF токен
                    }
                });

                if (photoResponse.ok) {
                    console.log('Image Uploaded');
                    window.location.href = "/mainpage";
                } else {
                    console.error('Image not uploaded', await photoResponse.text());
                }
            } else {
                console.warn('No file selected for upload');
            }
        } catch (error) {
            console.error('Error during fetch', error);
        }
    }
});
