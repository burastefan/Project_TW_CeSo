const Event= require('../Models/eventModel')
const jsonType = { "Access-Control-Allow-Methods": "GET,POST,DELETE", "Access-Control-Allow-Credentials": true, "Access-Control-Allow-Headers": "authorization,content-type", "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };


async function getEvents(req, res) {
    try {
        const events = await Event.findAll()

        let eventsParsed = JSON.parse(events)

        eventsParsed = eventsParsed.map(event => { 
            const eventDate = new Date(event.date)

            return {
            ...event,
            dateOfOccurence: eventDate.getFullYear() + "-" + (eventDate.getMonth()+1) + "-" + eventDate.getDate(),
            timeOfOccurence: eventDate.getHours() + ":" + eventDate.getMinutes() + ":" + eventDate.getSeconds()
            }
        })

        console.log("Events: ", eventsParsed)

        res.writeHead(200, jsonType)
        res.end(JSON.stringify(eventsParsed))
    }
    catch (error) {
        console.log(error)
    }
}

async function getEvent(id, req, res) {
    try {
        const event = await Event.findById(id)
        
        let eventParsed = JSON.parse(event)[0]
        const eventDate = new Date(eventParsed.date)
        eventParsed.dateOfOccurence = eventDate.getFullYear() + "-" + (eventDate.getMonth()+1) + "-" + eventDate.getDate(),
        eventParsed.timeOfOccurence = eventDate.getHours() + ":" + eventDate.getMinutes() + ":" + eventDate.getSeconds()
        
        console.log("Event with id " + id + ": ", eventParsed)

        res.writeHead(200, jsonType)
        res.end(JSON.stringify(eventParsed))
    }
    catch (error) {
        console.log(error)
    }
}

async function insertEvent(event, req, res) {
    try {
        event.date = new Date(event.date)

        await Event.insert(event)

        console.log("Event created succesfully")
        console.log("Event: ", event)

        res.writeHead(201, jsonType)
        res.end(JSON.stringify(event))
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    getEvents,
    getEvent,
    insertEvent
}