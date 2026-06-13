import { Request } from "express";

export function getParam(req: Request, key: string): string {
  const value = req.params[key];

  if (!value) {
    throw new Error(`Missing route param: ${key}`);
  }

  return Array.isArray(value) ? value[0] : value;
}