async function onSubmitForm(e) {
  const form = e.target;

  // Prevent the default form submit
  e.preventDefault();

  const formData = new FormData(form);

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");
  const location = document.getElementById("searchInput").value;

  email && localStorage.setItem("email", email);

  //TODO: verify password and confirmPassword to be the same

  const User = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    location: location
  };

  await registerUser(User);
}

async function registerUser(user) {
  try {
    const response = await fetch("http://localhost:5000/api/authentication/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    console.log("Response", response);

    if (response.status == 201) {
      snackbar(document, 'You have been successfully registered!');
      setTimeout(function () {
        location.href = '../Register-Validate/registerValidate.html';
      }, 2500);
    } else if (response.status == 409) {
      snackbar(document, 'This email address is already being used!');
    } else {
      snackbar(document, 'User register with unsucces!');
    }
  } catch (error) {
    console.log(error);
  }
}

function onPasswordChange() {
  const password = document.querySelector('input[name=password]');
  const confirm = document.querySelector('input[name=confirmPassword]');
  if (confirm.value === password.value) {
    password.setCustomValidity('');
    confirm.setCustomValidity('');
  } else {
    password.setCustomValidity('Passwords do not match');
    confirm.setCustomValidity('Passwords do not match');
  }
}
