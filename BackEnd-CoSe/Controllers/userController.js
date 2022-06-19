const infoUser = require("../Models/userModel");
const { jsonType } = require("../Utils/headerTypes");
const path = require('path');
const publicKey = path.join(__dirname, "..", "Utils", "public.key");
const fs = require("fs");


function getToken(req, res) {
  try {
    const regex = new RegExp("Bearer (.*)");
    console.log("regex:", regex);
    const item = req.headers["authorization"].match(regex);
    console.log("item:", item);
    const token = item[1];
  } catch (err) {
    console.log(err);
  }
  return token;
}

function validateToken(token, response) {

    const publicKEY = fs.readFileSync(publicKey, 'utf8');
    const i = 'UPNP';  // Issuer 
    const s = 'some@user.com'; // Subject 
    const a = 'http://localhost:5000'; // Audience
    const verifyOptions = {
        issuer: i,
        subject: s,
        audience: a,
        expiresIn: "12h",
        algorithm: "RS256",
    };
    
    try {
        const valid = jwt.verify(token, publicKEY, verifyOptions);
    }
    catch (err) {

        console.log(err);
    }
    console.log("\nJWT verification result: " + JSON.stringify(valid));

    return valid;

}

async function getInfosUser(email, req, res) {
  try {
    const info = await infoUser.getInfo(email);

    res.writeHead(200, jsonType);
    res.end(info);
  } catch (error) {
    console.log("Error: ", error);
    res.writeHead(400, jsonType);
    res.end(
      JSON.stringify({ message: "Error in Registration Validater pass!" })
    );
  }
}

module.exports = {
  getInfosUser,
  getToken,
  validateToken
};
