const User = require("../modal/user_schema");

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
export { verify };
