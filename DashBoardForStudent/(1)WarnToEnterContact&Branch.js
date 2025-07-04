const token = sessionStorage.getItem("authToken");
document.addEventListener("DOMContentLoaded" , GetAndStore);

async function GetAndStore(){

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

        const userData = await response.json();

        if (response.ok) {
            if(!userData.Usercontactno || !userData.Userbranch){
                const result = await Swal.fire({
                    icon: 'warning',
                    title: 'Warning ',
                    html: `
                        <p>You have not entered your:</p>
                        <ol style="text-align: left;">
                            <li>Contact Number</li>
                            <li>User Branch</li>
                            <li>Nickname</li>
                        </ol>
                        <p>Please Enter</p>
                    `,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                
                if (result.isConfirmed){
                    window.location.href = "../Profile_page_For_student/Profile.html";
                }
            }
        } else {
            if (response.status === 401 || response.status === 403) {
                sessionStorage.clear();
                Swal.fire({
                    icon: 'error',
                    title: 'Session Expired',
                    text: 'Your session has expired. Please login again.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Login'
                }).then((result) => {
                    if(result.isConfirmed){
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
}