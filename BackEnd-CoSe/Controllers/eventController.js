const Event = require('../Models/eventModel')
const { jsonType } = require('../Utils/headerTypes')

async function getEvents(req, res) {
    try {
        const events = await Event.findAll();

        if (events) {
            let eventsParsed = JSON.parse(events);

            eventsParsed = eventsParsed.map(event => { 
                const utcDate = new Date(event.date); // Get the UTC date from server
                const eventDate = new Date(utcDate.getTime() - new Date().getTimezoneOffset() * 60000); // Convert it to local date

                return {
                ...event,
                dateOfOccurence: eventDate.toLocaleDateString('en-UK'),
                timeOfOccurence: eventDate.toLocaleTimeString('en-UK')
                }
            })

            console.log("Events: ", eventsParsed);

            res.writeHead(200, jsonType);
            res.end(JSON.stringify(eventsParsed));
        }
    }
    catch (error) {
        console.log('Error: ', error);

        res.writeHead(404, jsonType);
        res.end(JSON.stringify({ message: 'No events found' }));
    }
}

async function getEvent(id, req, res) {
    try {
        const event = await Event.findById(id);
        
        if (event) {
            let eventParsed = JSON.parse(event)[0];

            const utcDate = new Date(eventParsed.date); // Get the UTC date from server
            const eventDate = new Date(utcDate.getTime() - new Date().getTimezoneOffset() * 60000); // Convert it to local date

            eventParsed.dateOfOccurence = eventDate.toLocaleDateString('en-UK');
            eventParsed.timeOfOccurence = eventDate.toLocaleTimeString('en-UK');
            
            console.log("Event with id " + id + ": ", eventParsed);

            res.writeHead(200, jsonType);
            res.end(JSON.stringify(eventParsed));
        }
    }
    catch (error) {
        console.log('Error: ', error);

        res.writeHead(404, jsonType);
        res.end(JSON.stringify({ message: 'Event not found' }));
    }
}

async function insertEvent(event, req, res) {
    try {
        event.date = new Date(event.date);

        await Event.insert(event);

        console.log("Event created succesfully");
        console.log("Event: ", event);

        res.writeHead(201, jsonType);
        res.end(JSON.stringify(event));
    }
    catch (error) {
        console.log('Error: ', error);

        res.writeHead(400, jsonType);
        res.end(JSON.stringify({ message: 'Error in creating event' }));
    }
}

async function deleteEvent(id, req, res) {
    try {
        const event = await Event.findById(id);

        if (event) {
            await Event.remove(id);

            console.log(`Event with id ${id} deleted`);

            res.writeHead(200, jsonType);
            res.end(JSON.stringify({ message: 'Event has been deleted' }));
        }
    }
    catch (error) {
        console.log('Error: ', error);

        res.writeHead(404, jsonType);
        res.end(JSON.stringify({ message: 'Event not found' }));
    }
}

async function updateEvent(updatedEvent, req, res) {
    try {
        const event = await Event.findById(updatedEvent.id);

        if (event) {
            updatedEvent.date = new Date(updatedEvent.date);
            
            await Event.update(updatedEvent);

            console.log(`Event with id ${updatedEvent.id} updated`);

            res.writeHead(200, jsonType);
            res.end(JSON.stringify({ message: 'Event has been updated' }));
        }
    }
    catch (error) {
        console.log('Error: ', error);

        res.writeHead(404, jsonType);
        res.end(JSON.stringify({ message: 'Event not found' }));
    }
}

module.exports = {
    getEvents,
    getEvent,
    insertEvent,
    deleteEvent,
    updateEvent
}