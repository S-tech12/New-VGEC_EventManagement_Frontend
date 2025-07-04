// Attach an event listener to the login button
const Loginbutton = document.getElementById("Loginbutton");

Loginbutton.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get the username and password values from the input fields
    const Username = document.getElementById("Username").value.trim();
    const Userpassword1 = document.getElementById("Userpassword1").value.trim();


    // ✅ Get the selected role
    const Userrole = document.getElementById("Userrole").value;

    if (Userrole === "#") {
        iziToast.warning({
            title: 'Missing Fields',
            message: 'Please choose the role!',
            position: 'topRight', // You can change this (e.g., topCenter, bottomRight, etc.)
            timeout: 2000,        // Auto-hide after 4 seconds
            close: true,          // Show close (X) button
            color: 'yellow',      // Optional: custom color (default yellow for warning)
            progressBar: true,    // Optional: progress bar
        });
        return;
    }

    // Check if fields are empty
    if (!Username || !Userpassword1) {
        iziToast.warning({
            title: 'Missing Fields',
            message: 'Please fill in every field!',
            position: 'topRight',
            timeout: 2000, // Keep it until user interacts
            close: true,   // Hide close (X) button
            progressBar: true,
        });
        return;
    }

    try {
        // Send a POST request to the Signuproute route
        const response = await fetch("http://localhost:3000/Loginroute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Username, Userpassword1, Userrole }),
            credentials: "include"
        });

        // Parse the JSON response
        const result = await response.json();

        if (response.ok) {
            iziToast.success({
                title: 'Login Successfully!! 🎉🎉🎉🎊🎊🎊🥳🥳🥳',
                message: '', // Optional, can be left empty
                position: 'topCenter', // Or use 'center' for modal-like feel
                timeout: 1500,
                close: false,
                progressBar: true,
                transitionIn: 'fadeInDown',
                transitionOut: 'fadeOutUp'
            });

            sessionStorage.setItem("authToken", result.token);
            sessionStorage.setItem("userRole", result.role);

            // Redirect based on role
            const role = result.role;

            setTimeout(() => {
                if (role === "Student") {
                    window.location.href = "../DashBoardForStudent/DashBoard.html";
                } else if (role === "HOD") {
                    window.location.href = "../DashBoardForHOD/DashBoard.html";
                } else if (role === "Event Hoster") {
                    window.location.href = "../DashBoardForEventHoster/DashBoard.html";
                } else {
                    alert("Unknown role. Cannot redirect.");
                }
            }, 2000)
        } else {
            // login failed
            iziToast.error({
                title: 'Error',
                message: result.message,
                position: 'topRight',           // Centered like SweetAlert
                timeout: 2000,               // Keeps the alert until user clicks OK
                close: false,
            });
        }
    } catch (err) {
        console.error("Error Login:", err);
        iziToast.error({
            title: 'Server Error',
            message: 'Server is not working currently. Try again later!',
            position: 'center',
            timeout: 2000,
            close: false,
            buttons: [
                ['<button>OK</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                    // Optional: Add any logic after OK is clicked
                }]
            ]
        });
    }
});
