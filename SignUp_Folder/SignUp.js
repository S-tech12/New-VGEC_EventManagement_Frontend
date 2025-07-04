// Attach an event listener to the signup button
const Signupbutton = document.getElementById("Signupbutton");

Signupbutton.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get the username and password values from the input fields
    const Userfullname = document.getElementById("Userfullname").value.trim();
    const Useremailid = document.getElementById("Useremailid").value.trim();
    const Username = document.getElementById("Username").value.trim();
    const Userpassword1 = document.getElementById("Userpassword1").value.trim();
    const Userpassword2 = document.getElementById("Userpassword2").value.trim();


    // ✅ Get the selected role
    const Userrole = document.querySelector('input[name="Userrole"]:checked').value;

    // Check if fields are empty
    if (!Username || !Userpassword1 || !Userpassword2 || !Userfullname || !Useremailid) {
        Swal.fire({
            icon: 'question',
            title: 'Missing Fields',
            text: 'Please fill in every field!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    const allowedDomain = "@vgecg.ac.in";

    if (!Useremailid.endsWith(allowedDomain) && Userrole == "Student") {
        Swal.fire({
            icon: 'error',
            title: 'Incorrect Data',
            text: 'This Website is just useful for the VGEC Student Enter Your College id!!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (Userpassword1 !== Userpassword2) {
        Swal.fire({
            icon: 'error',
            title: 'Mismatch',
            text: 'Both Passwords are not same!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    // ✅ Step 1: Request OTP
    try {
        const response = await fetch("http://localhost:3000/Signuproute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Username, Userpassword1, Userfullname, Useremailid, Userrole })
        });

        const result = await response.json();

        if (!response.ok) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: result.message
            });
            return;
        }

        Swal.fire({
            title: "Otp sent to your registered email!",
            timer: 2000,
            icon: "success",
            showConfirmButton: false,
            timerProgressBar: true
        });

        setTimeout(async () => {
            // ✅ Step 2: Prompt for OTP using SweetAlert2
            const { value: enteredOtp, isDismissed, dismiss } = await Swal.fire({
                title: "Enter OTP",
                input: "text",
                inputLabel: "OTP sent to your email",
                inputPlaceholder: "Enter your OTP",
                showCancelButton: true,
                confirmButtonText: "Verify",
                cancelButtonText: "Cancel",
                timer: 60000, // 1 minute = 60000 ms
                timerProgressBar: true,
                inputValidator: (value) => {
                    if (!value) {
                        return "OTP is required!";
                    }
                }
            });
            
            // 🧠 Check if the alert closed due to timer expiry
            if (isDismissed && dismiss === Swal.DismissReason.timer) {
                Swal.fire({
                    icon: "error",
                    title: "OTP Expired",
                    text: "You didn't enter the OTP in time. Please try signing up again.",
                });
            }
        
            if (!enteredOtp) return; // if cancelled or empty, stop
        
            // ✅ Step 3: Verify OTP and Create Account
            try {
                const otpResponse = await fetch("http://localhost:3000/verify-otp-signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: Useremailid, enteredOtp })
                });
        
                const otpResult = await otpResponse.json();
        
                if (otpResponse.ok) {
                    await Swal.fire({
                        icon: "success",
                        title: "Account created successfully!",
                        timer: 2000,
                        showConfirmButton: false,
                        timerProgressBar: true
                    });
                    window.location.href = "../Login_Folder/Login.html";
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Verification Failed",
                        text: otpResult.message
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Something went wrong while verifying the OTP"
                });
            }
        }, 2500);
    } catch (err) {
        console.error("Error:", err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Server is not working , Please try again later',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    }
});
