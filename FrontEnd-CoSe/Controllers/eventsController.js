async function onSubmitHandler(e) {
    const form = e.target

    // Prevent the default form submit
    e.preventDefault()

    const formData = new FormData(form)

    console.log(formData.entries())

    const title = formData.get('eventTitle')
    const description = formData.get('eventDescription')
    const date = new Date(formData.get('eventTime'))
    const location = formData.get('eventLocation')
    const category = formData.get('eventCategory')
    const code = formData.get('eventCode')
    const status = formData.get('eventStatus')

    const event = {
      'name': title,
      'status': status,
      'location': location,
      'category': category,
      'code': code,
      'date': date,
      'description': description
    }

    console.log('Event: ', event)

    await createEvent(event)
}

async function createEvent(event) {
    try {
        const response = await fetch('http://localhost:5000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.jwt
            },
            body: JSON.stringify(event),
        })
        console.log('Response: ', response)

        if (response.status == 201) {
            const data = await response.json()
            console.log('Data: ', data)
            //afisare mesaj creat cu succes
            snackbar(document, 'Event created successfully!');
        }
        else if (response.status == 404) {
            //afisare eroare creare
            snackbar(document, 'Error in creating event!');
        }
        else if (response.status == 401) {
            //afisare mesaj unauthorized
            snackbar(document, 'Unauthorized!');
        }
    } catch(error) {
        console.log(error)
    }
}
