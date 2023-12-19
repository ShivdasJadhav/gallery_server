const router = require("../routes/app_routes");
const welcomeTemplate = require("../assets/welcomeTemplate.js");
const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const { config } = require("dotenv");
config();
const userName = process.env.mailer_userName;
const userPass = process.env.mailer_pass;
const nodeConfig = {
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: userName,
    pass: userPass,
  },
};
let transporter = nodemailer.createTransport(nodeConfig);
// let mailGenerator = new mailgen({
//   theme: "default",
//   product: {
//     name: "Mailgen",
//     link: "https://mailgen.js/",
//   },
// });
// const welcomeTemplate = "<h3>shivdasd success</h2>";
const registerMail = async (req, res, next) => {
  const { sendTo} = req.body;
  let message = {
    from: "Exhibitors @arts",
    to: sendTo,
    subject: "Welcome aboard!",
    html: welcomeTemplate,
  };
  await transporter
    .sendMail(message)
    .then((res) => {
      return res.status(200).json({ details: message, res });
    })
    .catch((err) => {
      return res.status(500).json({ msg: "Failed to send Email!", err });
    });
};
router.post("/", registerMail);
module.exports = router;
