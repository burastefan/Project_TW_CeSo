const { noType } = require("../Utils/headerTypes");
const { getInfosUser } = require("../Controllers/userController");
const url = require("url");

function handleUsers(req, res) {
    if (req.url.startsWith("/api/users?email") && req.method === "GET") {
        console.log("Handle Authentication: HOME - role");
        const queryObject = url.parse(req.url, true).query;
        const email = queryObject.email;
        getInfosUser(email, req, res);
    } else if (req.method === "OPTIONS") {
        //Browser checks if API is valid for POST/PUT/DELETE operations
        res.writeHead(200, noType);
        res.end();
    } else {
        //Unknown request
        res.writeHead(404, noType);
        res.end();
    }
}

module.exports = {
    handleUsers,
};
