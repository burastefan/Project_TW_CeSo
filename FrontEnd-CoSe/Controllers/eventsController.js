async function onInitialized() {
    //Get User Info (Role, Name, etc.)
    const userData = await getUserByEmail();

    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("eventsComponent").style.display = "block";
    
    //Initialize NavBar
    initializeNavbar(userData);

    document.addEventListener('submit', (event) => onSubmitHandler(event, userData));

    initializeAutocompleteField();
}

async function onSubmitHandler(e, userData) {
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


    if (userData.roles == 'AUTHORITY') {
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
    } else if (userData.roles == 'CIVILIAN') {
        const event = {
        'name': title,
        'status': status,
        'location': location,
        'category': category,
        'code': code,
        'date': date,
        'description': description,
        'userEmail': localStorage.email
        }
    
        console.log('Event: ', event)

        await createCivilianEvent(event)
    }
}

async function createEvent(event) {
    try {
        const response = await fetch('http://localhost:5003/api/events', {
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

async function createCivilianEvent(event) {
    try {
        const response = await fetch('http://localhost:5003/api/events/civilian', {
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
            snackbar(document, 'Civilian Event created successfully!');
        }
        else if (response.status == 404) {
            //afisare eroare creare
            snackbar(document, 'Error in creating civilian event!');
        }
        else if (response.status == 401) {
            //afisare mesaj unauthorized
            snackbar(document, 'Unauthorized!');
        }
    } catch(error) {
        console.log(error)
    }
}

function initializeAutocompleteField() {
    new google.maps.places.Autocomplete(document.getElementById('autocompleteLocation'));
}