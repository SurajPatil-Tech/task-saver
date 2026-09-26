import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const generateTokenAndSaveInCookies = async (userId, res) => {
  try {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "10d",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    await User.findByIdAndUpdate(userId, {
      token,
    });

    return token;
  } catch (error) {
    console.error("TOKEN ERROR:", error);
    throw error;
  }
};