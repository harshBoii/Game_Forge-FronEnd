import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    console.log("💾 Save game request received");

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ Missing or invalid authorization header");
      return NextResponse.json(
        { message: "Unauthorized - missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      console.error("❌ Invalid or expired token");
      return NextResponse.json(
        { message: "Unauthorized - invalid token" },
        { status: 401 }
      );
    }

    console.log("✅ Token verified for user:", decoded.userId);

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { title, html, status } = body;

    console.log("🔍 Validating game data...");
    if (!title || !title.trim()) {
      console.error("❌ Missing field: title");
      return NextResponse.json(
        { message: "Game title is required" },
        { status: 400 }
      );
    }

    if (!html || !html.trim()) {
      console.error("❌ Missing field: html");
      return NextResponse.json(
        { message: "Game HTML is required" },
        { status: 400 }
      );
    }

    // Max 1MB validation
    if (html.length > 1024 * 1024) {
      console.error("❌ HTML too large");
      return NextResponse.json(
        { message: "Game HTML is too large (max 1MB)" },
        { status: 400 }
      );
    }

    // Validate title length
    if (title.trim().length > 255) {
      console.error("❌ Title too long");
      return NextResponse.json(
        { message: "Game title is too long (max 255 characters)" },
        { status: 400 }
      );
    }

    const validStatus = ["PUBLIC", "PRIVATE"];
    const gameStatus = status && validStatus.includes(status) ? status : "PRIVATE";

    console.log("💾 Creating game in database...");
    const game = await prisma.game.create({
      data: {
        title: title.trim(),
        html,
        status: gameStatus,
        userId: decoded.userId,
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    console.log("✅ Game saved successfully:", game.id);

    return NextResponse.json(
      {
        message: "Game saved to your library!",
        game,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Unexpected save error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
