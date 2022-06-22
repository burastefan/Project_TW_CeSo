const http = require('http');
const { noType } = require("./Utils/headerTypes");
const { getInfosUser, getEmailsByLocation } = require("./Controllers/userController");
const { validateToken, getToken } = require('./Utils/jwtUtils');
const url = require("url");

const server = http.createServer((req, res) => {
    if (req.url.startsWith("/api/users?email") && req.method === "GET") {
        //Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                console.log("Handle Authentication: HOME - role");
                const queryObject = url.parse(req.url, true).query;
                const email = queryObject.email;
                getInfosUser(email, req, res);
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    } else if (req.url.startsWith("/api/users/email?location") && req.method === "GET") {
        console.log("Handle user emails by location");
        const queryObject = url.parse(req.url, true).query;
        const location = queryObject.location;
        console.log(location);
        getEmailsByLocation(location, req, res);
    } else if (req.method === "OPTIONS") {
        //Browser checks if API is valid for POST/PUT/DELETE operations
        res.writeHead(200, noType);
        res.end();
    } else {
        //Unknown request
        res.writeHead(404, noType);
        res.end();
    }
});

const PORT = process.env.PORT || 5002;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));