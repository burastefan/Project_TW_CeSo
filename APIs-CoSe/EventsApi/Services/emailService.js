const nodemailer = require("nodemailer");
const axios = require('axios').default;

async function alertPopulationMail(event) {
    console.log("Location: ", event.location);

    //Get emails by location from Users API
    axios.get('http://localhost:5002/api/users/email', { params: { location: event.location } })
    .then(function (response) {
        const userEmails = response.data;
        console.log(userEmails);
        if (userEmails) {
            for (let i = 0; i < userEmails.length; i++) {
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
                    to: userEmails[i].email,
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
                        console.log(`Alert email sent to ${userEmails[i].email} ` + info.response);
                    }
                });
            }
        }
    })
    .catch(function (error) {
        console.log(error);
    });

    // const userEmails = await infoUser.getEmailUsersByLocation(event.location);
    // if (userEmails) {
    //     const emails = JSON.parse(userEmails);
    //     console.log("User Emails: ", emails);

    //     for (let i = 0; i < emails.length; i++) {
    //         const transporter = nodemailer.createTransport({
    //             host: "smtp.gmail.com",
    //             port: 465,
    //             seecure: true,
    //             auth: {
    //                 user: "cose.management@gmail.com",
    //                 pass: "zquevilunehuhush"
    //             },
    //         });
    //         const mailOptions = {
    //             from: "cose.management@gmail.com",
    //             to: emails[i].email,
    //             subject: "CoSe Alert - New crisis event in your area",
    //             html: 
    //             `
    //             <div>Important Details:</div>
    //             <div>Name: ${event.name}</div>
    //             <div>Category: ${event.category}</div>
    //             <div>Date of occurence: ${event.date}</div>
    //             <div>Location: ${event.location}</div>
    //             <div>Code: ${event.code}</div>
    //             <div>Status: ${event.status}</div>
    //             <div>Please take caution and follow the instructions provided by your local authorities!</div>
    //             `
    //         };
    //         transporter.sendMail(mailOptions, function (error, info) {
    //             if (error) {
    //                 console.log(error);
    //             } else {
    //                 console.log(`Alert email sent to ${emails[i].email} ` + info.response);
    //             }
    //         });
    //     }
    // }
}

module.exports = {
    alertPopulationMail
}