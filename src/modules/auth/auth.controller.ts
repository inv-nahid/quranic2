import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";

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
