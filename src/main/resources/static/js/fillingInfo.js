const sellerButton = document.getElementById("sellerButton");
const customerButton = document.getElementById("customerButton");

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
                viewMode: 1,    // Режим відображення
                movable: true,  // Можливість переміщення області
                zoomable: false, // Масштабування
                responsive: false,
            });

            exitCross.addEventListener('click', () => {
                document.querySelector('.cropContainerWrapper').style.display = 'none';
                document.querySelector('.overlay').style.display = 'none';
                if (cropper) cropper.destroy();
                input.value = "";
            })
        };
        reader.readAsDataURL(file);
    }
    input.value = "";
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
    }, 200);

});

// Обрізка зображення
cropButton.addEventListener('click', () => {
    document.querySelector('.cropContainerWrapper').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    document.getElementById('addPhotoImg').style.display = 'none';
    if (cropper) {
        const croppedCanvas = cropper.getCroppedCanvas(); // Отримати обрізане зображення
        croppedCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            croppedImage.src = url; // Відображення результату
        });
    }
});