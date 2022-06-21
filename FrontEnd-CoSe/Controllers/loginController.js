async function onSubmitFormLogin(e) {
  const form = e.target;

  // Prevent the default form submit
  e.preventDefault();

  const formData = new FormData(form);

  const email = formData.get("email");
  const password = formData.get("password");

  const UserLogin = {
    email: email,
    password: password,
  };


  await loginUser(UserLogin);
}

async function loginUser(userLogin) {
  try {
    const response = await fetch(
      "http://localhost:5000/api/authentication/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userLogin),
      }
    );
    console.log(response);
    const responseData = await response.json();

    if (response.status == 202) {
      const token = responseData.token;
      localStorage.setItem("jwt", token);
      localStorage.setItem("email", userLogin.email);
      location.href = "../Home/home.html";
    } else if (response.status == 401) {
      console.log(responseData);
      snackbar(document, responseData.message);
    } else {
      snackbar(document, "Error! Could not login!");
    }
  } catch (error) {
    console.log(error);
  }
}
