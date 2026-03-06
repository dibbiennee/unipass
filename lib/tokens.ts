import "server-only";
import { randomBytes } from "crypto";

/** Generate a cryptographically secure token */
export function generateToken(bytes: number = 32): string {
  return randomBytes(bytes).toString("hex");
}

/** Get download token expiry (48 hours from now) */
export function getDownloadExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 48);
  return expiry;
}
