const logoutButton = document.getElementById("LogoutButton");

logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("authToken");

    document.getElementById("LogoutModalCloseButton").click();
    Swal.fire({
        title: "Successfully logout , You are redirecting to the login page!",
        timer: 2000,
        icon: "success",
        showConfirmButton: false,
        timerProgressBar: true
    });

    setTimeout(() => {
        // Redirect to login page
        window.location.href = "../Login_Folder/Login.html";
    }, 2000);
});