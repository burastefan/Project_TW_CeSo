const { getEvents, getEvent, insertEvent, deleteEvent, updateEvent } = require('../Controllers/eventController')
const { getCivilianEvents, deleteCivilianEvent, transferCivilianEvent } = require('../Controllers/civilianEventController')
const { noType } = require('../Utils/headerTypes')

function handleEvents(req, res) {
    if (req.url === '/api/events' && req.method === 'GET') { // Get All Event
        getEvents(req, res);
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'GET') { // Get Event by id
        const id = req.url.split('/')[3];

        getEvent(id, req, res);
    }
    else if (req.url === '/api/events' && req.method === 'POST') { // Insert Event
        let body = '';

        req.on('data', function (data) {
            body += data;
        })

        req.on('end', function () {
            const event = JSON.parse(body);

            console.log("Event to be inserted: ", event);

            insertEvent(event, req, res);
        })
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'DELETE') { // Delete Event
        const id = req.url.split('/')[3];

        console.log('Id: ', id);

        deleteEvent(id, req, res);
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'PUT') { // Update Event
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
    }
    else if (req.url === '/api/events/civilian' && req.method === 'GET') { // Get All Civilian Events
        getCivilianEvents(req, res);
    }
    else if (req.url === '/api/events/civilian/accept' && req.method === 'POST') { // Civilian Event was accepted by authority and must be added to Events Table
        let body = '';

        req.on('data', function (data) {
            body += data;
        })

        req.on('end', function () {
            const event = JSON.parse(body);

            console.log("Event to be inserted: ", event);

            transferCivilianEvent(event, req, res);
        })
    }
    else if (req.url.match(/\/api\/events\/civilian\/([0-9]+)/) && req.method === 'DELETE') { // Delete Civilian Event
        const id = req.url.split('/')[4];

        console.log('Id: ', id);

        deleteCivilianEvent(id, req, res);
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