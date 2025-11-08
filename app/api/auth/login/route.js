import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { comparePasswords, generateToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/models";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Get user from database
    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password (database stores as password_hash with underscore)
    const isValidPassword = await comparePasswords(
      password,
      user.password_hash
    );
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await generateToken(user._id.toString());
    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
      },
    });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
