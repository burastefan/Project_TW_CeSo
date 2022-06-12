const events = require('../data/events')

function findAllEvents() {
    return new Promise((resolve, reject) => {
        resolve(events)
    })

    //axios.get('http://localhost:5000/eventApi/events')
}

function findEventById(id) {
    return new Promise((resolve, reject) => {
        const event = events.find(x => x.id == id)

        resolve(event)
    })

    //axios.get('http://localhost:5000/eventApi/events')
}

module.exports = {
    findAllEvents,
    findEventById
}