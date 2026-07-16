import type { Request } from "express";
import User from "../../models/user.model.js";

import jwt from "jsonwebtoken";

export const authService = {
  async login(req: Request) {
    const { google_id, name, email, avatar } = req.body;

    if (!google_id || !email) {
      throw new Error("Google id and email are required");
    }

    let user = await User.findOne({
      where: {
        google_id,
      },
    });

    if (!user) {
      user = await User.create({
        google_id,
        name,
        email,
        avatar,
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    return {
      user,
      token,
    };
  },
};
