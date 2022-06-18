const {
  registerUser,
  loginUser,
  registerValidate,
  changePassword,
} = require("../Controllers/authenticationController");
const { noType } = require("../Utils/headerTypes");

function handleAuthentication(req, res) {
  if (req.url === "/api/authentication/register" && req.method === "POST") {
    console.log("Handle Authentication: Register");
    let body = "";

    req.on("data", function (data) {
      body += data;
    });

    req.on("end", function () {
      console.log(body);

      const user = JSON.parse(body);

      console.log("User to be inserted: ", user);

      registerUser(user, req, res);
    });
  } else if (req.url === "/api/authentication/validate" && req.method === "POST") {
    console.log("Handle Authentication: Register Validate");
    let body = "";

    req.on("data", function (data) {
      body += data;
    });

    req.on("end", function () {
      console.log(body);
      
      const userValidate = JSON.parse(body);

      console.log("User validater to be inserted: ", userValidate);

      registerValidate(userValidate, req, res);
    });
  } else if (req.url === "/api/authentication/login" && req.method === "POST") {
    console.log("Handle Authentication: Login");
    let body = "";

    req.on("data", function (data) {
      body += data;
    });

    req.on("end", function () {
      console.log(body);
      
      const userLogin = JSON.parse(body);

      console.log("User validater to be inserted: ", userLogin);

      loginUser(userLogin, req, res);
    });
  } else if (req.url === "/api/authentication/changePassword" && req.method === "PUT") {
    console.log("Handle Authentication: Change Password");
    let body = "";

    req.on("data", function (data) {
      body += data;
    });

    req.on("end", function () {
      console.log(body);

      const userUpdatePassword = JSON.parse(body);

      console.log("User to be inserted: ", userUpdatePassword);

      changePassword(userUpdatePassword, req, res);
    });
  } else if (req.method === "OPTIONS") {
    //Browser checks if API is valid for POST/PUT/DELETE operations
    res.writeHead(200, noType);
    res.end();
  }
}

module.exports = {
  handleAuthentication,
};
