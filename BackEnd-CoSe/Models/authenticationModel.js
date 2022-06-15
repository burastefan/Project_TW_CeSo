const dbContext = require("../Utils/dbContext");
const { Request } = require("tedious");
const TYPES = require("tedious").TYPES;
const nodemailer = require("nodemailer");


function addUser(event) {
  return new Promise((resolve, reject) => {
    const connection = dbContext.connect();

    connection.on("connect", (err) => {
      if (err) {
        reject(err.message);
      } else {
        const request = new Request(
          `INSERT INTO Users (
                        firstName,
                        lastName, 
                        email,
                        password
                        ) 
                        VALUES(
                            @firstName,
                            @lastName,
                            @email,
                            @password
                        )`,
          (err) => {
            if (err) {
              reject(err.message);
            }
          }
        );
        console.log("hello", request);

        request.addParameter("firstName", TYPES.VarChar, event.firstName);
        request.addParameter("lastName", TYPES.VarChar, event.lastName);
        request.addParameter("email", TYPES.VarChar, event.email);
        request.addParameter("password", TYPES.VarChar, event.password);

        try {
          connection.execSql(request);

          request.on("requestCompleted", function () {
            resolve(event);
          });
        } catch (error) {
          reject(error);
        }
      }
    });
    connection.connect();
  });
}

module.exports = {
  addUser,
};
