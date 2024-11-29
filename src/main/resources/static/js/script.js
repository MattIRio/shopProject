async function fetchData() {
    try {
        const response = await fetch('http://localhost:8080/getobjects'); // Надсилання GET-запиту
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`); // Обробка помилок
        }
        const data = await response.json(); // Перетворення відповіді на JSON
        console.log(data); // Вивід отриманих даних у консоль

        // Обробка даних (наприклад, виведення на сторінку)
        displayData(data);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Функція для відображення даних на сторінці
function displayData(data) {
    const container = document.getElementById('data-container'); // Елемент для виведення
    container.innerHTML = ''; // Очищення контейнера

    for (const [key, value] of Object.entries(data)) {
        const div = document.createElement('div');
        div.textContent = `${key}: ${value}`;
        container.appendChild(div);
    }
}