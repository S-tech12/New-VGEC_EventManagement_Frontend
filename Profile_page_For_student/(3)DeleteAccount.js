const deleteAccountButton = document.getElementById("deleteAccountButton");

deleteAccountButton.addEventListener("click", DeleteAccount);

async function DeleteAccount(){
    try{
        const response = await fetch("http://localhost:3000/DeleteAccountForStudent",{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

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
        const data = await response.json();

        console.log(response);
        if(response.ok){
            document.getElementById("deleteAccountModalCloseButton").click();
            Swal.fire({
                title: "THE ACCOUNT HAS BEEN DELETED!!, You are redirecting to the signup page",
                timer: 4000,
                icon: "success",
                showConfirmButton: false,
                timerProgressBar: true
            });
            setTimeout(()=>{
                window.location.href="../SignUp_Folder/SignUp.html";
            },2000);
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        }
    }catch(err){
        console.log("error" ,err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Server is not working , Please try again later',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    }
}
