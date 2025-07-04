let SaveChangesButton = document.getElementById("SaveChangesButton");

SaveChangesButton.addEventListener("click",updateData);

async function updateData() {
    if (editPassword.value != confirmEditPassword.value) {
        Swal.fire({
            icon: 'error',
            title: 'Mismatch',
            text: 'Both Passwords are not same!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!editFullName.value || !editUsername.value || !editEmail.value) {
        Swal.fire({
            icon: 'question',
            title: 'Missing Fields',
            text: 'Please fill in every field!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }
    try {
        const response = await fetch("https://new-vgec-eventmanagement-backend.onrender.com/updateProfileData", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                Userfullname: editFullName.value,
                Useremail: editEmail.value,
                Username: editUsername.value,
                Userpassword: editPassword.value
            })
        })

        const result = await response.json();
        
        if (response.ok) {
            Swal.fire({
                title: "Profile Updated Successfully!🎉",
                timer: 2000,
                icon: "success",
                showConfirmButton: false,
                timerProgressBar: true
            });
            document.getElementById("closeModalButton").click();
            showData(); // Refresh profile data
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        }
    }catch(err){
        console.error("Error updating profile:", err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Server is not working try again later!!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    }
}
