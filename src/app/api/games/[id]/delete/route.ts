import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/jwt";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const params = await context.params;
    console.log("🗑️ Delete game request received for:", params.id);

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

    // Verify game belongs to user
    console.log("🔍 Verifying game ownership...");
    const game = await prisma.game.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!game) {
      console.error("❌ Game not found");
      return NextResponse.json(
        { message: "Game not found" },
        { status: 404 }
      );
    }

    if (game.userId !== decoded.userId) {
      console.error("❌ Unauthorized - game belongs to different user");
      return NextResponse.json(
        { message: "You don't have permission to delete this game" },
        { status: 403 }
      );
    }

    console.log("💾 Deleting game...");
    await prisma.game.delete({
      where: { id: params.id },
    });

    console.log("✅ Game deleted successfully");

    return NextResponse.json(
      { message: "Game deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
