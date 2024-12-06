
    function getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }

    //Перевірка на правильність даних
    document.getElementById('userForm').addEventListener('submit', function (event) {
        event.preventDefault();

        // Отримуємо елементи форми
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        // Регулярний вираз для email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Регулярний вираз для пароля
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{9,}$/;

        // Перевірка email
        if (!emailPattern.test(emailInput.value)) {
            this.querySelector('.email-error-text').style.display = 'block';
        } else {
            this.querySelector('.email-error-text').style.display = 'none';
                }

        // Перевірка пароля
        if (!passwordPattern.test(passwordInput.value)) {
            this.querySelector('.password-error-text').style.display = 'block';
            console.log("pass incorect")
        } else {
            this.querySelector('.password-error-text').style.display = 'none';
           }

        if(passwordPattern.test(passwordInput.value) && emailPattern.test(emailInput.value)) {
            this.querySelector('.email-error-text').style.display = 'none';
            this.querySelector('.password-error-text').style.display = 'none';

            console.log("You are registered!")


            // Створюємо об'єкт з даними форми
            const formData = {
                email: emailInput.value,
                password: passwordInput.value,
            };

            console.log(formData);

            // Відправка даних через POST-запит
            axios.post('/signUpUser', formData, {
                        headers: {
                            'X-CSRF-TOKEN': getCsrfToken() //
                        }
                    })
            .then(response => {
                console.log('Дані успішно відправлено:', response.data);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });

        }
      });

