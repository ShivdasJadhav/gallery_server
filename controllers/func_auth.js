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
      const token = generateToken(user._id);
      return res.status(200).json({ token });
    } else {
      return res.status(203).json({ msg: "Invalid Credentials!" });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Server Error !" });
  }
};
// update user Password
// Url >> /auth/updatePassword
const updatePassword = async (req, res, next) => {
  let user = null;
  let { email, pass } = req.body;
  try {
    let salt = await bcrypt.genSalt(12);
    let hash = await bcrypt.hash(pass, salt);

    user = await User.findOneAndUpdate({ email: email }, { password: hash });
    if (user) {
      return res.status(200).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } else {
      return res.status(500).json({ msg: "Failed to update user password !" });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Failed to update user password !" });
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

// returns user count as per user types
const getUserCount = async (req, res, next) => {
  let artist = null;
  let enthusiast = null;
  let orgs = null;
  try {
    artist = await User.count({ user_type: "artist" });
    enthusiast = await User.count({ user_type: "enthusiast" });
    orgs = await User.count({ user_type: "org" });
    return res.status(200).json({ artist, enthusiast, orgs });
  } catch (err) {
    return res.status(500).json({ msg: "failed to retrieve Data" });
  }
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

// Returns use details for Resetting password
// url -> /auth/forgot/?email=
const getDetails = async (req, res, next) => {
  let user = null;
  try {
    user = await User.findOne({ email: req.query.email }, ["email", "contact"]);
    user
      ? res.status(200).json({ ...user._doc })
      : res.status(203).json({ msg: "user not Found" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error!" });
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
exports.func_auth = {
  register,
  login,
  updatePassword,
  getUserData,
  localVar,
  getUserCount,
  getDetails,
};
