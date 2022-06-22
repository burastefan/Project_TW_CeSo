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
        const response = await fetch ('http://localhost:5001/api/authentication/changePassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        })
        console.log('Response', response);

        if(response.status == 200) {
            snackbar(document, "Password was changed successfully!");
            setTimeout(function () {
              location.href = "../Login/login.html";
            }, 2500);
        }
        else if (response.status == 401) {
            const responseData = await response.json();
            console.log(responseData);
            snackbar(document, responseData.message);
        } else {
            snackbar(document, "Error! Could not change password!");
        }

    } catch (error) {
        console.log(error);
    }
}

function onPasswordChange() {
    const password = document.querySelector('input[name=newPassword]');
    const confirm = document.querySelector('input[name=confirmPassword]');
    if (confirm.value === password.value) {
      password.setCustomValidity('');
      confirm.setCustomValidity('');
    } else {
      password.setCustomValidity('Passwords do not match');
      confirm.setCustomValidity('Passwords do not match');
    }
  }
