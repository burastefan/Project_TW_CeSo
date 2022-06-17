//REGISTER, LOGIN, FORGET PASSWORD
//COMUNICA CU userModel
//CRIPTARE PAROLA + VALIDARE JWT
//CRIPTARE + GENERARE - UTILS

const authenticationUser = require("../Models/authenticationModel");
const { jsonType } = require("../Utils/headerTypes");
const bcrypt = require("bcrypt");
const { reject } = require("bcrypt/promises");

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

async function registerUser(user, req, res) {
  try {
    user.password = hashPassword(user.password);
    const userExist = await authenticationUser.checkEmail(user.email);
    const userRegister = await authenticationUser.addUser(user);
    console.log('userRegister:', userRegister);
    console.log('userRegister.email:', userRegister.email);

    if (userExist != 0) {
      res.writeHead(409, jsonType);
      res.end(
        JSON.stringify({ message: "This email address is already being used!" })
      );
    } else {
      if (userRegister) {
        await authenticationUser.generateCode(userRegister.email);
        console.log("Send Email generated code!");
      } else {
        reject("Cannot add User.");
      }
      res.writeHead(201, jsonType);
      res.end(
        JSON.stringify({ message: "You have been successfully registered!" })
      );
    }
  } catch (error) {
    console.log("Error: ", error);
    res.writeHead(400, jsonType);
    res.end(JSON.stringify({ message: "Error in Registration pass!" }));
  }
}

module.exports = {
  registerUser,
};
