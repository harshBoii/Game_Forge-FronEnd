import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🎮 Fetch single game request for:", params.id);

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized - invalid token" },
        { status: 401 }
      );
    }

    console.log("✅ Token verified for user:", decoded.userId);

    const game = await prisma.game.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        html: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!game) {
      console.error("❌ Game not found");
      return NextResponse.json(
        { message: "Game not found" },
        { status: 404 }
      );
    }

    // Check if user owns the game (for private games)
    if (game.status === "PRIVATE" && game.user.username !== decoded.username) {
      console.error("❌ Unauthorized access to private game");
      return NextResponse.json(
        { message: "You don't have permission to access this game" },
        { status: 403 }
      );
    }

    console.log("✅ Game found and retrieved");

    return NextResponse.json(
      { game },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Fetch game error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
