const dbContext = require('../Utils/dbContext')
const { Request } = require("tedious")
const TYPES = require('tedious').TYPES

function findAll() {
    return new Promise((resolve, reject) => {
        const connection = dbContext.connect();

        connection.on("connect", err => {
            if (err) {
                reject(err.message);
            } else {
                const request = new Request(
                    `SELECT * FROM CivilianEvents ORDER BY date DESC FOR JSON PATH`,
                    (err, rowCount) => {
                        if (err) {
                            reject(err.message);
                        }
                        if (rowCount == 0) {
                            reject(`No civilian events were found`);
                        }
                    }
                );
                
                var response = "";

                request.on("row", (rows) => {
                    rows.forEach(row => {
                        response += row.value;
                    })
                })

                request.on('doneProc', (rowCount, more, rows) => { 
                    resolve(response);
                })

                connection.execSql(request);
            }
        })
        connection.connect();
    })  
}

function findById(id) {
    return new Promise((resolve, reject) => {
        const connection = dbContext.connect();

        connection.on("connect", err => {
            if (err) {
                reject(err.message);
            } else {
                const request = new Request(
                    `SELECT * FROM CivilianEvents WHERE id = @eventId FOR JSON PATH`,
                    (err, rowCount) => {
                        if (err) {
                            reject(err.message);
                        }
                        if (rowCount == 0) {
                            reject(`No civilian event with id ${id} was found`);
                        }
                    }
                );

                request.addParameter('eventID', TYPES.Int, id);
                
                request.on("row", rows => {
                    rows.forEach(row => {
                        const response = row.value;
                        resolve(response);
                    });
                });

                connection.execSql(request);
            }
        })
        connection.connect();
    })  
}

function insert(event) {
    return new Promise((resolve, reject) => {
        const connection = dbContext.connect();

        connection.on("connect", err => {
            if (err) {
                reject(err.message);
            } else {
                const request = new Request(
                    `INSERT INTO CivilianEvents (
                        userId,
                        userEmail,
                        name,
                        status,
                        location,
                        category,
                        code,
                        date,
                        description) 
                        VALUES(
                            @userId,
                            @userEmail,
                            @name,
                            @status,
                            @location,
                            @category,
                            @code,
                            @date,
                            @description
                        )`,
                    (err) => {
                        if (err) {
                            reject(err.message);
                        }
                    }
                );
                
                request.addParameter('userId', TYPES.Int, event.userId);
                request.addParameter('userEmail', TYPES.VarChar, event.userEmail);
                request.addParameter('name', TYPES.VarChar, event.name);
                request.addParameter('status', TYPES.VarChar, event.status);
                request.addParameter('location', TYPES.NVarChar, event.location);
                request.addParameter('category', TYPES.VarChar, event.category);
                request.addParameter('code', TYPES.VarChar, event.code);
                request.addParameter('date', TYPES.DateTime, event.date);
                request.addParameter('description', TYPES.VarChar, event.description);
                
                try {
                    connection.execSql(request);

                    request.on('requestCompleted', function () {
                        resolve(event);
                    })
                }
                catch(error) {
                    reject(error);
                }
            }
        })
        connection.connect();
    })  
}

function remove(id) {
    return new Promise((resolve, reject) => {
        const connection = dbContext.connect();

        connection.on("connect", err => {
            if (err) {
                reject(err.message);
            } else {
                const request = new Request(
                    `DELETE FROM CivilianEvents WHERE id = @eventId`,
                    (err) => {
                        if (err) {
                            reject(err.message);
                        }
                    }
                );

                request.addParameter('eventID', TYPES.Int, id);

                try {
                    connection.execSql(request)

                    request.on('requestCompleted', function () {
                        resolve(true);
                    })
                }
                catch(error) {
                    reject(error);
                }
            }
        })
        connection.connect();
    })  
}

module.exports = {
    findAll,
    findById,
    insert,
    remove
}