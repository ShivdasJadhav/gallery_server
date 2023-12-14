const User = require("../modal/user_schema");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();
key = process.env.JWT_SECRETE_KEY;
// Verify user
// middleware
const verifyToken = async (req, res, next) => {
  try {
    if (req.headers.authorization.startsWith("Bearer")) {
      let token = req.headers.authorization.split(" ")[1];
      let decode = jwt.verify(token, key);
      if (decode) {
        let user = null;
        user = await User.findById({ _id: decode.id }, [
          "_id",
          "email",
          "contact",
        ]);
        if (user) {
          req.user = user;
          next();
        } else {
          return res.status(204).json({ msg: "user not exist !" });
        }
      } else {
        return res.status(204).json({ msg: "Token expired!" });
      }
    } else {
      throw new "there is no token"();
    }
  } catch (err) {
    return res.status(204).json({ msg: "server Error!", err });
  }
};
exports.common = { verifyToken };
