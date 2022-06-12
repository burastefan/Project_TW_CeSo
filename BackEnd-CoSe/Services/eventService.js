const { getEvents, getEvent } = require('../Controllers/eventController')

function handleEvents(req, res) {
    if (req.url === '/api/events' && req.method === 'GET') { // Get All Event
        getEvents(req, res)
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'GET') { // Get Event by id
        const id = req.url.split('/')[3]
        getEvent(id, req, res)
    }
    else if (req.url.match('/api/events') && req.method === 'POST') { // Insert Event
        var body = ''

        req.on('data', function (data) {
            body += data
        });

        req.on('end', function () {
            console.log(body)
            
            var event = JSON.parse(body)

            console.log("Event: ", event)
        });
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'PUT') { // Update Event
        //UPDATE EVENT
    }
    else if (req.url.match(/\/api\/events\/([0-9]+)/) && req.method === 'DELETE') { // Delete Event
        //DELETE EVENT
    }
}

module.exports = {
    handleEvents
}