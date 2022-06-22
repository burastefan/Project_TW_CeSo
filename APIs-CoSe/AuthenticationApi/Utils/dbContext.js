function connect() {
    const { Connection } = require("tedious")

    // Create connection to database
    const config = {
        authentication: {
            options: {
            userName: "coseadmin",
            password: "tudorsibura2!"
            },
            type: "default"
        },
        server: "cose.database.windows.net",
        options: {
            database: "COSE",
            encrypt: true
        }
    }

    const connection = new Connection(config)

    return connection
}

module.exports = {
    connect
}