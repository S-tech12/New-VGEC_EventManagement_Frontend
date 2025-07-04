const sendEmailforForgot = document.getElementById("sendEmailforForgot");

sendEmailforForgot.addEventListener("click", sentEmail);

async function sentEmail() {

    const allowedDomain = "@vgecg.ac.in";

    const EmailforForgot = document.getElementById("EmailforForgot").value.trim();
    const nicknameforForgot = document.getElementById("nicknameforForgot").value.trim();

    let check = EmailforForgot.endsWith(allowedDomain);

    if (!check) {
        iziToast.error({
            title: 'Incorrect Data',
            message: 'This website is only for VGEC students. Please enter your college email ID!',
            position: 'topRight',
            timeout: 3000,
            close: true,
            progressBar: true
        });
        return;
    }

    if (nicknameforForgot.length < 4) {
        iziToast.warning({
            title: 'Incorrect Data',
            message: "The nickname's length must be greater than 4 characters!",
            position: 'topRight',
            timeout: 3000,
            close: true,
            progressBar: true
        });
        return;
    }

    if (nicknameforForgot.length >= 4) {
        try {
            const response = await fetch("http://localhost:3000/SentPasswordRoute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ EmailforForgot, nicknameforForgot })
            });

            const result = await response.json();

            document.getElementById("forgotPasswordModalCancelButton").click();

            if (response.ok) {
                iziToast.success({
                    title: 'Success',
                    message: `Password sent successfully to ${EmailforForgot}!`,
                    position: 'topRight',
                    timeout: 3000,
                    close: true,
                    progressBar: true
                });
                setTimeout(()=>{
                    location.reload();
                },3500);
            } else {
                iziToast.error({
                    title: 'Error',
                    message: result.message || 'An unknown error occurred!',
                    position: 'topRight',
                    timeout: 4000,
                    close: true,
                    progressBar: true
                });
                setTimeout(()=>{
                    location.reload();
                },4500);
            }

        } catch (err) {
            console.error("Error:", err);
            iziToast.error({
                title: 'Server Error',
                message: 'Server is not working. Please try again later.',
                position: 'topRight',
                timeout: 3000,
                close: true,
                progressBar: true
            });
        }
    }
}
