const User = require("../modal/user_schema");
const Art = require("../modal/art_schema");

// Returns user Data for profile
// url >> /user/getUser
const getUser = async (req, res, next) => {
  try {
    let user = await User.findById({ _id: req.user.id }, [
      "-password",
      "-isAdmin",
      "-user_type",
    ]);
    return res.status(200).json({ ...user._doc });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error for user details", err });
  }
};

// Returns user Data after login
// url >> /user/userData
const userData = async (req, res, next) => {
  try {
    let user = await User.findById({ _id: req.body.uid }, [
      "-password",
      "-user_type",
    ]);
    return res.status(200).json({ ...user._doc });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error for user details", err });
  }
};

// Returns user Data for profile
// url >> /user/getUserById/:id
const getUserById = async (req, res, next) => {
  let id = req.params.id ? req.params.id : req.user.id;
  try {
    let user = await User.findById({ _id: id }, [
      "_id",
      "firstName",
      "lastName",
      "email",
      "user_type",
      "img",
    ]);
    return res.status(200).json({ ...user._doc });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", err });
  }
};
// Update user Profile
// url >> /user/updateProfile
const updateProfile = async (req, res, next) => {
  let { First_Name, Last_Name, email, contact, bio, img } = req.body;
  let user = null;
  try {
    await Art.updateMany(
      { user_id: req.user.id },
      { author: First_Name + " " + Last_Name }
    );
    user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        firstName: First_Name,
        lastName: Last_Name,
        email,
        contact,
        bio,
        img,
      }
    );
    user && res.status(200).json({ msg: "Profile updated successfully!" });
    next();
  } catch (err) {
    return res.status(500).json({ msg: "Failed to update!" });
  }
};

// Update user password
// url >>
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

// Returns all users
// url -> /app/getUsers
const getUsers = async (req, res, next) => {
  let users = null;
  try {
    if (req.user.isAdmin) {
      users = await User.find({}, ["-password", "-bio"]);
      return res.status(200).json(users);
    } else {
      return res.status(204).json({ msg: "not authorized admin" });
    }
  } catch (err) {
    return res.status(500).json({ msg: "failed to retrieve Data" });
  }
};

// Deletes a user account
// url >> /user/deleteUser
const deleteUser = async (req, res, next) => {
  let id = req.body.id;
  let user = null;
  let art = null;
  try {
    user = await User.deleteOne({ _id: id });
    art = await Art.deleteMany({ user_id: id });
    if (user || art) {
      return res.status(200).json({ msg: "deleted successfully" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Failed to Delete" });
  }
};

// returns a user for comment
// url -> /user/getPostedBy/:id
const getPostBy = async (req, res, next) => {
  const id = req.params.id;
  let user = null;
  try {
    user = await User.findById({ _id: id }, ["firstName", "lastName", "img"]);
    user && res.status(200).json({ ...user._doc });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to get user", err });
  }
};

exports.func_user = {
  getUser,
  getUserById,
  deleteUser,
  updatePass,
  updateProfile,
  getUsers,
  getPostBy,
  userData,
};
