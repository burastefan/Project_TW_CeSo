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

    const responseData = await response.json();
    const token = responseData.token;

    if (response.status == 202) {
      localStorage.setItem("jwt", token);
      snackbar(document, "Login with success!!!");
      location.href = "../Home/home.html";
    } else {
      snackbar(document, "Login with unsuccess!!!");
    }
  } catch (error) {
    console.log(error);
  }
}
