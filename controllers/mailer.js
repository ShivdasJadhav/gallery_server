const router = require("../routes/app_routes");
const nodemailer = require("nodemailer");
const {
  welcomeTemplate,
  subscriptionTemplate,
} = require("../assets/emailTemplates");
const mailgen = require("mailgen");
const Subscriber = require("../modal/subscriber_schema");
const { config } = require("dotenv");
config();

// setting transporter configurations
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
  const { sendTo, name } = req.body;
  let message = {
    from: "artexhibitors@gmail.com",
    to: sendTo,
    subject: "Welcome aboard! Here's what you need to know.",
    text: welcomeTemplate(name),
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
const subscribeMail = async (req, res, next) => {
  const { sendTo, name } = req.body;
  let subscriber = null;
  try {
    subscriber = await Subscriber.findOne({ email: sendTo });
    if (subscriber) {
      return res.status(208).json({ msg: "Already subscribed" });
    }
    subscriber = await Subscriber.create({ name: name, email: sendTo });
    if (subscriber) {
      let message = {
        from: "artexhibitors@gmail.com",
        to: sendTo,
        subject: "Your subscribed @artexhibits!",
        text: subscriptionTemplate(name),
      };
      await transporter
        .sendMail(message)
        .then(() => {
          return res.status(201).json({ msg: "Subscribed successfully!" });
        })
        .catch((err) => {
          return res.status(500).json({ msg: "Failed to send Email!", err });
        });
    } else {
      return res.status(500).json({ msg: "Failed to subscribe" });
    }
  } catch (e) {
    return res.status(500).json({ msg: "Failed to subscribe", err });
  }
};
router.post("/welcome", registerMail);
router.post("/subscribe", subscribeMail);
module.exports = router;
