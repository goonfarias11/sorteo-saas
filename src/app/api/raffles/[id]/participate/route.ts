import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Participar en sorteo
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
      const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para participar" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { accessCode } = body;

    // Obtener el sorteo
    const raffle = await prisma.raffle.findUnique({
      where: { id },
      include: {
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

    // Validaciones
    if (raffle.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "El sorteo no está activo" },
        { status: 400 }
      );
    }

    if (new Date() < raffle.startDate) {
      return NextResponse.json(
        { error: "El sorteo aún no ha comenzado" },
        { status: 400 }
      );
    }

    if (new Date() > raffle.endDate) {
      return NextResponse.json(
        { error: "El sorteo ha finalizado" },
        { status: 400 }
      );
    }

    if (raffle.isPrivate && raffle.accessCode !== accessCode) {
      return NextResponse.json(
        { error: "Código de acceso inválido" },
        { status: 400 }
      );
    }

    if (raffle.maxParticipants && raffle._count.participants >= raffle.maxParticipants) {
      return NextResponse.json(
        { error: "El sorteo ha alcanzado el máximo de participantes" },
        { status: 400 }
      );
    }

    // Verificar si ya participó
    const existingParticipation = await prisma.participant.findUnique({
      where: {
          userId_raffleId: {
            userId: session.user.id,
            raffleId: id,
          },
      },
    });

    if (existingParticipation) {
      return NextResponse.json(
        { error: "Ya estás participando en este sorteo" },
        { status: 400 }
      );
    }

    // Crear participación
    const participant = await prisma.participant.create({
      data: {
        userId: session.user.id,
        raffleId: id,
      },
    });

    return NextResponse.json(
      { message: "Participación registrada exitosamente", participant },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al participar en sorteo:", error);
    return NextResponse.json(
      { error: "Error al participar en sorteo" },
      { status: 500 }
    );
  }
}
