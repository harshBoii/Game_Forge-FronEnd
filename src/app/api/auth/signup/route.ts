import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { generateToken } from "@/app/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    console.log("📝 Signup request received");
    
    let body;
    try {
      body = await req.json();
      console.log("✅ Request body parsed:", { 
        username: body.username, 
        name: body.name,
        passwordLength: body.password?.length 
      });
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { name, username, password } = body;

    // Validate required fields
    console.log("🔍 Validating required fields...");
    if (!name) {
      console.error("❌ Missing field: name");
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }
    if (!username) {
      console.error("❌ Missing field: username");
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }
    if (!password) {
      console.error("❌ Missing field: password");
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    // Validate username format
    console.log("🔍 Validating username format...");
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      console.error(`❌ Invalid username format: "${username}"`);
      return NextResponse.json(
        { 
          message: "Username must be 3-20 characters and contain only letters, numbers, and underscores" 
        },
        { status: 400 }
      );
    }

    // Validate password strength
    console.log("🔍 Validating password strength...");
    if (password.length < 6) {
      console.error(`❌ Password too short: ${password.length} characters`);
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if username already exists
    console.log("🔍 Checking if username exists...");
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      console.error(`❌ Username already taken: "${username}"`);
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 409 }
      );
    }

    // Hash the password
    console.log("🔐 Hashing password...");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    console.log("💾 Creating user in database...");
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
        createdAt: true,
      },
    });

    console.log("✅ User created successfully:", newUser.id);

    // Generate JWT token
    console.log("🔑 Generating JWT token...");
    const token = generateToken({
      userId: newUser.id,
      username: newUser.username,
    });

    console.log("✅ Signup completed successfully");

    return NextResponse.json(
      {
        message: "Account created successfully",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Unexpected signup error:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
