const authenticationUser = require("../Models/authenticationModel");
const { jsonType } = require("../Utils/headerTypes");
const path = require('path');
const privateKey = path.join(__dirname, "..", "Utils", "private.key");
const bcrypt = require("bcrypt");
const { reject } = require("bcrypt/promises");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

function createToken(userId) {

  const payload = {
    userId: userId,
  };

  const privateKEY = fs.readFileSync(privateKey, 'utf8');

  const i = "UPNP"; // Issuer
  const s = "some@user.com"; // Subject
  const a = "http://localhost:5000"; // Audience

  // SIGNING OPTIONS
  const signOptions = {
    issuer: i,
    subject: s,
    audience: a,
    expiresIn: "12h",
    algorithm: "RS256",
  };

  const token = jwt.sign(payload, privateKEY, signOptions);
  console.log("Token - " + token);
  return token;
}

async function registerUser(user, req, res) {
  try {
    user.password = hashPassword(user.password);
    const userExist = await authenticationUser.checkEmail(user.email);

    if (userExist) {
      res.writeHead(409, jsonType);
      res.end(
        JSON.stringify({ message: "This email address is already being used!" })
      );
    } else {
      const userRegister = await authenticationUser.addUser(user);
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
    res.writeHead(401, jsonType);
    res.end(JSON.stringify({ message: "Error in Registration pass!" }));
  }
}

async function registerValidate(user, req, res) {
  try {
    const checkExistCode = await authenticationUser.checkExistCode(
      user.email,
      user.code
    );
    console.log("checkExistCode:", checkExistCode);
    if (checkExistCode == 1) {
      await authenticationUser.deleteCode(user.email, user.code);

      await authenticationUser.activateAccount(user.email);

      res.writeHead(201, jsonType);
      res.end(
        JSON.stringify({ message: "Your account was activate with succes!!!" })
      );
    }
  } catch (error) {
    console.log("Error: ", error);
    res.writeHead(400, jsonType);
    res.end(
      JSON.stringify({ message: "Error in Registration Validater pass!" })
    );
  }
}

async function loginUser(user, req, res) {
  try {
    const passwordExist = await authenticationUser.login(user.email);
    console.log(passwordExist);
    if (passwordExist) {
      const validPassword = bcrypt.compareSync(user.password, passwordExist);
      if (validPassword) {
        const userId = await authenticationUser.getUserId(user.email);
        const jsonObject = {
          "token": createToken(userId),
        };
        res.writeHead(202, jsonType);
        res.end(JSON.stringify(jsonObject));
      }
      else {
        res.writeHead(401, jsonType);
        res.end(
          JSON.stringify({ message: "The email/password you inserted is incorrect!" })
        );
      }
    }
    else {
      res.writeHead(401, jsonType);
      res.end(
        JSON.stringify({ message: "The email/password you inserted is incorrect!" })
      );
    }
  } catch (error) {
    console.log("Error: ", error);
    res.writeHead(401, jsonType);
    res.end(
      JSON.stringify({ message: "The email/password you inserted is incorrect!" })
    );
  }
}

async function changePassword(user, req, res) {
  try {
    const emailExist = await authenticationUser.checkEmail(user.email);

    if (emailExist > 0) {
      const passwordExist = await authenticationUser.login(user.email);

      if (passwordExist) {
        const validPassword = bcrypt.compareSync(
          user.currentPassword,
          passwordExist
        );

        if (validPassword) {
          user.newPassword = hashPassword(user.newPassword);
          await authenticationUser.updatePassword(user);
          res.writeHead(200, jsonType);
          res.end(JSON.stringify({ message: "Change password with succes!!!" }));
        }
        else {
          res.writeHead(401, jsonType);
          res.end(
            JSON.stringify({ message: "The email/password you inserted is incorrect!" })
          );
        }
      }
      else {
        res.writeHead(401, jsonType);
        res.end(
          JSON.stringify({ message: "The email/password you inserted is incorrect!" })
        );
      }
    }
    else {
      res.writeHead(401, jsonType);
      res.end(
        JSON.stringify({ message: "The email/password you inserted is incorrect!" })
      );
    }
  } catch (error) {
    console.log("Error: ", error);
    res.writeHead(400, jsonType);
    res.end(
      JSON.stringify({ message: "Error! Could not change password!" })
    );
  }
}

module.exports = {
  registerUser,
  registerValidate,
  loginUser,
  changePassword,
  createToken,
};
