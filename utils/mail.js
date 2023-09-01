const nodemailer = require("nodemailer");

const sendmail = (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      port: 465, // true for 465, false for other ports
      host: "smtp.gmail.com",
      auth: {
        user: 'fintrak.alert@gmail.com',
        pass: process.env.MAIL_PASSWORD,
      },
      secure: true,
      requireTLS: true,
    });

    const mailOptions = {
      from: 'fintrak.alert@gmail.com',
      to: to,
      subject: subject,
      html: html,
    };
    console.log('mail sent');
    transporter.sendMail(mailOptions);

  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {sendmail};
