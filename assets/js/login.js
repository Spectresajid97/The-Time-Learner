document.querySelector(".login-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get user input values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Retrieve stored credentials from localStorage
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    // Check if the entered credentials match the stored ones
    if (username === storedUsername && password === storedPassword) {
        alert("Login successful!");
        window.location.href = "../home/home.html"; // Redirect to home page
    } else {
        alert("Invalid username or password. Please try again.");
    }
});

