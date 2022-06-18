async function onSubmitFormChangePassword(e) {
    const form = e.target

    // Prevent the default form submit
    e.preventDefault()

    const formData = new FormData(form)

    const email = formData.get('email');
    const password = formData.get('password');
    const newPassword = formData.get('newPassword');

    const User = {
        'email' : email,
        'currentPassword' : password,
        'newPassword' : newPassword,
    }

    console.log('Aicii sunt', User);
    
    await changePasswordUser(User);
}

async function changePasswordUser(event) {
    try {
        const response = await fetch ('http://localhost:5000/api/authentication/changePassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        })
        console.log('Response', response);

        if(response.status == 200) {
            console.log('aicii uitema, sunt intraaat');
            // alert('Change password with succes!!!');
            snackbar(document, "Change password with succes!!!");
            setTimeout(function () {
              location.href = "../Login/login.html";
            }, 2500);
        }
        else {
            alert('Change password with unsucces!!!');
        }

    } catch (error) {
        console.log(error);
    }
}
