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
        console.log('CSRF Header:', window.csrfHeader); // Для отладки
        console.log('CSRF Token:', window.csrfToken); // Для отладки

        // Отправка данных через POST-запрос
        axios.post('/signUpUser', formData, {
            headers: {
                [window.csrfHeader]: window.csrfToken, // Убедитесь, что здесь всё корректно
            },
            withCredentials: true
        })
        .then(response => {
            console.log('Данные успешно отправлены:', response.data);
        })
        .catch(error => {
            console.error('Произошла ошибка при отправке данных:', error);
        });
    }
});