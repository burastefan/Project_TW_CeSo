async function onSubmitForm(e) {
    const form = e.target

    // Prevent the default form submit
    e.preventDefault()

    const formData = new FormData(form)

    const email = formData.get('email');
    const password = formData.get('password');

    const User = {
        'email' : email,
        'password' : password
    }

    console.log('Aicii sunt', User);
    
    await forgotPasswordUser(User);
}

async function forgotPasswordUser(event) {
    try {
        const response = await fetch ('http://localhost:5000/api/authentication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        })
        console.log('Response', response);

        if(response.status == 201) {
            alert('Change password with succes!!!');
        }
        else {
            alert('Change password with unsucces!!!');
        }

    } catch (error) {
        console.log(error);
    }
}
