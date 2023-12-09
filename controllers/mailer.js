const router = require("../routes/app_routes");

const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const { config } = require("dotenv");
config();
const userName = process.env.mailer_userName;
const userPass = process.env.mailer_pass;
const nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: userName,
    pass: userPass,
  },
};
let transporter = nodemailer.createTransport(nodeConfig);
let mailGenerator = new mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});
const registerMail = async (req, res, next) => {
  const { username, userEmail, text, subject } = req.body;
  let email = {
    body: { name: username, intro: text, outro: "Do Not Reply..!" },
  };
  let emailBody = mailGenerator.generate(email);
  let message = {
    from: userName,
    to: userEmail,
    subject: subject,
    html: emailBody,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).json(message);
    })
    .catch((err) => {
      return res.status(500).json({ msg: "Failed to send Email!", err });
    });
};
router.post("/",registerMail);
module.exports = router;
