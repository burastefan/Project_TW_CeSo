const { getEvents, getEvent, insertEvent, deleteEvent, updateEvent } = require('../Controllers/eventController')
const { getCivilianEvents, insertCivilianEvent, transferCivilianEvent, deleteCivilianEvent } = require('../Controllers/civilianEventController')
const { validateToken, getToken } = require('../Utils/jwtUtils')
const { noType } = require('../Utils/headerTypes')

function handleEvents(req, res) {
    if (req.url === '/api/events' && req.method === 'GET') { // Get All Events
        //No token for get events
        getEvents(req, res);
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'GET') { // Get Event by id
        //Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                const id = req.url.split('/')[3];

                getEvent(id, req, res);
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    }
    else if (req.url === '/api/events' && req.method === 'POST') { // Insert Event
        //Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                let body = '';
                req.on('data', function (data) {
                    body += data;
                })
                req.on('end', function () {
                    const event = JSON.parse(body);
                    console.log("Event to be inserted: ", event);

                    insertEvent(event, req, res);
                })
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'DELETE') { // Delete Event
        //Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                const id = req.url.split('/')[3];

                deleteEvent(id, req, res);
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'PUT') { // Update Event
        //Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                const id = req.url.split('/')[3];

                let body = '';
                req.on('data', function (data) {
                    body += data;
                })
                req.on('end', function () {
                    const event = JSON.parse(body);
                    event.id = id;
                    console.log("Event to be inserted: ", event);

                    updateEvent(event, req, res);
                })
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    }
    else if (req.url === '/api/events/civilian' && req.method === 'GET') { // Get All Civilian Events
        //Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                getCivilianEvents(req, res);
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    }
    else if (req.url === '/api/events/civilian' && req.method === 'POST') { // Insert Civilian Event
        //Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                let body = '';
                req.on('data', function (data) {
                    body += data;
                })
                req.on('end', function () {
                    const event = JSON.parse(body);
                    console.log("Civilian Event to be inserted: ", event);

                    insertCivilianEvent(event, req, res);
                })
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    }
    else if (req.url === '/api/events/civilian/accept' && req.method === 'POST') { // Civilian Event was accepted by authority and must be added to Events Table
        //Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                let body = '';
                req.on('data', function (data) {
                    body += data;
                })
                req.on('end', function () {
                    const event = JSON.parse(body);
                    console.log("Civilian Event to be transferred: ", event);

                    transferCivilianEvent(event, req, res);
                })
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    }
    else if (req.url.match(/\/api\/events\/civilian\/([0-9]+)/) && req.method === 'DELETE') { // Delete Civilian Event
        //Verify token existence and validity
        const token = getToken(req, res);
        console.log("Token: ", token)
        if (token) {
            const valid = validateToken(token, res);
            console.log("Valid token: ", valid);
            if (valid != null) {
                const id = req.url.split('/')[4];

                deleteCivilianEvent(id, req, res);
            } else {
                res.writeHead(401, noType);
                res.end();
            }
        }
        else {
            res.writeHead(401, noType);
            res.end();
        }
    }
    else if (req.method === 'OPTIONS') {
        //Browser checks if API is valid for POST/PUT/DELETE operations
        res.writeHead(200, noType);
        res.end();
    }
    else {
        //Unknown request
        res.writeHead(404, noType);
        res.end();
    }
}

module.exports = {
    handleEvents
}