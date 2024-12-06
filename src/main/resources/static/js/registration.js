const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

console.log('CSRF Token12312:', csrfToken);
console.log('CSRF Header123123:', csrfHeader);

document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Получаем элементы формы
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Регулярное выражение для email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Регулярное выражение для пароля
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{9,}$/;

    // Проверка email
    if (!emailPattern.test(emailInput.value)) {
        this.querySelector('.email-error-text').style.display = 'block';
    } else {
        this.querySelector('.email-error-text').style.display = 'none';
    }

    // Проверка пароля
    if (!passwordPattern.test(passwordInput.value)) {
        this.querySelector('.password-error-text').style.display = 'block';
        console.log("Неправильный пароль");
    } else {
        this.querySelector('.password-error-text').style.display = 'none';
    }

    // Если данные корректные, отправляем на сервер
    if (passwordPattern.test(passwordInput.value) && emailPattern.test(emailInput.value)) {
        this.querySelector('.email-error-text').style.display = 'none';
        this.querySelector('.password-error-text').style.display = 'none';
        console.log("Вы зарегистрированы!");

        // Создаем объект с данными формы
        const formData = {
            email: emailInput.value,
            password: passwordInput.value,
        };

        console.log(formData);

console.log('CSRF Token12312:', csrfToken);
        // Отправка данных через POST-запрос
        fetch('/signUpUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken // Убедитесь, что CSRF-токен правильный
            },
            body: JSON.stringify(formData), // Преобразуем данные в строку JSON
            credentials: 'include' // Убедитесь, что данные с куки отправляются с запросом
        })
        .then(response => response.json()) // Обрабатываем ответ, преобразуя его в JSON
        .then(data => {
            console.log('Данные успешно отправлены:', data);
        })
        .catch(error => {
            console.error('Произошла ошибка при отправке данных:', error);
        });
    }
});