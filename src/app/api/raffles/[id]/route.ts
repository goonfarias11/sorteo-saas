import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Obtener detalles de un sorteo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const raffle = await prisma.raffle.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            participants: true,
            winners: true,
          },
        },
        winners: {
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
      },
    });

    if (!raffle) {
      return NextResponse.json(
        { error: "Sorteo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ raffle });
  } catch (error) {
    console.error("Error al obtener sorteo:", error);
    return NextResponse.json(
      { error: "Error al obtener sorteo" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar sorteo (solo admin)
export async function PUT(
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

    const body = await request.json();

    const raffle = await prisma.raffle.update({
      where: { id },
      data: {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      },
    });

    return NextResponse.json({ raffle });
  } catch (error) {
    console.error("Error al actualizar sorteo:", error);
    return NextResponse.json(
      { error: "Error al actualizar sorteo" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar sorteo (solo admin)
export async function DELETE(
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

    await prisma.raffle.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Sorteo eliminado" });
  } catch (error) {
    console.error("Error al eliminar sorteo:", error);
    return NextResponse.json(
      { error: "Error al eliminar sorteo" },
      { status: 500 }
    );
  }
}
