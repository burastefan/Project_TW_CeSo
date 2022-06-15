//REGISTER, LOGIN, FORGET PASSWORD
//COMUNICA CU userModel
//CRIPTARE PAROLA + VALIDARE JWT
//CRIPTARE + GENERARE - UTILS

const authenticationUser = require("../Models/authenticationModel");
const { jsonType } = require("../Utils/headerTypes");
const bcrypt = require("bcrypt");

const hashPassword = (password) => { 
    return bcrypt.hashSync(password, 10);
  };

async function registerUser(user, req, res) {
  try {
    user.password = hashPassword(user.password);
    
    await authenticationUser.addUser(user);

    res.writeHead(201, jsonType);
    res.end(JSON.stringify({ message: "User registered succesfully!" }));


  } catch (error) {
    console.log("Error: ", error);

    res.writeHead(400, jsonType);
    res.end(JSON.stringify({ message: "Error in Registration pass!" }));
  }
}

module.exports = {
  registerUser,
};
