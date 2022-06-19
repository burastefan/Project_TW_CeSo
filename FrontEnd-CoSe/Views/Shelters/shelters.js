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

  console.log("Shelter: ", shelter);

  await createShelter(shelter);
}

async function createShelter(event) {
  try {
    const response = await fetch("http://localhost:5000/api/shelters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    console.log("Response: ", response);

    const data = await response.json();
    console.log("Data: ", data);

    if (response.status == 201) {
      snackbar(document, "Shelter created with succes!!!");
    } else {
      //afisare mesaj eroare la creare
    }
  } catch (error) {
    console.log(error);
  }
}

function initializeAutocompleteField() {
    new google.maps.places.Autocomplete(document.getElementById('autocompleteLocation'));
}
