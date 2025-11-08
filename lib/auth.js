import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const encoder = new TextEncoder();
const secretKey = encoder.encode(JWT_SECRET);

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Generates a JWT using Web Crypto (works in Edge/runtime)
export async function generateToken(userId) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

// Verifies a JWT using Web Crypto (works in Edge/runtime)
export async function verifyToken(token) {
  try {
    console.log(
      "Verifying token with secret:",
      JWT_SECRET ? "SECRET_EXISTS" : "NO_SECRET"
    );
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    console.log("Token verified successfully:", payload);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

/**
 * Sets the auth cookie on the response.
 * Uses Next.js 13+ App Router cookie API.
 */
export function setAuthCookie(res, token) {
  // For Next.js 13+ with NextResponse
  res.cookies.set("auth-token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
  });
  return res;
}

/**
 * Clears the auth cookie on the response.
 * Uses Next.js 13+ App Router cookie API.
 */
export function clearAuthCookie(res) {
  res.cookies.set("auth-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return res;
}

export function getAuthToken(req) {
  // For Next.js 13+ App Router middleware, use cookies() API
  if (req.cookies) {
    return req.cookies.get("auth-token")?.value || null;
  }
  // Fallback for older API routes
  const cookies = req.headers?.cookie || "";
  const tokenMatch = cookies.match(/auth-token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}
