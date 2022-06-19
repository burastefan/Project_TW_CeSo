const CivilianEvent = require('../Models/civilianEventModel')
const Event = require('../Models/eventModel')
const { jsonType } = require('../Utils/headerTypes')

async function getCivilianEvents(req, res) {
    try {
        const events = await CivilianEvent.findAll();

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

            console.log("Civilian Events: ", eventsParsed);

            res.writeHead(200, jsonType);
            res.end(JSON.stringify(eventsParsed));
        }
    }
    catch (error) {
        console.log('Error: ', error);

        res.writeHead(404, jsonType);
        res.end(JSON.stringify({ message: 'No civilian events found' }));
    }
}

async function transferCivilianEvent(event, req, res) {
    try {
        event.date = new Date(event.date);


        console.log('Event: ', event)
        //Insert Civilian Event to Events Table
        await Event.insert(event);

        console.log("Event created succesfully");
        console.log("Event: ", event);

        //Delete Civilian Event from CivilianEvents Table
        await CivilianEvent.remove(event.id);

        console.log(`Civilian Event with id ${event.id} deleted`);

        res.writeHead(201, jsonType);
        res.end(JSON.stringify(event));
    }
    catch (error) {
        console.log('Error: ', error);

        res.writeHead(400, jsonType);
        res.end(JSON.stringify({ message: 'Error in creating event' }));
    }
}

async function deleteCivilianEvent(id, req, res) {
    try {
        const event = await CivilianEvent.findById(id);

        if (event) {
            await CivilianEvent.remove(id);

            console.log(`Civilian Event with id ${id} deleted`);

            res.writeHead(200, jsonType);
            res.end(JSON.stringify({ message: 'Civilian Event has been deleted' }));
        }
    }
    catch (error) {
        console.log('Error: ', error);

        res.writeHead(404, jsonType);
        res.end(JSON.stringify({ message: 'Civilian Event not found' }));
    }
}

module.exports = {
    getCivilianEvents,
    deleteCivilianEvent,
    transferCivilianEvent
}