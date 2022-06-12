//EXAMPLE MODEL WITH CONNECTION TO DB (NOT USED IN OUR APP)

const dbContext = require('../Utils/dbContext')
const { Request } = require("tedious")

function findAll() {
    return new Promise((resolve, reject) => {
        const connection = dbContext.connect()

        connection.on("connect", err => {
            if (err) {
                console.error(err.message)
            } else {
                const request = new Request(
                    `SELECT * FROM Products FOR JSON PATH`,
                    (err, rowCount) => {
                        if (err) {
                            console.error(err.message)
                        } else {
                            console.log(`${rowCount} row(s) returned`)
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

module.exports = {
    findAll
}