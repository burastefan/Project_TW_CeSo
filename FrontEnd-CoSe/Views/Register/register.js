async function onSubmitForm(e) {
    const form = e.target

    // Prevent the default form submit
    e.preventDefault()

    const formData = new FormData(form)

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');

    const User = {
        'firstName' : firstName,
        'lastName' : lastName,
        'email' : email,
        'password' : password
    }

    console.log('Aicii sunt', User);
    
    await registerUser(User);
}

async function registerUser(event) {
    try {
        const response = await fetch ('http://localhost:5000/api/authentication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        })
        console.log('Response', response);

        if (response.status == 201) {
            alert('You have been successfully registered!');
        } else if (response.status == 409) {
            alert('This email address is already being used!');
        }
        else {
            alert('User register with unsucces!!!');
        }

    } catch (error) {
        console.log(error);
    }
}
