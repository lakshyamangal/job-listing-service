const jwt = require("jsonwebtoken");
const verifyJwt = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(401)
        .json({ message: "Path proteted!! , need authorization" });
    // jwt.verify returns decoded payload of the token , it's a object so , you can use userId from there
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decode.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = verifyJwt;
