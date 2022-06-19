const path = require('path');
const publicKey = path.join(__dirname, ".", "public.key");
const fs = require("fs");
const jwt = require('jsonwebtoken');

function getToken(req, res) {
    try {
        const regex = new RegExp("Bearer (.*)");
        console.log("regex:", regex);
        console.log("Header authorization: ", req.headers["authorization"]);
        if (typeof req.headers["authorization"] === 'undefined' || req.headers["authorization"] == null) {
            return false;
        }
        const item = req.headers["authorization"].match(regex);
        console.log("item:", item);
        const token = item[1];

        return token;
    } catch (err) {
        console.log(err);
    }
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
        console.log("\nJWT verification result: " + JSON.stringify(valid));

        return valid;
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    getToken,
    validateToken
};