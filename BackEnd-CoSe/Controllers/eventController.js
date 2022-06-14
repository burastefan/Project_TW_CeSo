const Event= require('../Models/eventModel')
const { jsonType } = require('../Utils/headerTypes')

async function getEvents(req, res) {
    try {
        const events = await Event.findAll()

        console.log(events)

        if (events) {
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
    }
    catch (error) {
        console.log('Error: ', error)

        res.writeHead(404, jsonType)
        res.end(JSON.stringify({ message: 'No events found' }))
    }
}

async function getEvent(id, req, res) {
    try {
        const event = await Event.findById(id)
        
        if (event) {
            let eventParsed = JSON.parse(event)[0]
            const eventDate = new Date(eventParsed.date)
            eventParsed.dateOfOccurence = eventDate.getFullYear() + "-" + (eventDate.getMonth()+1) + "-" + eventDate.getDate(),
            eventParsed.timeOfOccurence = eventDate.getHours() + ":" + eventDate.getMinutes() + ":" + eventDate.getSeconds()
            
            console.log("Event with id " + id + ": ", eventParsed)

            res.writeHead(200, jsonType)
            res.end(JSON.stringify(eventParsed))
        }
    }
    catch (error) {
        console.log('Error: ', error)

        res.writeHead(404, jsonType)
        res.end(JSON.stringify({ message: 'Event not found' }))
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
        console.log('Error: ', error)

        res.writeHead(400, jsonType)
        res.end(JSON.stringify({ message: 'Error in creating event' }))
    }
}

async function deleteEvent(id, req, res) {
    try {
        const event = await Event.findById(id)

        if (event) {
            console.log(`Deleting event with id ${id}`)

            await Event.remove(id)
            res.writeHead(200, jsonType)
            res.end(JSON.stringify({ message: 'Event has been deleted' }))
        }
    }
    catch (error) {
        console.log('Error: ', error)

        res.writeHead(404, jsonType)
        res.end(JSON.stringify({ message: 'Event not found' }))
    }
}

module.exports = {
    getEvents,
    getEvent,
    insertEvent,
    deleteEvent
}