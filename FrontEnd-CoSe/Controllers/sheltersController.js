async function onInitialized() {
  //Get User Info (Role, Name, etc.)
  const userData = await getUserByEmail();

  document.getElementById("loadingScreen").style.display = "none";
  document.getElementById("sheltersComponent").style.display = "block";
  
  //Initialize NavBar
  initializeNavbar(userData);

  document.addEventListener('submit', (event) => onSubmitHandlerShelters(event));

  initializeAutocompleteField();
}

async function onSubmitHandlerShelters(e) {
  const form = e.target;

  // Prevent the default form submit
  e.preventDefault();

  const formData = new FormData(form);

  console.log(formData.entries());

  const title = formData.get("shelterTitle");
  const description = formData.get("shelterDescription");
  const location = formData.get("shelterLocation");
  const capacity = formData.get("shelterCapacity");
  const category = formData.get("shelterCategory");

  const shelter = {
    name: title,
    description: description,
    location: location,
    capacity: capacity,
    category: category,
  };

  console.log("Response: ", shelter);

  await createShelter(shelter);
}

async function createShelter(shelter) {
  try {
    const response = await fetch("http://localhost:5004/api/shelters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + localStorage.jwt
      },
      body: JSON.stringify(shelter),
    });

    console.log("Response: ", response);

    if (response.status == 201) {
      const data = await response.json();
      console.log('Data: ', data)
      //afisare mesaj creat cu succes
      snackbar(document, 'Shelter created successfully!');
    }
    else if (response.status == 404) {
      //afisare eroare creare
      snackbar(document, 'Error in creating shelter!');
    }
    else if (response.status == 401) {
      //afisare mesaj unauthorized
      snackbar(document, 'Unauthorized!');
    }
  } catch (error) {
    console.log(error);
  }
}

function initializeAutocompleteField() {
  new google.maps.places.Autocomplete(document.getElementById('autocompleteLocation'));
}
