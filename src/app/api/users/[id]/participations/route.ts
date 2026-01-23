import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
      const { id } = await params;
    const participations = await prisma.participant.findMany({
      where: { userId: id },
      include: {
        raffle: {
          select: {
            id: true,
            title: true,
            prize: true,
            status: true,
            endDate: true,
            _count: {
              select: {
                participants: true,
              },
            },
          },
        },
      },
      orderBy: {
        participatedAt: "desc",
      },
    });

    return NextResponse.json({ participations });
  } catch (error) {
    console.error("Error al obtener participaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener participaciones" },
      { status: 500 }
    );
  }
}
