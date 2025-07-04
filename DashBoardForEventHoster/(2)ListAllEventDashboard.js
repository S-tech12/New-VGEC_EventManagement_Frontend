document.addEventListener("DOMContentLoaded", () => {
    const alreadyShown = localStorage.getItem("instructionModalShownForEventHoster");

    if (!alreadyShown) {
        const instructionModal = new bootstrap.Modal(document.getElementById('instructionModal'));
        instructionModal.show();

        document.getElementById('acknowledgeInstructions').addEventListener('click', () => {
            localStorage.setItem("instructionModalShownForEventHoster", "true");
            instructionModal.hide();
        });
    }

    FillTable()
});

async function FillTable() {
    const EventTableBody = document.querySelector("#EventTable tbody");
    const NoOfEvent = document.getElementById("NoOfEvent");
    // we have to access the tbody not the whole table



    try {
        const response = await fetch("http://localhost:3000/getEventData", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const eventData = await response.json();

        if (response.ok) {
            const events = eventData.result;

            // Clear any existing table rows
            EventTableBody.innerHTML = "";

            if (events.length === 0) {
                EventTableBody.innerHTML = "<tr><td colspan='5'>No events found.</td></tr>";
                NoOfEvent.innerHTML = `You have not hosted any event yet if you want to host the event than here is the button to host the new event!!`;
                return;
            }

            NoOfEvent.innerHTML = `You have hosted <strong>${events.length}</strong> events. Below is the list of events you have hosted.`;

            events.forEach((event, index) => {
                // Color class based on status
                let statusClass = "";
                if (event.Event_Status === "Pending") {
                    statusClass = "text-warning";
                } else if (event.Event_Status === "Approved") {
                    statusClass = "text-success";
                } else if (event.Event_Status === "Rejected") {
                    statusClass = "text-danger";
                }
                
                // Color class based on status
                let statusClassForCompletion = "";
                if (event.Event_completion_status === "Upcoming") {
                    statusClassForCompletion = "text-warning";
                } else if (event.Event_completion_status === "Completed") {
                    statusClassForCompletion = "text-success";
                }


                const row = document.createElement("tr");

                row.innerHTML = `
                        <th scope="row">${index + 1}</th>
                        <td>${event.Event_name}</td>
                        <td>${event.Event_type}</td>
                        <td>${new Date(event.Event_date).toISOString().split('T')[0]}</td>
                        <td>
                            <span class="${statusClass}">
                                <b><i class="bi bi-circle-fill"></i> ${event.Event_Status}</b>
                            </span>
                        </td>
                        <td>
                            <span class="${statusClassForCompletion}">
                                <b><i class="bi bi-patch-check-fill"></i> ${event.Event_completion_status}</b>
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-outline-danger" onclick = 'DeleteEvent(${JSON.stringify(event)})'>
                                <i class="bi bi-trash-fill"></i> Delete
                            </button>
                        </td>
                    `;

                EventTableBody.appendChild(row);
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Condition',
                text: eventData.message,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
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




async function DeleteEvent(event) {
    console.log(event._id);
    if (event.Event_Status === "Approved") {
        Swal.fire({
            icon: 'error',
            title: 'Cannot Delete Event',
            html: `The event <strong>"${event.Event_name}"</strong> has already been approved and cannot be deleted.`,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    const confirmation = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete your event "${event.Event_name}"? This action is permanent and cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    if (!confirmation.isConfirmed) {
        return; // User canceled
    }
    try {
        const response = await fetch("http://localhost:3000/Delete-Event", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ EventId: event._id })
        })

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Event Deleted',
                text: result.message, // assuming result.message contains the success message
                timer: 3000,
                timerProgressBar: true,
                confirmButtonColor: '#3085d6'
            }).then(() => {
                location.reload();
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: result.message || 'The event could not be deleted. Please try again later.',
                confirmButtonColor: '#d33'
            });
        }
    } catch (err) {
        console.log(err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Could not delete the event, please try again later.',
            confirmButtonColor: '#d33'
        });
    }
}