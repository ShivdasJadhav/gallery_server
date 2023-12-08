const express = require("express");
const User = require("../modal/user_schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();
let key = process.env.JWT_SECRETE_KEY;
const register = async (req, res, next) => {
  let user = null;
  let { name, email, pass, contact, user_type } = req.body;
  try {
    user = await User.findOne({ email });
    if (user) {
      return res.status(208).json({ message: "already exist" });
    }
    const hash = bcrypt.hashSync(pass);
    user = await User({
      name,
      email,
      password: hash,
      isAdmin: false,
      contact: contact,
      address: "",
      about: "",
      user_type,
      img: "",
    });
    user.save();
    if (user) {
      return res.status(201).json({ ...user });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Server error!" });
  }
  next();
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
      // const token = jwt.sign({ id: user.id }, key, {
      //   expiresIn: "35s",
      // });
      // console.log("user Id\n", user.id);

      // if (req.cookies[`${user.id}`]) {
      //   req.cookies[`${user.id}`] = "";
      // }
      // res.cookie(String(user.id), token, {
      //   path: "/login",
      //   expires: new Date(Date.now() + 1000 * 30),
      //   httpOnly: true,
      //   sameSite: "lax",
      // });
      return res.status(200).json({ ...user });
    } else {
      return res.status(203).json({ msg: "Invalid Credentials!" });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Server Error !" });
  }
  next();
};

const sendOtp = async (req, res, next) => {
  let user = null;
  const { email } = req.body;
  try {
    user = await User.findOne({ email }, "contact");
    if (user) {
      return res.status(200).json({
        contact: user.contact,
      });
    } else {
      return res.status(201).json({
        message: "user not found!",
      });
    }
  } catch (err) {
    console.log("failed to process\t\n", err);
  }
};
const verify = async (req, res, next) => {
  const cookie = req.headers.cookie;
  if (!cookie) {
    return res.status(404).json({ message: "Session expired!" });
  }
  const token = cookie.split("=")[1];
  try {
    if (!token) {
      return res.status(404).json({ message: "token not found!" });
    }
    jwt.verify(String(token), key, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "token expired" });
      }
      req.id = decoded.id;
      next();
    });
  } catch (err) {
    console.log(err);
  }
};
const getUser = async (req, res, next) => {
  let email = req.body.email;
  let user = null;
  try {
    user = await User.find({ email: email }, "-password");
    if (!user) {
      return res.status(200).json({ status: 0, message: "user not found!" });
    }
    return res.status(200).json({ status: 1, user: user[0] });
  } catch (err) {
    console.log(err);
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
const updatePass = async (req, res, next) => {
  let { email, newPass } = req.body;
  let user = null;
  try {
    const hash = bcrypt.hashSync(newPass);
    user = await User.updateOne(
      { email: email },
      {
        $set: {
          password: hash,
        },
      }
    );
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
exports.register = register;
exports.login = login;
// exports.verify = verify;
exports.getUser = getUser;
exports.setUser = setUser;
exports.getUserData = getUserData;
exports.deleteUser = deleteUser;
exports.sendOtp = sendOtp;
exports.updatePass = updatePass;
// exports.refresh_token = refresh_token;
