const dbContext = require('../Utils/dbContext')
const { Request } = require("tedious")
const TYPES = require('tedious').TYPES

//axios.get('http://localhost:5000/eventApi/events')

function findAll() {
    return new Promise((resolve, reject) => {
        const connection = dbContext.connect();

        connection.on("connect", err => {
            if (err) {
                reject(err.message);
            } else {
                const request = new Request(
                    `SELECT * FROM Shelters FOR JSON PATH`,
                    (err, rowCount) => {
                        if (err) {
                            reject(err.message);
                        }
                        if (rowCount == 0) {
                            reject(`No shelters were found`);
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
                    `SELECT * FROM Shelters WHERE id = @shelterID FOR JSON PATH`,
                    (err, rowCount) => {
                        if (err) {
                            reject(err.message);
                        }
                        if (rowCount == 0) {
                            reject(`No shelter with id ${id} was found`);
                        }
                    }
                );

                request.addParameter('shelterID', TYPES.Int, id);
                
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

function insert(shelter) {
    return new Promise((resolve, reject) => {
        const connection = dbContext.connect();

        connection.on("connect", err => {
            if (err) {
                reject(err.message);
            } else {
                const request = new Request(
                    `INSERT INTO Shelters (
                        name,
                        description,
                        location,
                        category,
                        capacity) 
                        VALUES(
                            @name,
                            @description,
                            @location,
                            @category,
                            @capacity
                        )`,
                    (err) => {
                        if (err) {
                            reject(err.message);
                        }
                    }
                );
                
                request.addParameter('name', TYPES.VarChar, shelter.name);
                request.addParameter('description', TYPES.VarChar, shelter.description);
                request.addParameter('location', TYPES.NVarChar, shelter.location);
                request.addParameter('category', TYPES.VarChar, shelter.category);
                request.addParameter('capacity', TYPES.Int, shelter.capacity);
                
                try {
                    connection.execSql(request);

                    request.on('requestCompleted', function () {
                        resolve(shelter);
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
                    `DELETE FROM Shelters WHERE id = @shelterID`,
                    (err) => {
                        if (err) {
                            reject(err.message);
                        }
                    }
                );

                request.addParameter('shelterID', TYPES.Int, id);

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

function update(shelter) {
    return new Promise((resolve, reject) => {
        const connection = dbContext.connect();

        connection.on("connect", err => {
            if (err) {
                reject(err.message);
            } else {
                const request = new Request(
                    `UPDATE Shelters 
                        SET name = @name,
                        description = @description
                        location = @location,
                        category = @category,
                        capacity = @capacity,
                    WHERE id = @id`,
                    (err) => {
                        if (err) {
                            reject(err.message);
                        }
                    }
                );

                request.addParameter('name', TYPES.VarChar, shelter.name);
                request.addParameter('description', TYPES.VarChar, shelter.description);
                request.addParameter('location', TYPES.NVarChar, shelter.location);
                request.addParameter('category', TYPES.VarChar, shelter.category);
                request.addParameter('capacity', TYPES.Int, shelter.capacity);
                request.addParameter('id', TYPES.Int, shelter.id);
                
                try {
                    connection.execSql(request);

                    request.on('requestCompleted', function () {
                        resolve(shelter);
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
    remove,
    update
}