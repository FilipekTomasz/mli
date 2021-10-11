require('dotenv').config()

const nodemailer = require("nodemailer");

async function sendMail(data, folder, attachments) {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '<wyprowadzmnie@gmail.com>', // sender address
    to: process.env.EMAIL_TO, // list of receivers
    subject: "Zgloszenie", // Subject line
    text: data, // plain text body
    attachments: attachments
  });
}
// miejsce urodzenia/ tytul projektu/ adres szkoly
module.exports = { sendMail}

