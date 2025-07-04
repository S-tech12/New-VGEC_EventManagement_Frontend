const token = sessionStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", showData)

async function showData() {

    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'Please login First!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        }).then(()=>{
            window.location.href = "../Login_Folder/Login.html";
        })
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/getUserProfile", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const userData = await response.json();

        if (response.ok) {
            document.getElementById("userImage").src = userData.Userprofileimage || "../Profile_Picture/user_Profile.jpg";
            document.getElementById("Username").textContent = `Username : ${userData.Username}`;
            document.getElementById("UserData").innerHTML = `
                <strong>Email-id:</strong> ${userData.Useremail}<br><br>
                <strong>Role :</strong> ${userData.Userrole}<br><br>
                <strong>FullName :</strong> ${userData.Userfullname}<br><br>
            `;

            document.getElementById("UsercreatedDate").innerHTML = `
            Account created at : ${userData.createdAt.split("T")[0]}`;
            document.getElementById("UserupdatedDate").innerHTML = `
            Last updated at ${userData.updatedAt.split("T")[0]}`

            // this is for the query portion input type email
            document.getElementById("QuerySenderMail").value = userData.Useremail;



            document.getElementById("editFullName").value = userData.Userfullname;
            document.getElementById("editEmail").value = userData.Useremail;
            document.getElementById("editUsername").value = userData.Username;
            document.getElementById("editPassword").value = userData.Userpassword;
            document.getElementById("confirmEditPassword").value = userData.Userpassword;

        } else {
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
            }
        }
    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Server is not working , Please try again later',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    }
};
