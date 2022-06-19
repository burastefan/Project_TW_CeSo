const dbContext = require("../Utils/dbContext");
const { Request } = require("tedious");
const TYPES = require("tedious").TYPES;

function getInfo(email) {
  return new Promise((resolve, reject) => {
    const connection = dbContext.connect();
    connection.on("connect", (err) => {
      if (err) {
        reject(err.message);
      } else {
        const request = new Request(
          `SELECT firstName, lastName, roles FROM Users WHERE email=@email FOR JSON PATH`,
          (error, rowCount) => {
            if (error) {
              reject(error.message);
            }
            if (rowCount != 0) {
              reject("Infos about user didn't exist!");
            }
          }
        );

        request.addParameter("email", TYPES.VarChar, email);

        try {
          connection.execSql(request);

          request.on("row", (rows) => {
            rows.forEach((row) => {
              response = row.value;
              resolve(response);
            });
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
    getInfo,
};
