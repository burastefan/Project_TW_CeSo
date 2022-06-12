const Event= require('../Models/eventModel')
const jsonType = { "Access-Control-Allow-Methods": "GET,POST,DELETE", "Access-Control-Allow-Credentials": true, "Access-Control-Allow-Headers": "authorization,content-type", "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };


async function getEvents(req, res) {
    try {
        const events = await Event.findAllEvents()
        console.log("Events: ", events)

        res.writeHead(200, jsonType)
        res.end(JSON.stringify(events))
    }
    catch (error) {
        console.log(error)
    }
}

async function getEvent(id, req, res) {
    try {
        const event = await Event.findEventById(id)
        console.log("Event with id " + id + ": ", event)

        res.writeHead(200, jsonType)
        res.end(JSON.stringify(event))
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    getEvents,
    getEvent
}