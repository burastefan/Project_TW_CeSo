const nodemailer = require("nodemailer");
const infoUser = require("../Models/userModel");

async function sendVerificationCodeMail(mail, code) {
    return new Promise(function (resolve, reject) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        seecure: true,
        auth: {
          user: "tudorsibura@gmail.com",
          pass: "fjnpwtxdvwcovfiq"
        },
      });
      const mailOptions = {
        from: "tudorsibura@gmail.com",
        to: mail,
        subject: "Validation code",
        text: "Use this code: " + code + " to validate your account!"
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(false);
        } else {
          resolve(true);
          console.log("Email sent: " + info.response);
        }
      });
    });
}

async function alertPopulationMail(event) {
    console.log("Location: ", event.location);

    const userEmails = await infoUser.getEmailUsersByLocation(event.location);
    if (userEmails) {
        const emails = JSON.parse(userEmails);
        console.log("User Emails: ", emails);

        for (let i = 0; i < emails.length; i++) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                seecure: true,
                auth: {
                    user: "tudorsibura@gmail.com",
                    pass: "fjnpwtxdvwcovfiq"
                },
            });
            const mailOptions = {
                from: "tudorsibura@gmail.com",
                to: emails[i].email,
                subject: "CoSe Alert - New crisis event in your area",
                html: 
                `
                <div>Important Details:</div>
                <div>Name: ${event.name}</div>
                <div>Category: ${event.category}</div>
                <div>Date of occurence: ${event.date}</div>
                <div>Location: ${event.location}</div>
                <div>Code: ${event.code}</div>
                <div>Status: ${event.status}</div>
                <div>Please take caution and follow the instructions provided by your local authorities!</div>
                `
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(`Alert email sent to ${emails[i].email} ` + info.response);
                }
            });
        }
    }
}

module.exports = {
    sendVerificationCodeMail,
    alertPopulationMail
}