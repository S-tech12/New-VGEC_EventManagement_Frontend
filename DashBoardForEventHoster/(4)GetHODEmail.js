document.addEventListener("DOMContentLoaded", async () => {
    
    const hodEmail = document.getElementById("hodEmail");

    // Fetch HOD Emails from backend
    try {
        const hodResponse = await fetch("http://localhost:3000/getHodEmails", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    
        const hodData = await hodResponse.json();
    
        if (hodResponse.ok && Array.isArray(hodData)) {
            hodData.forEach(hod => {
                const option = document.createElement("option");
                option.value = hod.email;
                option.textContent = hod.email;
                hodEmail.appendChild(option);
            });
        } else {
            console.warn("Failed to load HOD emails.");
        }
    } catch (err) {
        console.error("Error fetching HOD emails:", err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Server is not working , Please try again later',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    }
    

})