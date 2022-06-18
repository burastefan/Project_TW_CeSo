const {
  registerUser,
  loginUser,
  forgotPasswordUser,
  registerValidate,
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
  } else if (req.url === "/api/authentication" && req.method === "POST") {
    console.log("Handle Authentication: Login");
    loginUser(req, res);
  } else if (req.url === "/api/authentication" && req.method === "POST") {
    console.log("Handle Authentication: Forgot Password");
    forgotPasswordUser(req, res);
  } else if (req.method === "OPTIONS") {
    //Browser checks if API is valid for POST/PUT/DELETE operations
    res.writeHead(200, noType);
    res.end();
  }
}

module.exports = {
  handleAuthentication,
};
