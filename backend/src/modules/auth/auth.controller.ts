import { Request, Response } from "express";
import { registerUser, loginUser, getCurrentUser } from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await registerUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function me(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await getCurrentUser(
      req.userId
    );

    res.json(user);
  } catch (err: any) {
    res.status(401).json({
      message: err.message,
    });
  }
}
