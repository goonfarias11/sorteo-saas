import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
      const { id } = await params;
    const wins = await prisma.winner.findMany({
      where: { userId: id },
      include: {
        raffle: {
          select: {
            id: true,
            title: true,
            prize: true,
          },
        },
      },
      orderBy: {
        wonAt: "desc",
      },
    });

    return NextResponse.json({ wins });
  } catch (error) {
    console.error("Error al obtener premios:", error);
    return NextResponse.json(
      { error: "Error al obtener premios" },
      { status: 500 }
    );
  }
}
