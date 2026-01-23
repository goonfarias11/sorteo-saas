import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalRaffles, activeRaffles, finishedRaffles, totalParticipants] =
      await Promise.all([
        prisma.raffle.count(),
        prisma.raffle.count({ where: { status: "ACTIVE" } }),
        prisma.raffle.count({ where: { status: "FINISHED" } }),
        prisma.participant.count(),
      ]);

    return NextResponse.json({
      stats: {
        totalRaffles,
        activeRaffles,
        finishedRaffles,
        totalParticipants,
      },
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
