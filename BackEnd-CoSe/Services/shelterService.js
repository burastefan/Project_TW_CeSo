const { getEvents } = require('../Controllers/eventController')
const { noType } = require('../Utils/headerTypes')

function handleShelters(req, res) {
    console.log("Handle Shelters: Shelter Page");
    if (req.url === '/api/shelters' && req.method === 'POST') {
        let body = '';

        req.on('data', function (data) {
            body += data;
        })

        req.on('end', function () {
            const event = JSON.parse(body);

            console.log("Event to be inserted: ", event);

            //function 
        })
        
    } else if (req.method === 'OPTIONS') {
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
    handleShelters
}