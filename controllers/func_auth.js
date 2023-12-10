const express = require("express");
const User = require("../modal/user_schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { config } = require("dotenv");
config();
let key = process.env.JWT_SECRETE_KEY;

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
const setUser = async (req, res, next) => {
  let { name, email, contact, address, about, img } = req.body.profile;
  let user = null;
  try {
    user = await User.updateOne(
      { email: email },
      {
        $set: {
          name,
          contact,
          address,
          about,
          img,
        },
      }
    );
    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }
    return res.status(200).json({ message: "updated Successfuly" });
  } catch (err) {
    console.log(err);
  }
};

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
const refresh_token = async (req, res, next) => {
  let cookies = req.header.cookies;
  console.log("cookie:\n", cookies, "\n");
  let prevtoken = cookies.split("=");
  prevtoken = prevtoken[1];
  if (!prevtoken) {
    return res.status(400).json({ message: "token Not found!" });
  }
  jwt.verify(String(prevtoken), key, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    res.clearCokokie(`${decoded.id}`);
    req.coockie[`${decoded.id}`] = "";
    const token = jwt.sign({ id: decoded.id }, key, {
      expiresIn: "35s",
    });
    console.log("refreshedd token\n", token);
    res.cookie(String(decoded.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30),
      httpOnly: true,
      sameSite: "lax",
    });
    req.id = decoded.id;

    next();
  });
};
const generateToken = (id) => {
  return jwt.sign({ id }, key, { expiresIn: "24h" });
};
const localVar = async (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
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
exports.register = register;
exports.login = login;
exports.verify = verify;
exports.getUser = getUser;
exports.setUser = setUser;
exports.getUserData = getUserData;
exports.deleteUser = deleteUser;
exports.updatePass = updatePass;
exports.localVar = localVar;
exports.updatePass = updatePass;
// exports.refresh_token = refresh_token;
