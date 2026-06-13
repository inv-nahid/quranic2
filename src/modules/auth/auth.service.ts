import { prisma } from "../../config/prisma";
import { hashPassword, comparePassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";

export async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashed,
    },
  });

  const token = signToken({ userId: user.id });

  return { user, token };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ userId: user.id });

  return { user, token };
}
