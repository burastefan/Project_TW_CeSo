async function onSubmitForm(e) {
  const form = e.target;

  // Prevent the default form submit
  e.preventDefault();

  const formData = new FormData(form);

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");

  email && localStorage.setItem("email", email);
    
  //TODO: verify password and confirmPassword to be the same

  const User = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
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
      alert("You have been successfully registered!");
      location.href='../Register-Validate/registerValidate.html';
    } else if (response.status == 409) {
      alert("This email address is already being used!");
    } else {
      alert("User register with unsucces!!!");
    }
  } catch (error) {
    console.log(error);
  }
}
