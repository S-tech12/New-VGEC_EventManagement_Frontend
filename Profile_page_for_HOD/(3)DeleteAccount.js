const deleteAccountButton = document.getElementById("deleteAccountButton");

deleteAccountButton.addEventListener("click", DeleteAccount);


async function DeleteAccount() {
    try {
        const response = await fetch("http://localhost:3000/DeleteAccountForHOD", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                title: "THE ACCOUNT HAS BEEN DELETED!!, You are redirecting to the signup page",
                timer: 4000,
                icon: "success",
                showConfirmButton: false,
                timerProgressBar: true
            });
            document.getElementById("deleteAccountModalCancelButton").click();
            deleteAccountModalCancelButton
            setTimeout(() => {
                window.location.href = "../SignUp_Folder/SignUp.html";
            }, 4500);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Can\'t Delete Account!!',
                text: data.message,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then((result)=>{
                if(result.isConfirmed){
                    document.getElementById("deleteAccountModalCancelButton").click();
                }
            })
        }
    } catch (err) {
        console.log("This is the error : ", err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Server is not working , Please try again later',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    }
}
