const QueryButton = document.getElementById("QueryButton");
const QuerySpinner = document.getElementById("QuerySpinner");
const QueryButtonText = document.getElementById("QueryButtonText");

QueryButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const QuerySubject = document.getElementById("QuerySubject").value.trim();
    const QueryMessage = document.getElementById("QueryMessage").value.trim();
    const QuerySenderMail = document.getElementById("QuerySenderMail").value.trim();

    if (!QuerySubject || !QueryMessage || !QuerySenderMail) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Fields',
            text: 'Please fill in every field!',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
        return;
    }

    const allowedDomain = "@vgecg.ac.in";
    if (!QuerySenderMail.endsWith(allowedDomain)) {
        Swal.fire({
            icon: 'error',
            title: 'Incorrect Data',
            text: 'This Website is just useful for the VGEC Student. Enter your college ID!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Spinner show + disable button
    QueryButton.disabled = true;
    QuerySpinner.classList.remove("d-none");
    QueryButtonText.textContent = "Submitting...";

    try {
        const response = await fetch("https://new-vgec-eventmanagement-backend.onrender.com/QueryrouteForStudent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ QueryMessage, QuerySubject, QuerySenderMail }),
            credentials: "include"
        });

        if (response.status === 401 || response.status === 403) {
            sessionStorage.clear();
            Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: 'Your session has expired. Please log in again.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "../Login_Folder/Login.html";
                }
            });
            return;
        }

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Query Sent Successfully! 📩✅',
                text: 'We will get back to you shortly.',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            }).then(() => {
                location.reload();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Send',
                text: result.message || 'Unable to send your message. Please try again later.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        }
    } catch (err) {
        console.error("Error query:", err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Server is not working currently. Try again later!',
            confirmButtonText: 'OK',
            confirmButtonColor: '#d33',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
    } finally {
        // Spinner hide + enable button
        QuerySpinner.classList.add("d-none");
        QueryButtonText.textContent = "Submit";
        QueryButton.disabled = false;
    }
});
