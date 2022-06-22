async function onSubmitFormValidate(e) {
  const form = e.target;

  // Prevent the default form submit
  e.preventDefault();

  const formData = new FormData(form);

  const code = formData.get("codeVerification");
  const email = localStorage.getItem("email");

  const UserValidate = {
    code: code,
    email: email,
  };

  await registerValidate(UserValidate);
}

async function registerValidate(userValidate) {
  try {
    const response = await fetch(
      "http://localhost:5001/api/authentication/validate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userValidate),
      }
    );
    console.log("Response", response);

    if (response.status == 201) {
      snackbar(document, "Your account was activated with succes!");
      setTimeout(function () {
        location.href = "../Login/login.html";
      }, 2500);
    } else {
      snackbar(document, "User register validate with unsucces!");
    }
  } catch (error) {
    console.log(error);
  }
}
