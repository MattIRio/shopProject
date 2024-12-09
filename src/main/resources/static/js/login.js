const form = document.querySelector('#userForm');

form.addEventListener('submit', function (event) {
    event.preventDefault(); // Запобігаємо стандартному відправленню форми

    // Отримуємо значення полів email і password
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Шаблони для перевірки
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{9,}$/;

    // Логіка перевірки email
    if (!emailPattern.test(emailInput.value)) {
        emailInput.nextElementSibling.style.display = 'block'; // Показати повідомлення про помилку
    } else {
        emailInput.nextElementSibling.style.display = 'none'; // Сховати повідомлення про помилку
    }

    // Логіка перевірки пароля
    if (!passwordPattern.test(passwordInput.value)) {
        passwordInput.nextElementSibling.style.display = 'block'; // Показати повідомлення про помилку
        console.log("Неправильний пароль");
    } else {
        passwordInput.nextElementSibling.style.display = 'none'; // Сховати повідомлення про помилку
    }

    // Якщо дані валідні, виконуємо відправку форми
    if (emailPattern.test(emailInput.value) && passwordPattern.test(passwordInput.value)) {
        // Створюємо FormData з форми
        const formData = new FormData(form);

        // Лог для перевірки значень
        formData.forEach((value, key) => {
            console.log(key, value); // Виводимо значення для email та password
        });

        // Отримуємо CSRF токен та заголовок
        const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

        // Виконуємо запит на сервер
        fetch('/loginPage', {
            method: 'POST',
            body: formData,
            headers: {
                [csrfHeader]: csrfToken // Додаємо CSRF токен в заголовки
            }
        })
        
        .then(response => {
            if (response.ok) {
                // Якщо запит успішний, можна перенаправити користувача або відобразити повідомлення
                console.log('Login successful');
            } else {
                // Обробка помилок
                console.log('Login failed');
            }
        })
        .catch(error => {
            console.error('Error during fetch', error);
        });
    }
});