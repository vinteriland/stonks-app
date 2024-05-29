import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  const { email, message } = req.body;

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: 'amani.eichmann2@ethereal.email',
      pass: 'BR6c992duKDearMnKg',
    },
  });

  let mailOptions = {
    from: 'amani.eichmann2@ethereal.email',
    to: email,
    subject: 'Stream Notification',
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send(error.toString());
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent');
    }
  });
}
