const token = sessionStorage.getItem("authToken");


document.addEventListener("DOMContentLoaded", () => {
    const alreadyShown = localStorage.getItem("instructionModalShown");

    if (!alreadyShown) {
        const instructionModal = new bootstrap.Modal(document.getElementById('instructionModal'));
        instructionModal.show();

        document.getElementById('acknowledgeInstructions').addEventListener('click', () => {
            localStorage.setItem("instructionModalShown", "true");
            instructionModal.hide();
        });
    }
    
    getData();
});


async function getData() {
    try {
        const response = await fetch("https://vgec-eventmanagement-backend.onrender.com/EventForHODDashboardTable", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })

        const result = await response.json();

        console.log(response.status);
        if (response.status === 401 || response.status === 403) {
            Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: 'Your session has expired. Please login again.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Login'
            }).then(() => {
                // Clear the sessionStorage and redirect to login
                sessionStorage.removeItem("authToken");
                window.location.href = "../Login_Folder/Login.html";
            });
            return;
        }

        if (response.ok) {
            fillTheTable(result.eventRequestedToHOD);
        } else {
            console.log(response.message);
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

async function fillTheTable(events) {
    const eventTable = document.getElementById('eventTable');
    eventTable.innerHTML = ''; // Clear existing rows

    const CurrentDate = new Date();


    // Sort events in ascending order by Event_date
    events.sort((a, b) => new Date(a.Event_date) - new Date(b.Event_date));


    events.forEach((event, index) => {

        const eventDate = new Date(event.Event_date);
        const timeDiff = eventDate - CurrentDate;
        const dayDiff = timeDiff / (1000 * 60 * 60 * 24); // in days


        const row = document.createElement('tr');
        row.setAttribute('data-status', event.status);


        // Apply red background if remaining days < 5
        if (dayDiff > 5 && dayDiff < 8) {
            row.style.backgroundColor = '#f8d7da'; // light red
        }
        
        if(dayDiff <=5){
            row.style.backgroundColor = '#8B0000'; // dark red
        }

        row.innerHTML = `
        <th>${index + 1}</th>
        <td>${event.Event_name}</td>
        <td>${event.Event_type}</td>
        <td>${event.Event_date.split("T")[0]}</td>
        <td>${event.Event_location}</td>
        <td>
            <button type="button" class="btn btn-outline-success" onclick='ApproveEvent(${JSON.stringify(event)})'>
                <i class="bi bi-check-circle"></i> Approve
            </button>
            <button type="button" class="btn btn-outline-danger" onclick='RejectEvent(${JSON.stringify(event)})'>
                <i class="bi bi-x-circle"></i> Reject
            </button>
            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#eventDetailModal" onclick='showDetails(${JSON.stringify(event)})'>
                <i class="bi bi-eye"></i> View Details
            </button>
            <button class="btn btn-success" onclick="window.open('https://wa.me/${event.Event_hoster_ContactNo}', '_blank')"> 
                <i class="bi bi-whatsapp"></i> Chat on WhatsApp
            </button>
        </td>
    `;

        eventTable.appendChild(row);
    });
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

async function ApproveEvent(event) {
    const CurrentDate = new Date();
    const eventDate = new Date(event.Event_date);

    // Calculate difference in milliseconds
    const timeDiff = eventDate - CurrentDate;
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24); // Convert to days

    // Check if the event is more than 5 days away
    if (dayDiff <= 5) {
        await Swal.fire({
            icon: 'error',
            title: 'Too Early!',
            text: 'You can only approve this 5 days before the event date , now you have to reject it',
            timer: 4000,
            timerProgressBar: true,
        });

        try {
            const response = await fetch("https://vgec-eventmanagement-backend.onrender.com/Reject-Event", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(event)
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Event Rejected',
                    text: result.message,
                    timer: 3000,
                    timerProgressBar: true,
                    confirmButtonColor: '#3085d6'
                });

                getData();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Rejection Failed',
                    text: result.message || 'Something went wrong',
                    confirmButtonColor: '#d33'
                });
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Could not reject the event, please try again later.',
                confirmButtonColor: '#d33'
            });
        }
        return; // Stop the function if it's too early
    }


    const confirmation = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to approve the event "${event.Event_name}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'Noooo!'
    });

    if (!confirmation.isConfirmed) {
        return; // User canceled
    }

    try {
        const response = await fetch("https://vgec-eventmanagement-backend.onrender.com/Approve-Event", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(event)
        })

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Event Approved',
                text: result.message,
                timer: 3000,
                timerProgressBar: true,
                confirmButtonColor: '#3085d6'
            });

            getData();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Approval Failed',
                text: result.message || 'Something went wrong',
                confirmButtonColor: '#d33'
            });
        }
    } catch (err) {
        console.log(err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Could not approve the event, please try again later.',
            confirmButtonColor: '#d33'
        });
    }
}

async function RejectEvent(event) {
    const confirmation = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to reject the event "${event.Event_name}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, reject it!',
        cancelButtonText: 'Noooo!'
    });

    if (!confirmation.isConfirmed) {
        return; // User canceled
    }

    try {
        const response = await fetch("https://vgec-eventmanagement-backend.onrender.com/Reject-Event", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(event)
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Event Rejected',
                text: result.message,
                timer: 3000,
                timerProgressBar: true,
                confirmButtonColor: '#3085d6'
            });

            getData();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Rejection Failed',
                text: result.message || 'Something went wrong',
                confirmButtonColor: '#d33'
            });
        }
    } catch (err) {
        console.log(err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Could not reject the event, please try again later.',
            confirmButtonColor: '#d33'
        });
    }
}
