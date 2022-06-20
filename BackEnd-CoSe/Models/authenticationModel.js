const dbContext = require("../Utils/dbContext");
const { Request } = require("tedious");
const TYPES = require("tedious").TYPES;
const randomString = require("randomstring");
const { sendVerificationCodeMail } = require('../Services/emailService')

function getUserId(email) {
  return new Promise((resolve, reject) => {
    const connection = dbContext.connect();

    connection.on("connect", (err) => {
      if (err) {
        reject(err.message);
      } else {
        const request = new Request(
          `SELECT id FROM Users WHERE email = @email`,
          (error) => {
            if (error) {
              reject(error.message);
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

async function generateCode(email) {
  const userId = await getUserId(email);

  if (userId) {
    return new Promise((resolve, reject) => {
      const connection = dbContext.connect();
      connection.on("connect", (err) => {
        if (err) {
          reject(err.message);
        } else {
          const request = new Request(
            `INSERT INTO Codes (
              id,
              code
              ) 
              VALUES(
                @id,
                @code
                )`,
            (err) => {
              if (err) {
                reject(err.message);
              }
            }
          );

          let code = randomString.generate(20);
          request.addParameter("id", TYPES.Int, userId);
          request.addParameter("code", TYPES.VarChar, code);

          try {
            connection.execSql(request);
            sendVerificationCodeMail(email, code);

            request.on("requestCompleted", function () {
              resolve(email);
            });
          } catch (error) {
            reject(error);
          }
        }
      });
      connection.connect();
    });
  }
}

function checkEmail(email) {
  return new Promise((resolve, reject) => {
    const connection = dbContext.connect();

    connection.on("connect", (error) => {
      if (error) {
        reject(error.message);
      } else {
        const request = new Request(
          `SELECT count (*) FROM Users WHERE email = @email`,
          (err, rowCount) => {
            if (err) {
              reject(err.message);
            }
            if (rowCount != 0) {
              reject("Account already exist!");
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

function addUser(user) {
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
                        password,
                        location
                        ) 
                        VALUES(
                            @firstName,
                            @lastName,
                            @email,
                            @password,
                            @location
                        )`,
          (err) => {
            if (err) {
              reject(err.message);
            }
          }
        );
        console.log("hello", request);

        request.addParameter("firstName", TYPES.VarChar, user.firstName);
        request.addParameter("lastName", TYPES.VarChar, user.lastName);
        request.addParameter("email", TYPES.VarChar, user.email);
        request.addParameter("password", TYPES.VarChar, user.password);
        request.addParameter("location", TYPES.NVarChar, user.location);

        try {
          connection.execSql(request);

          request.on("requestCompleted", function () {
            resolve(user);
          });
        } catch (error) {
          reject(error);
        }
      }
    });
    connection.connect();
  });
}

async function checkExistCode(email, code) {
  const userId = await getUserId(email);

  if (userId) {
    return new Promise((resolve, reject) => {
      const connection = dbContext.connect();
      connection.on("connect", (err) => {
        if (err) {
          reject(err.message);
        } else {
          const request = new Request(
            `SELECT count (*) FROM Codes WHERE id = @id AND code = @code`,
            (err) => {
              if (err) {
                reject(err.message);
              }
            }
          );
          request.addParameter("id", TYPES.Int, userId);
          request.addParameter("code", TYPES.VarChar, code);

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
}

async function deleteCode(email, code) {
  const userId = await getUserId(email);

  return new Promise((resolve, reject) => {
    const connection = dbContext.connect();

    connection.on("connect", (err) => {
      if (err) {
        reject(err.message);
      } else {
        const request = new Request(
          `DELETE FROM Codes WHERE id = @id AND code = @code`,
          (err) => {
            if (err) {
              reject(err.message);
            }
          }
        );

        request.addParameter("id", TYPES.Int, userId);
        request.addParameter("code", TYPES.VarChar, code);

        try {
          connection.execSql(request);
          request.on("requestCompleted", function () {
            resolve(true);
          });
        } catch (error) {
          reject(error);
        }
      }
    });
    connection.connect();
  });
}

function activateAccount(email) {
  return new Promise((resolve, reject) => {
    const connection = dbContext.connect();

    connection.on("connect", (err) => {
      if (err) {
        reject(err.message);
      } else {
        const request = new Request(
          `UPDATE Users SET activate = 1 WHERE email = @email`,
          (err) => {
            if (err) {
              reject(err.message);
            }
          }
        );

        request.addParameter("email", TYPES.VarChar, email);

        try {
          connection.execSql(request);

          request.on("requestCompleted", function () {
            resolve(true);
          });
        } catch (error) {
          reject(error);
        }
      }
    });
    connection.connect();
  });
}

function login(email) {
  return new Promise((resolve, reject) => {
    const connection = dbContext.connect();
    connection.on("connect", (err) => {
      if (err) {
        reject(err.message);
      } else {
        const request = new Request(
          `SELECT password FROM Users WHERE email = @email and activate = 1`,
          (error, rowCount) => {
            if (error) {
              reject(error.message);
            }
            if (rowCount != 0) {
              reject("Password didn't exist!");
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

async function updatePassword(user) {
  const userId = await getUserId(user.email);

  if (userId) {
    return new Promise((resolve, reject) => {
      const connection = dbContext.connect()

      connection.on("connect", err => {
        if (err) {
          reject(err.message)
        } else {
          const request = new Request(
            `UPDATE Users SET password = @password WHERE id = @id`,
            (err) => {
              if (err) {
                reject(err.message)
              }
            }
          );

          request.addParameter("password", TYPES.VarChar, user.newPassword);
          request.addParameter("id", TYPES.Int, userId);


          try {
            connection.execSql(request)

            request.on('requestCompleted', function () {
              resolve(true)
            })
          }
          catch (error) {
            reject(error)
          }
        }
      })
      connection.connect()
    })
  }
}

module.exports = {
  addUser,
  checkEmail,
  getUserId,
  generateCode,
  checkExistCode,
  activateAccount,
  deleteCode,
  login,
  updatePassword,
};
