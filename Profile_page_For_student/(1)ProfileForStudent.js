const token = sessionStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", showData);

async function showData() {

    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'Please login First!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        window.location.href = "../Login_Folder/Login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/getUserProfile", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
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

        const userData = await response.json();

        if (response.ok) {
            document.getElementById("userImage").src = userData.Userprofileimage || "../Profile_Picture/user_Profile.jpg";
            document.getElementById("Username").textContent = `Username : ${userData.Username}`;
            document.getElementById("UserData").innerHTML = `
            <strong>FullName :</strong> ${userData.Userfullname}<br><br>
                <strong>Email-id:</strong> ${userData.Useremail}<br><br>
                <strong>Role :</strong> ${userData.Userrole}<br><br>
                <strong>Contact No :</strong> +91  ${userData.Usercontactno}<br><br>
                <strong>Branch :</strong> ${userData.Userbranch}<br><br>
            `;
            document.getElementById("UsercreatedDate").innerHTML = `
                Account created at : ${userData.createdAt.split("T")[0]}`;

            document.getElementById("UserupdatedDate").innerHTML = `
                Last updated at : ${userData.updatedAt.split("T")[0]}`;

            document.getElementById("editFullName").value = userData.Userfullname;
            document.getElementById("editEmail").value = userData.Useremail;
            document.getElementById("editUsername").value = userData.Username;
            document.getElementById("editPassword").value = userData.Userpassword;
            document.getElementById("confirmEditPassword").value = userData.Userpassword;


            // this is for the query input type email section

            document.getElementById("QuerySenderMail").value = userData.Useremail;
            if (!userData.Usercontactno || !userData.Userbranch) {
                document.getElementById("ProfileWarning").innerHTML = `⚠️Please update your profile to enter missing details from 
                <button class="btn btn-outline-danger ms-2" data-bs-toggle="modal" data-bs-target="#updateProfileModal">
                    Update Now
                </button>`;

                document.getElementById("ProfileSuccess").style = "display:none";
            } else {
                document.getElementById("usercontactnumber").value = userData.Usercontactno;
                document.getElementById("userbranch").value = userData.Userbranch;
                const warningElement = document.getElementById("ProfileWarning");
                const successElement = document.getElementById("ProfileSuccess");

                if (warningElement) {
                    warningElement.remove();
                }

                if (successElement) {
                    successElement.remove();
                }
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
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

const UpdateDataButton = document.getElementById("UpdateDataButton");
UpdateDataButton.addEventListener("click", addInfo);

async function addInfo() {
    const Usercontactno = document.getElementById("Usercontactno").value;
    const Userbranch = document.getElementById("Userbranch").value;
    const Usernickname = document.getElementById("Usernickname").value;

    if (!Usercontactno || Usercontactno.length != 10) {
        await Swal.fire({
            icon: 'warning',
            title: 'Invalid Contact Number',
            text: 'Please enter a valid 10-digit contact number.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (Userbranch === "#") {
        await Swal.fire({
            icon: 'warning',
            title: 'Branch Missing',
            text: 'Please choose your branch before submitting.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!Usernickname) {
        await Swal.fire({
            icon: 'warning',
            title: 'Nickname Missing',
            text: 'Please enter your nickname.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (Usernickname.length < 4) {
        await Swal.fire({
            icon: 'warning',
            title: 'Nickname Too Short',
            text: 'The nickname should be longer than 4 characters.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    const nicknamePattern = /^[A-Za-z\s]+$/;

    if (!nicknamePattern.test(Usernickname)) {
        await Swal.fire({
            icon: 'warning',
            title: 'Invalid Nickname',
            text: 'Nickname should not contain numbers or special characters. Only letters and spaces are allowed.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/addInfo", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                Usercontactno: Usercontactno,
                Userbranch: Userbranch,
                Usernickname: Usernickname
            })
        })

        const result = await response.json();

        if (response.ok) {
            document.getElementById("closeButtonOfInformationModal").click();

            document.getElementById("ProfileWarning").remove();


            const successBox = document.getElementById("ProfileSuccess");
            successBox.innerHTML = `🎉 Congratulations! You have updated your profile. Now you can Go to <a href="../DashBoardForStudent/DashBoard.html" class="alert-link">Dashboard</a>.
            `;
            successBox.style.display = "block";

            // Optional auto-hide
            setTimeout(() => {
                successBox.remove();
                location.reload();
            }, 4000);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.err,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        }
    } catch (err) {
        console.error("Error updating profile:", err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Server is not working , Please try again later',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    }
}
