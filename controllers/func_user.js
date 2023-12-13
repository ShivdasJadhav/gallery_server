const User = require("../modal/user_schema");

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

// Update use details
// url >> 
const updateProfile = async (req, res, next) => {
  let { First_Name, Last_Name, email, contact, bio, img } = req.body.payload;
  let user = null;
  try {
    user = await updateOne(
      { _id: req.user._id },
      {
        $set: {
          firstName: First_Name,
          lastName: Last_Name,
          email,
          contact,
          bio,
          img,
        },
      }
    );
    user && res.status(200).json({ ...user });
    next();
  } catch (err) {
    return res.status(500).json({ msg: "Failed to update!" });
  }
};

export { getUser, deleteUser, updatePass,updateProfile};
