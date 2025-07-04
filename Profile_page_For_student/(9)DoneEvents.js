document.addEventListener("DOMContentLoaded", FillTable);

async function FillTable() {
    const doneEventsTableBody = document.querySelector("#doneEventsTableBody tbody");

    // we have to access the tbody not the whole table

    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'Please login first!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        window.location.href = "../Login_Folder/Login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/DoneEventsDataForStudentProfile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
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

        const eventData = await response.json();

        let userId = null;
        if (response.ok) {
            if (token) {
                const payloadBase64 = token.split('.')[1]; // get the payload part
                const decodedPayload = JSON.parse(atob(payloadBase64)); // decode base64

                userId = decodedPayload.id; // ✅ correct
            }
            const events = eventData.data;

            // Clear any existing table rows
            doneEventsTableBody.innerHTML = "";

            events
                .forEach((event, index) => {
                    const row = document.createElement("tr");

                    console.log("EVENT ID IN FRONTEND :",event._id);
                    row.innerHTML = `
                        <th scope="row">${index + 1}</th>
                        <td>${event.eventName}</td>
                        <td>${event.eventType}</td>
                        <td>${new Date(event.eventDate).toISOString().split('T')[0]}</td>
                        <td>
                            <a href="http://localhost:3000/downloadCertificate/${event._id}?userId=${userId}"class="btn btn-primary"><i class="bi bi-filetype-pdf"></i> Download</a>
                        </td>    
                `;

                    doneEventsTableBody.appendChild(row);
                });
        } else {
            const errorData = await response.json();
            console.log(errorData);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorData.message,
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
}