document.addEventListener("DOMContentLoaded", FillTable);

async function FillTable() {
    const ApprovedTableBody = document.querySelector("#ApprovedTableBody tbody");
    
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
        const response = await fetch("http://localhost:3000/ApprovedEventsDataForHODProfile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json" ,
                "Authorization": "Bearer " + token
            }
        });

        const eventData = await response.json();

        if (response.ok) {
            const events = eventData.result;

            // Clear any existing table rows
            ApprovedTableBody.innerHTML = "";

            events
            .filter(event => event.Event_Status === "Approved")
            .forEach((event, index)=>{
                const row = document.createElement("tr");
                
                row.innerHTML = `
                        <th scope="row">${index+1}</th>
                        <td>${event.Event_name}</td>
                        <td>${event.Event_type}</td>
                        <td>${new Date(event.Event_date).toISOString().split('T')[0]}</td>
                        <td>
                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#eventDetailModal" onclick='showDetails(${JSON.stringify(event)})'>
                                <i class="bi bi-eye"></i> View Details
                            </button>
                            <button class="btn btn-success" onclick="window.open('https://wa.me/${event.Event_hoster_ContactNo}', '_blank')"> 
                                <i class="bi bi-whatsapp"></i> Chat on WhatsApp
                            </button>
                        </td>
                        <td>
                            <span class="text-success">
                                <b><i class="bi bi-circle-fill"></i> Approved</b>
                            </span>
                        </td>
                    `;
    
                ApprovedTableBody.appendChild(row);
            });
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

}


async function showDetails(event) {
    // Set modal title
    document.getElementById('exampleModalLabel').textContent = ' " ' + event.Event_name + ' " ' + ' Event  Details';

    // conditional fee line
    const feeLine = event.Event_payment === "Paid"
        ? `<p><strong>Fees Per Person:</strong> ₹${event.Event_feesPerPerson}</p>`
        : "";

    // Set modal body content
    const modalBody = document.querySelector('#eventDetailModal .modal-body');
    modalBody.innerHTML = `
        <img src="${event.Event_Poster}" class="img-fluid mb-3" alt="${event.Event_name}">
        <p><strong>Event Name:</strong> ${event.Event_name}</p>
        <p><strong>Organizer:</strong> ${event.Event_hoster_emailid}</p>
        <p><strong>Enrollment No:</strong> ${event.Event_hoster_enrollementNo}</p>
        <p><strong>Contact No:</strong> ${event.Event_hoster_ContactNo}</p>
        <p><strong>Hoster Branch:</strong> ${event.Event_hoster_branch}</p>
        <p><strong>Date:</strong> ${new Date(event.Event_date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${event.from_time} to  ${event.to_time}</p>
        <p><strong>Location:</strong> ${event.Event_location}</p>
        <p><strong>Event Type:</strong> ${event.Event_type}</p>
        <p><strong>Payment:</strong> ${event.Event_payment}</p>
        ${feeLine}
        <p><strong>Description:</strong> ${event.Event_description}</p>
    `;

    // Show the modal
    const eventModal = document.getElementById('eventDetailModal');
    if(!bsModal){
        bsModal = new bootstrap.Modal(eventModal);
    }
    bsModal.show();
}