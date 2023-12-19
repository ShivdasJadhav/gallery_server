const router = require("../routes/app_routes");
const {welcomeTemplate} = require("../assets/welcomeTemplate.js");
const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const { config } = require("dotenv");
config();
const userName = process.env.mailer_userName;
const userPass = process.env.mailer_pass;
const nodeConfig = {
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: userName,
    pass: userPass,
  },
};
let transporter = nodemailer.createTransport(nodeConfig);
const registerMail = async (req, res, next) => {
  const { sendTo } = req.body;
  let message = {
    from: "jshivdas07@gmail.com",
    to: sendTo,
    subject: "Welcome aboard!",
    text: welcomeTemplate,
  };
  await transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).json({ msg: "Email sent successfully!" });
    })
    .catch((err) => {
      return res.status(500).json({ msg: "Failed to send Email!", err });
    });
};
router.post("/", registerMail);
module.exports = router;
