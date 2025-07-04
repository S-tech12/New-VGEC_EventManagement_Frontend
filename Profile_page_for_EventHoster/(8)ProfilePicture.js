document.getElementById("UpdateImageButton").addEventListener("click", async function () {
    const imageInput = document.getElementById("UpdateImageBox");
    const file = imageInput.files[0];

    if (!file) {
        Swal.fire({
            icon: 'warning',
            title: 'No File Selected',
            text: 'Please select a profile image to upload.',
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid File Type',
            text: 'Only PNG, JPG, or JPEG images are allowed.',
            confirmButtonColor: '#dc3545'
        });
        return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
        const response = await fetch("http://localhost:3000/upload-profile-image", {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData,
        });

        const result = await response.json();
        if (result.success) {
            document.getElementById("userImage").src = result.imageUrl;
            document.getElementById("UpdateImageModalCloseButton").click();

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile image has been successfully updated.',
                confirmButtonColor: '#28a745'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: result.message || 'Something went wrong while uploading the image.',
                confirmButtonColor: '#dc3545'
            });
        }
    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Unable to upload image. Please try again later.',
            confirmButtonColor: '#dc3545'
        });
    }

});