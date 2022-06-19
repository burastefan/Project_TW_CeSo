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
    remove
}