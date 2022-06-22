const nodemailer = require("nodemailer");

async function sendVerificationCodeMail(mail, code) {
    return new Promise(function (resolve, reject) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        seecure: true,
        auth: {
          user: "cose.management@gmail.com",
          pass: "zquevilunehuhush"
        },
      });
      const mailOptions = {
        from: "cose.management@gmail.com",
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

module.exports = {
    sendVerificationCodeMail
}