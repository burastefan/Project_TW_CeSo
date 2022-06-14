const { getEvents, getEvent, insertEvent, deleteEvent } = require('../Controllers/eventController')
const { noType } = require('../Utils/headerTypes')

function handleEvents(req, res) {
    if (req.url === '/api/events' && req.method === 'GET') { // Get All Events
        getEvents(req, res)
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'GET') { // Get Event by id
        const id = req.url.split('/')[3]

        getEvent(id, req, res)
    }
    else if (req.url.match('/api/events') && req.method === 'POST') { // Insert Event
        let body = ''

        req.on('data', function (data) {
            body += data
        })

        req.on('end', function () {
            console.log(body)
            
            const event = JSON.parse(body)

            console.log("Event to be inserted: ", event)

            insertEvent(event, req, res)
        })
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'DELETE') { // Delete Event
        const id = req.url.split('/')[3]

        console.log('Id: ', id)

        deleteEvent(id, req, res)
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'PUT') { // Update Event
        //UPDATE EVENT
    }
    else if (req.method === 'OPTIONS') {
        //Browser checks if API is valid for POST/PUT/DELETE operations
        res.writeHead(200, noType)
        res.end()
    }
}

module.exports = {
    handleEvents
}