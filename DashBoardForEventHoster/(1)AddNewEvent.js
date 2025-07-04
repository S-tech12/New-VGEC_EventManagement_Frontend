const token = sessionStorage.getItem("authToken");


const NewEventRequestButton = document.getElementById("NewEventRequestButton");
NewEventRequestButton.addEventListener("click", AddEvent);

async function AddEvent(e) {
    e.preventDefault();

    const Event_name = document.getElementById("eventName").value.trim();
    const Event_hoster_emailid = document.getElementById("organizerEmail").value.trim();
    const Event_hoster_enrollementNo = document.getElementById("enrollment").value.trim();
    const Event_hoster_ContactNo = document.getElementById("contactNumber").value.trim();
    const Event_hoster_branch = document.getElementById("branch").value.trim();
    const Event_type = document.getElementById("eventType").value.trim();
    const Event_payment = document.getElementById("eventFees").value.trim();
    const Event_description = document.getElementById("eventDescription").value.trim(); // not in schema, but you can add it if needed
    const Event_date = document.getElementById("eventDate").value;
    const from_time = document.getElementById("startTime").value;
    const to_time = document.getElementById("endTime").value;
    const Event_location = document.getElementById("location").value.trim();
    const Reuired_permission_HOD_emailid = document.getElementById("hodEmail").value.trim();


    const eventPosterInput = document.getElementById("eventPoster");
    const posterFile = eventPosterInput.files[0]; // poster image

    if (
        !Event_name ||
        !Event_hoster_emailid ||
        !Event_hoster_enrollementNo ||
        !Event_hoster_ContactNo ||
        !Event_hoster_branch ||
        Event_type === "#" ||
        Event_payment === "#" ||
        !Event_description ||
        !Event_date ||
        Event_location === "#" ||
        Reuired_permission_HOD_emailid === "#"
    ) {
        Swal.fire({
            icon: 'question',
            title: 'Missing Fields',
            text: 'Please fill in every field!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    const Event_feesPerPerson = document.getElementById("feesPerPerson").value.trim();
    if(Event_payment === "Paid" && (isNaN(Event_feesPerPerson) || Number(Event_feesPerPerson) <= 1))
    {
        Swal.fire({
            icon: 'Error',
            title: 'Invalid Fees Per Prson',
            text: 'Please fill Correct Amount of Fees per person!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });    
        return;
    }

    let PosterPath = ""; // define before the try block

    if (!eventPosterInput.files[0]) {
        const result = await Swal.fire({
            title: "No Poster Added",
            text: "We'll use a default poster based on the event type. Do you want to continue?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, continue",
            cancelButtonText: "No, go back"
        });

        if (!result.isConfirmed) {
            console.log("User canceled.");
            return; // Now this will properly exit the AddEvent function
        } else {
            console.log("User chose to continue.");
        }
    }

    if (!from_time || !to_time) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Time',
            text: 'Please select both From Time and To Time.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (Event_hoster_ContactNo.length != 10) {
        Swal.fire({
            icon: 'error',
            title: 'Incorrect Data',
            text: 'Enter the Correct Contact number!!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (Event_description.length <= 20) {
        Swal.fire({
            icon: 'info',
            title: 'Insufficient Data',
            text: 'Please enter the sufficient Description!!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    const Currentdate = new Date();
    const EventDateObj = new Date(Event_date);

    if (Currentdate >= EventDateObj) {
        Swal.fire({
            icon: 'error',
            title: 'Incorrect Data',
            text: 'PLEASE ENTER THE VALID DATE!!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    let timeDiff = EventDateObj - Currentdate;
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
    if (dayDiff <= 15) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning ',
            text: 'YOU CAN ONLY REQUEST FOR THE EVENT BEFORE THE 15 DAYS!!!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    // from this the time's validation has been strated
    // Convert time strings (e.g., "07:30") to Date objects
    const [startHour, startMin] = from_time.split(":").map(Number);
    const [endHour, endMin] = to_time.split(":").map(Number);

    const today = new Date();
    const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMin);
    const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMin);

    const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0);  // 07:00
    const dayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0);  // 20:00

    // [1] Check if endTime is after startTime
    if (endTime <= startTime) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Time Range',
            text: 'To Time must be after From Time!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    // [2] Check if both times are between 07:00 and 20:00
    if (startTime < dayStart || endTime > dayEnd) {
        Swal.fire({
            icon: 'warning',
            title: 'Time Out of Range',
            text: 'Event timing must be between 7:00 AM and 8:00 PM.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    // [3] Check if duration is at least 1 hour
    const diffMinutes = (endTime - startTime) / (1000 * 60);
    if (diffMinutes < 60) {
        Swal.fire({
            icon: 'info',
            title: 'Too Short',
            text: 'The event must be at least 1 hour long!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    const formData = new FormData();
    formData.append("Event_name", Event_name);
    formData.append("Event_hoster_emailid", Event_hoster_emailid);
    formData.append("Event_hoster_enrollementNo", Event_hoster_enrollementNo);
    formData.append("Event_hoster_ContactNo", Event_hoster_ContactNo);
    formData.append("Event_hoster_branch", Event_hoster_branch);
    formData.append("Event_type", Event_type);
    formData.append("Event_payment", Event_payment);
    if(Event_payment === "Paid"){
        formData.append("Event_feesPerPerson", Event_feesPerPerson);
    }
    formData.append("Event_description", Event_description);
    formData.append("Event_date", Event_date);
    formData.append("from_time", from_time);
    formData.append("to_time", to_time);
    formData.append("Event_location", Event_location);
    formData.append("Reuired_permission_HOD_emailid", Reuired_permission_HOD_emailid);


    if (posterFile) {
        formData.append("eventPoster", posterFile); // append only if user added image
    }


    try {
        const response = await fetch("http://localhost:3000/AddEvent", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Condition',
                text: result.message,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return;
        } else {
            // this will remove the modal when the event has been successfully added!!
            const HostNewEventCloseButton = document.getElementById("HostNewEventCloseButton");
            HostNewEventCloseButton.click();

            Swal.fire({
                title: "Success",
                text: `New event has been requested to ${Reuired_permission_HOD_emailid}`,
                timer: 4000,
                icon: "success",
                showConfirmButton: false,
                timerProgressBar: true
            }).then(() => {
                // Show the pending approval risk alert after success alert ends
                Swal.fire({
                    icon: 'warning',
                    title: 'Pending Approval Risk',
                    html: `Please note:<br><strong>Your event will be automatically rejected if it is not approved by the HOD before <span style="color:red;"> 5 days </span>.</strong> of your event date`,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Understood'
                }).then(() => {
                    // Finally reload the page after the second alert is acknowledged
                    location.reload();
                })
            })

        }
    } catch (err) {
        console.error("Error:", err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Server is not working , Please try again later',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    }
}
