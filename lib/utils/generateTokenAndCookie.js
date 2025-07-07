import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 Days,
    httpOnly: true,
    sameSite: "strict",

  });
  return {message: 
  "cookie setting successfully."
  }
};

export default generateTokenAndSetCookie;
