import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req);

    res.send({
      ...result,
    });
  } catch (err) {
    next(err);
  }
}
