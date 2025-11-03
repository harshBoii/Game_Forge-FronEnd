import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/jwt";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("✏️ Update game request received for:", params.id);

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

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { title, status } = body;

    // Verify game belongs to user
    const game = await prisma.game.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!game) {
      return NextResponse.json(
        { message: "Game not found" },
        { status: 404 }
      );
    }

    if (game.userId !== decoded.userId) {
      return NextResponse.json(
        { message: "You don't have permission to update this game" },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (title && title.trim()) {
      updateData.title = title.trim();
    }
    if (status && ["PUBLIC", "PRIVATE"].includes(status)) {
      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    console.log("💾 Updating game...");
    const updatedGame = await prisma.game.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log("✅ Game updated successfully");

    return NextResponse.json(
      {
        message: "Game updated successfully",
        game: updatedGame,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
