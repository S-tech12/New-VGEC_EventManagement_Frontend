const Loginbutton = document.getElementById("Loginbutton");
const LoginSpinner = document.getElementById("LoginSpinner");
const LoginButtonText = document.getElementById("LoginButtonText");

Loginbutton.addEventListener("click", async (e) => {
    e.preventDefault();

    const Username = document.getElementById("Username").value.trim();
    const Userpassword1 = document.getElementById("Userpassword1").value.trim();
    const Userrole = document.getElementById("Userrole").value;

    // Show spinner and disable button
    Loginbutton.disabled = true;
    LoginSpinner.classList.remove("d-none");
    LoginButtonText.textContent = "Logging in...";

    if (Userrole === "#") {
        iziToast.warning({
            title: 'Missing Fields',
            message: 'Please choose the role!',
            position: 'topRight',
            timeout: 2000,
            close: true,
            progressBar: true,
        });
        resetLoginButton();
        return;
    }

    if (!Username || !Userpassword1) {
        iziToast.warning({
            title: 'Missing Fields',
            message: 'Please fill in every field!',
            position: 'topRight',
            timeout: 2000,
            close: true,
            progressBar: true,
        });
        resetLoginButton();
        return;
    }

    try {
        const response = await fetch("https://new-vgec-eventmanagement-backend.onrender.com/Loginroute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Username, Userpassword1, Userrole }),
            credentials: "include"
        });

        const result = await response.json();

        if (response.ok) {
            iziToast.success({
                title: 'Login Successfully!! 🎉',
                position: 'topCenter',
                timeout: 1500,
                close: false,
                progressBar: true,
                transitionIn: 'fadeInDown',
                transitionOut: 'fadeOutUp'
            });

            sessionStorage.setItem("authToken", result.token);
            sessionStorage.setItem("userRole", result.role);

            setTimeout(() => {
                if (result.role === "Student") {
                    window.location.href = "../DashBoardForStudent/DashBoard.html";
                    resetLoginButton();
                } else if (result.role === "HOD") {
                    window.location.href = "../DashBoardForHOD/DashBoard.html";
                    resetLoginButton();
                } else if (result.role === "Event Hoster") {
                    window.location.href = "../DashBoardForEventHoster/DashBoard.html";
                    resetLoginButton();
                } else {
                    alert("Unknown role. Cannot redirect.");
                    resetLoginButton();
                }
            }, 2000);
        } else {
            iziToast.error({
                title: 'Error',
                message: result.message,
                position: 'topRight',
                timeout: 2000,
                close: false,
            });
            resetLoginButton();
        }
    } catch (err) {
        console.error("Error Login:", err);
        iziToast.error({
            title: 'Server Error',
            message: 'Server is not working currently. Try again later!',
            position: 'center',
            timeout: 2000,
            close: false,
        });
        resetLoginButton();
    }
});

// Reset function to re-enable the button
function resetLoginButton() {
    Loginbutton.disabled = false;
    LoginSpinner.classList.add("d-none");
    LoginButtonText.textContent = "Login";
}
