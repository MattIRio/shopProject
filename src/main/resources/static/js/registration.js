const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{9,}$/;

    if (!emailPattern.test(emailInput.value)) {
        this.querySelector('.email-error-text').style.display = 'block';
    } else {
        this.querySelector('.email-error-text').style.display = 'none';
    }

    if (!passwordPattern.test(passwordInput.value)) {
        this.querySelector('.password-error-text').style.display = 'block';
        console.log("Неправильный пароль");
    } else {
        this.querySelector('.password-error-text').style.display = 'none';
    }

    if (passwordPattern.test(passwordInput.value) && emailPattern.test(emailInput.value)) {
        this.querySelector('.email-error-text').style.display = 'none';
        this.querySelector('.password-error-text').style.display = 'none';

        const formData = {
            email: emailInput.value,
            password: passwordInput.value,
        };

        console.log(formData);

        console.log('CSRF Token12312:', csrfToken);
        fetch('/signUpUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken // Убедитесь, что CSRF-токен правильный
            },
            body: JSON.stringify(formData), // Преобразуем данные в строку JSON
            credentials: 'include' // Убедитесь, что данные с куки отправляются с запросом
        })
            // .then(response => response.json()) // Обрабатываем ответ, преобразуя его в JSON
            .then(data => {
                console.log('Данные успешно отправлены:', data);
                window.location.href = data.url;
                alert('You are registered!')
            })
            .catch(error => {
                console.error('Произошла ошибка при отправке данных:', error);
            });
    }
});

function goBack() {
    window.history.back();
}