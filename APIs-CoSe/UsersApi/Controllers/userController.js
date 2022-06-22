const infoUser = require("../Models/userModel");
const { jsonType } = require("../Utils/headerTypes");
const { getEmailUsersByLocation } = require('../Models/userModel');

async function getInfosUser(email, req, res) {
  try {
    const info = await infoUser.getInfo(email);

    res.writeHead(200, jsonType);
    res.end(info);
  } catch (error) {
    console.log("Error: ", error);
    res.writeHead(400, jsonType);
    res.end(
      JSON.stringify({ message: "Error in Registration Validater pass!" })
    );
  }
}

async function getEmailsByLocation(location, req, res) {
    try {
        const userEmails = await infoUser.getEmailUsersByLocation(location);
        console.log(userEmails);
    
        res.writeHead(200, jsonType);
        res.end(userEmails);
      } catch (error) {
        console.log("Error: ", error);
        res.writeHead(400, jsonType);
        res.end(
          JSON.stringify({ message: "Error in Registration Validater pass!" })
        );
    }
}

module.exports = {
  getInfosUser,
  getEmailsByLocation
};
