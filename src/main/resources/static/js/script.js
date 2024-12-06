// id, category, description, image, price, title

// fetch('http://localhost:8080/getallproducts')
// // fetch('http://localhost:3000/items')
// .then(res => res.json())
// .then(json => {
//     const itemCatalog = document.querySelector('.item-catalog');
//     json.forEach((item) => {
//         //creating elements
//         const itemWrapper = document.createElement("li");
//         const itemTitle = document.createElement('h4');
//         const itemPrice = document.createElement("p");
//         const itemImage = document.createElement("img");
//         //appending elements
//         itemTitle.innerHTML = item.product_name;
//         itemPrice.innerHTML = item.retail_price;

//         let imageArray = JSON.parse(item.image)
//         itemImage.src = imageArray[0];
//         //adding classes
//         itemTitle.classList.add('item-title');
//         itemPrice.classList.add('item-price');
//         itemImage.classList.add('item-image');
//         //inserting
//         itemWrapper.append(itemTitle, itemImage, itemPrice);
//         itemCatalog.appendChild(itemWrapper);

//     })
// })

//     document.getElementById('secondPageBtn').addEventListener('click', function() {
//             const userId = 123;  // Пример user_id, замените на нужный вам ID
//             window.location.href = '/secondpage/' + userId;
//         });


// async function fetchData() {
//     try {
//         const response = await fetch('http://localhost:8080/getobjects'); // Надсилання GET-запиту
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`); // Обробка помилок
//         }
//         const data = await response.json(); // Перетворення відповіді на JSON
//         console.log(data); // Вивід отриманих даних у консоль

//         // Обробка даних (наприклад, виведення на сторінку)
//         displayData(data);

//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// // Функція для відображення даних на сторінці
// function displayData(data) {
//     const container = document.getElementById('data-container'); // Елемент для виведення
//     container.innerHTML = ''; // Очищення контейнера

//     for (const [key, value] of Object.entries(data)) {
//         const div = document.createElement('div');
//         div.textContent = `${key}: ${value}`;
//         container.appendChild(div);
//     }
// }

// const obj1 = {
//     name: "lalala",
// }

// const obj2 = {
//     name: "dick",
//     bonus(a, b, c) {
//         console.log(a, b, c);
//         console.log(this.name);

//     },


// }

// obj2.bonus.call(obj1, 1, 2, 3);
