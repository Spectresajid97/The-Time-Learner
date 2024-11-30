(function () {
    emailjs.init("VAYSvxOhzXXTchw_g"); // Replace with your actual Public Key
})();

document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const emailDetails = {
        fullname: formData.get("fullname"),
        email: formData.get("email"),
        username: formData.get("username"),
        phone_no: formData.get("phone-no"),
        password: formData.get("password"),
    };

    console.log("Attempting to send email with details:", emailDetails);

    emailjs
        .send("service_2cmnmuh", "template_c78yx2n", emailDetails, "VAYSvxOhzXXTchw_g")
        .then(function (response) {
            console.log("Success:", response);
            alert("Email sent successfully!");
        })
        .catch(function (error) {
            console.error("Error:", error);
            alert("Failed to send email: " + error.text);
        });
});
