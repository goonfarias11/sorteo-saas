import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { executeRaffle, validateRaffleExecution } from "@/lib/raffle-algorithm";

// POST - Ejecutar sorteo (solo admin)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403 }
      );
    }

    // Obtener sorteo con participantes
    const raffle = await prisma.raffle.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!raffle) {
      return NextResponse.json(
        { error: "Sorteo no encontrado" },
        { status: 404 }
      );
    }

    // Validar que el sorteo pueda ejecutarse
    const validation = validateRaffleExecution(raffle);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Ejecutar algoritmo de sorteo
    const result = executeRaffle(raffle.participants, raffle.numWinners);

    // Guardar ganadores en la base de datos
    await prisma.$transaction(async (tx) => {
      // Crear registros de ganadores
      for (let i = 0; i < result.winners.length; i++) {
        await tx.winner.create({
          data: {
            userId: result.winners[i].userId,
            raffleId: id,
            position: i + 1,
          },
        });
      }

      // Actualizar sorteo
      await tx.raffle.update({
        where: { id },
        data: {
          status: "FINISHED",
          executedAt: result.executedAt,
          executedBy: session.user.id,
          randomSeed: result.randomSeed,
        },
      });
    });

    return NextResponse.json({
      message: "Sorteo ejecutado exitosamente",
      result: {
        winners: result.winners.map((w, i) => ({
          position: i + 1,
          userId: w.userId,
          name: w.user.name,
          email: w.user.email,
        })),
        totalParticipants: result.totalParticipants,
        randomSeed: result.randomSeed,
        executedAt: result.executedAt,
      },
    });
  } catch (error) {
    console.error("Error al ejecutar sorteo:", error);
    return NextResponse.json(
      { error: "Error al ejecutar sorteo" },
      { status: 500 }
    );
  }
}
