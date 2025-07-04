document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('http://localhost:3000/getHodEmails',{
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const hods = await response.json();

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
        const tableBody = document.querySelector("#HODBox tbody");
        tableBody.innerHTML = ""; // Clear existing rows if any

        hods.forEach((hod, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${hod.fullname || 'N/A'}</td>
                <td>${hod.username || 'N/A'}</td>
                <td>${hod.email}</td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching HOD data:", error);
    }
});