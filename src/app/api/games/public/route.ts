import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: {
        status: "PUBLIC",
      },
      select: {
        id: true,
        title: true,
        html: true,
        thumbnail: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ games });
  } catch (error) {
    console.error("❌ Error fetching public games:", error);
    return NextResponse.json(
      { message: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
