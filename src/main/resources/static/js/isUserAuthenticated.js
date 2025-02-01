async function uploadUserPhotoAndName() {
    try {
        const isUserAuthenticatedResponse = await fetch("/isuserauthenticated");
        if (!isUserAuthenticatedResponse.ok) {
            throw new Error(`Failed to check user authentication. Status: ${isUserAuthenticatedResponse.status}`);
        }

        const isUserAuthenticated = await isUserAuthenticatedResponse.json(); // Очікуємо true або false
        if (!isUserAuthenticated) {
            return;
        }

        const userDataFetch = await fetch("/getcurrentuserdata");
        if (!userDataFetch.ok) {
            throw new Error(`Failed to fetch user data. Status: ${userDataFetch.status}`);
        }

        const userData = await userDataFetch.json();
        if (userData.profilePicture) {
            let profilePicture = userData.profilePicture.split("/uploads")[1]; // Отримуємо все після '/uploads'
            profilePicture = "/uploads" + profilePicture; // Додаємо '/uploads' назад
            document.getElementById('default-user-icon').src = profilePicture;
        }

        if (userData.userName) {
            document.getElementById('user-name-header').innerHTML = userData.userName;
            document.querySelector('.signup-badge-href').href = "/sellerPage";
        }
    } catch (error) {
        console.error("Error during user data upload:", error);
    }
}

uploadUserPhotoAndName();