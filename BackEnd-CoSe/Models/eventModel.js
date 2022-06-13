const dbContext = require('../Utils/dbContext')
const { Request } = require("tedious")
const TYPES = require('tedious').TYPES;

//axios.get('http://localhost:5000/eventApi/events')

function findAll() {
    return new Promise((resolve, reject) => {
        const connection = dbContext.connect()

        connection.on("connect", err => {
            if (err) {
                console.error(err.message)
            } else {
                const request = new Request(
                    `SELECT * FROM Events ORDER BY date DESC FOR JSON PATH`,
                    (err, rowCount) => {
                        if (err) {
                            console.error(err.message)
                        }
                    }
                );

                request.on("row", rows => {
                    rows.forEach(row => {
                        response = row.value
                        resolve(response)
                    });
                });

                connection.execSql(request)
            }
        })
        connection.connect()
    })  
}

function findById(id) {
    return new Promise((resolve, reject) => {
        const connection = dbContext.connect()

        connection.on("connect", err => {
            if (err) {
                console.error(err.message)
            } else {
                const request = new Request(
                    `SELECT * FROM Events WHERE id = @eventId FOR JSON PATH`,
                    (err, rowCount) => {
                        if (err) {
                            console.error(err.message)
                        }
                    }
                );

                request.addParameter('eventID', TYPES.Int, id)

                request.on("row", rows => {
                    rows.forEach(row => {
                        response = row.value
                        resolve(response)
                    });
                });

                connection.execSql(request)
            }
        })
        connection.connect()
    })  
}

function insert(event) {
    return new Promise((resolve, reject) => {
        const connection = dbContext.connect()

        connection.on("connect", err => {
            if (err) {
                console.error(err.message)
            } else {
                const request = new Request(
                    `INSERT INTO Events (
                        name,
                        status,
                        location,
                        category,
                        code,
                        date,
                        description) 
                        VALUES(
                            @name,
                            @status,
                            @location,
                            @category,
                            @code,
                            @date,
                            @description
                        )`,
                    (err, rowCount) => {
                        if (err) {
                            console.error(err.message)
                        }
                    }
                );
                
                console.log("Time: ", event.date)

                request.addParameter('name', TYPES.VarChar, event.name)
                request.addParameter('status', TYPES.VarChar, event.status)
                request.addParameter('location', TYPES.VarChar, event.location)
                request.addParameter('category', TYPES.VarChar, event.category)
                request.addParameter('code', TYPES.VarChar, event.code)
                request.addParameter('date', TYPES.DateTime, event.date)
                request.addParameter('description', TYPES.VarChar, event.description)
                
                try {
                    connection.execSql(request)
                    resolve(event)
                }
                catch(error) {
                    console.log(error)
                }
            }
        })
        connection.connect()
    })  
}

module.exports = {
    findAll,
    findById,
    insert
}