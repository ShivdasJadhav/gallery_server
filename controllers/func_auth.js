const User = require("../modal/user_schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { config } = require("dotenv");
config();
let key = process.env.JWT_SECRETE_KEY;

// Register user
// Url >> /auth/register
const register = async (req, res, next) => {
  let user = null;
  let { firstName, lastName, email, pass, contact, user_type } = req.body;
  try {
    user = await User.findOne({ email: email }, ["email"]);
    if (user) {
      return res.status(208).json({ msg: "user already exist!" });
    }
    let salt = await bcrypt.genSalt(12);
    let hash = await bcrypt.hash(pass, salt);
    user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      isAdmin: false,
      contact: parseInt(contact),
      bio: "",
      user_type,
      img: "",
    });
    if (user) {
      return res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({ msg: "Failed to create user !" });
  }
};

// Login user
// url >> /auth/login
const login = async (req, res, next) => {
  let user = null;
  const { email, password } = req.body;
  try {
    user = await User.findOne({ email });
    if (!user) {
      return res.status(204).json({ message: "User not found" });
    }
    let compare = bcrypt.compareSync(password, user.password);
    if (compare) {
      return res.status(200).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(203).json({ msg: "Invalid Credentials!" });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Server Error !" });
  }
};

// Verify user
// middleware
const verify = async (req, res, next) => {
  let token = null;
  token = req.headers.authorization.split(" ")[1];
  try {
    let decode = jwt.verify(token, key);
    if (decode) {
      req.user = await User.findById({ _id: decode.id }, [
        "_id",
        "email",
        "contact",
      ]);
    } else {
      return res.status(204).json({ msg: "Token expired!" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ msg: "server Error!" });
  }
};

// Retrieve user
// middleware
const getUser = async (req, res, next) => {
  try {
    let user = await User.findById({ _id: req.user.id }, [
      "-password",
      "-isAdmin",
      "-user_type",
    ]);
    return res.status(200).json({ ...user._doc });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
};

// Update user password
// url >> /auth/reset_pass
const updatePass = async (req, res, next) => {
  let { email, newPass } = req.body;
  if (!req.app.locals.resetSession) {
    return res.status(203).json({ msg: "session expired" });
  }
  try {
    let salt = bcrypt.genSalt(12);
    const hash = bcrypt.hashSync(newPass, salt);
    await User.updateOne(
      { email: email },
      {
        $set: {
          password: hash,
        },
      },
      (err, data) => {
        if (err) {
          return res.status(500).json({ msg: "Failed to Update", err });
        }
        req.app.locals.resetSession = false;
        return res.status(200).json({ message: "updated Successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ msg: "server Error", err });
  }
};

// Set user data in Request
// middleware
const localVar = async (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};

// Token generation
// callback
const generateToken = (id) => {
  return jwt.sign({ id }, key, { expiresIn: "24h" });
};

// returns user status count of application
// url 
const getUserData = async (req, res, next) => {
  let artist = null;
  let art_lover = null;
  let orgs = null;
  let users = null;
  try {
    artist = await User.find({ use_type: "artist" }).countDocuments();
    art_lover = await User.find({ use_type: "art_lover" }).countDocuments();
    orgs = await User.find({ use_type: "org" }).countDocuments();
    users = await User.find();
    return res.status(200).json({ artist, art_lover, orgs, users });
  } catch (err) {
    console.log(err);
  }
};

// Deletes a user account
// url >>
const deleteUser = async (req, res, next) => {
  let id = req.body.id;
  let user = null;
  try {
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(400).json({ message: "Failed to Delete" });
  } else {
    return res
      .status(200)
      .json({ message: "user Deleted successfully!", user: user });
  }
};

const generateOtp = async (req, res, next) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    loweCaseAlphabet: false,
    upperCaseAlphabet: false,
    specialSymbols: false,
  });
  res.status(201).json({ OTP: req.app.locals.OTP });
  next();
};
const verifyOtp = async (req, res, next) => {
  const { otp } = req.body;
  if (paseInt(req.app.locals.OTP) === paseInt(otp)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(200).json({ msg: "verified successfully" });
  }
  return res.status(203).json({ msg: "Invalid OTP" });
};
const resetSession = async (req, res, next) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(200).json({ msg: "access permit" });
  }
  return res.status(203).json({ msg: "session expired" });
};

exports.register = register;
exports.login = login;
exports.verify = verify;
exports.getUser = getUser;
exports.getUserData = getUserData;
exports.deleteUser = deleteUser;
exports.updatePass = updatePass;
exports.localVar = localVar;
exports.updatePass = updatePass;
