const http = require('http')
const { eventRoute, authenticationRoute, userRoute } = require('./Utils/routes')
const { handleEvents } = require('./Services/eventService')
const { handleAuthentication } = require('./Services/authenticationService')
const { handleUsers } = require('./Services/userService')
const { jsonType } = require('./Utils/headerTypes')

const server = http.createServer((req, res) => {
    if (req.url.startsWith(eventRoute)) {
        handleEvents(req, res);
    }
    else if (req.url.startsWith(authenticationRoute)) {
        handleAuthentication(req, res);
    }
    else if (req.url.startsWith(userRoute)) {
        handleUsers(req, res);
    }
    else {
        res.writeHead(404, jsonType)
        res.end(JSON.stringify({message: "Route not found"}));
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));