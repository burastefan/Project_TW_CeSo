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

async function registerValidate(user, req, res) {
  try {
    const checkExistCode = await authenticationUser.checkExistCode(
      user.email,
      user.code
    );
    console.log('checkExistCode:', checkExistCode);
    if (checkExistCode == 1) {
      await authenticationUser.deleteCode(user.email, user.code);

      await authenticationUser.activateAccount(user.email);

      //TODO use json here jwt -> login.hmtl
      res.writeHead(201, jsonType);
      res.end(
        JSON.stringify({ message: "Your account was activate with succes!!!" })
      );
    }
  } catch (error) {
    console.log("Error: ", error);
    res.writeHead(400, jsonType);
    res.end(JSON.stringify({ message: "Error in Registration Validater pass!" }));
  }
}

async function loginUser(user, req, res) {
  try {
    const passwordExist = await authenticationUser.login(user.email);
    if(passwordExist) {
      const validPassword = bcrypt.compareSync(user.password, passwordExist);
      if (validPassword) {
        res.writeHead(202, jsonType);
        res.end(
          JSON.stringify({ message: "Login with succes!!!" })
        );
      }
    }
  } catch (error) {
    console.log("Error: ", error);
    res.writeHead(400, jsonType);
    res.end(JSON.stringify({ message: "Error in Registration Validater pass!" }));
  }
}

module.exports = {
  registerUser,
  registerValidate,
  loginUser,
};
