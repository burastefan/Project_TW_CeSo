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
    
    await loginUser(User);
}

async function loginUser(event) {
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
            alert('Login succes!!!');
        }
        else {
            alert('Login unsucces!!!');
        }

    } catch (error) {
        console.log(error);
    }
}
