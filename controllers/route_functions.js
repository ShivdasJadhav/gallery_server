const express = require("express");
const User = require("../modal/signup");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();
let key = process.env.JWT_SECRETE_KEY;
const saveInfo = async (req, res, next) => {
  let users = null;
  let { name, email, password } = req.body;
  try {
    users = await User.findOne({ email });
    if (users) {
      return res.json({ message: "user already exists!",status:2 });
    }
    const hash = bcrypt.hashSync(password);
    users = await User({
      name,
      email,
      password: hash,
      user_type: "user",
      contact: "",
      address: "",
      about: "",
      img: "https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png",
    });
    users.save();
  } catch (err) {
    console.log("error to fetch data");
  }
  if (!users) {
    res.status(500).json({ message: "failed save user",status:0 });
    return;
  }
  res.status(201).json({ users,status:1 });
};
const login = async (req, res, next) => {
  let user = null;
  const { email, password } = req.body;
  try {
    user = await User.findOne({ email });
    if (!user) {
      res.status(200).json({ message: "User not found",status:2 });
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
      return res
        .status(200)
        .json({ user: user, messaged: "Login successfully", status: 1 });
    } else {
      return res.json({ message: "Invalid Credentials!", status: 0 });
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
  let email = req.params.email;
  let user = null;
  try {
    user = await User.find({ email: email }, "-password");
    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
  }
};
const setUser = async (req, res, next) => {
  let { name, email, contact, address, about, img } = req.body.profile;
  let user = null;
  try {
    user = await User.findOneAndUpdate(email, {
      name,
      email,
      contact,
      address,
      about,
      img,
    });
    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }
    return res.status(200).json({ message: "updated Successfuly" });
  } catch (err) {
    console.log(err);
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
exports.saveInfo = saveInfo;
exports.login = login;
// exports.verify = verify;
exports.getUser = getUser;
exports.setUser = setUser;
// exports.refresh_token = refresh_token;
