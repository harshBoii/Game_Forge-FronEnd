import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    console.log("📚 Fetch games request received");

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ Missing authorization header");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      console.error("❌ Invalid token");
      return NextResponse.json(
        { message: "Unauthorized - invalid token" },
        { status: 401 }
      );
    }

    console.log("✅ Token verified for user:", decoded.userId);
    console.log("🔍 Fetching games for user:", decoded.userId);

    const games = await prisma.game.findMany({
      where: { userId: decoded.userId },
      select: {
        id: true,
        title: true,
        html: true,
        thumbnail: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("✅ Found", games.length, "games");

    return NextResponse.json(
      {
        message: "Games fetched successfully",
        games,
        total: games.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Fetch games error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
