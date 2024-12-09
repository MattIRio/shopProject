const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

console.log('CSRF Token12312:', csrfToken);
console.log('CSRF Header123123:', csrfHeader);

document.getElementById('userForm').addEventListener('submit', function (event) {
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

        fetch('/loginPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken // 
            },
            body: JSON.stringify(formData),
            credentials: 'include' 
        })
            .then(data => {
                console.log('Дані отримані:', data);
                // window.location.href = data.url;
            })
            .catch(error => {
                console.error('Произошла ошибка при отправке данных:', error);
            });

    }

})