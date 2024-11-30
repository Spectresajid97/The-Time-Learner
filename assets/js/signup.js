document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get user input values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Store the user credentials in localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("Account created successfully!");
    window.location.href = "../login/login.html"; // Redirect to login page after successful sign-up
});
