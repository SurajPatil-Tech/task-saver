import User from "../model/user.model.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokenAndSaveInCookies } from "../jwt/token.js";

const userSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),

  username: z.string().min(3, {
    message: "Username at least 3 characters long",
  }),

  password: z.string().min(6, {
    message: "Password at least 6 characters long",
  }),
});

// REGISTER
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        errors: "All fields are required",
      });
    }

    const validation = userSchema.safeParse({
      email,
      username,
      password,
    });

    if (!validation.success) {
      const errorMessage = validation.error.issues.map(
        (err) => err.message
      );

      return res.status(400).json({
        errors: errorMessage,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        errors: "User already registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashPassword,
    });

    await newUser.save();

    await generateTokenAndSaveInCookies(
      newUser._id,
      res
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Error registering user",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(400).json({
        errors: "Invalid email or password",
      });
    }

    await generateTokenAndSaveInCookies(
      user._id,
      res
    );

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Error logging user",
    });
  }
};

// LOGOUT
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      message: "Error logging out user",
    });
  }
};