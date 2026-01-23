import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Exportar participantes a CSV (solo admin)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403 }
      );
    }

    const raffle = await prisma.raffle.findUnique({
      where: { id: params.id },
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
          orderBy: {
            participatedAt: "asc",
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

    // Generar CSV
    const csvHeader = "ID,Nombre,Email,Fecha de Participación\n";
    const csvRows = raffle.participants
      .map((p) => {
        const name = (p.user.name || "").replace(/,/g, ";");
        const email = p.user.email.replace(/,/g, ";");
        const date = new Date(p.participatedAt).toLocaleString("es-AR");
        return `${p.user.id},${name},${email},${date}`;
      })
      .join("\n");

    const csv = csvHeader + csvRows;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="participantes_${raffle.title.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error al exportar participantes:", error);
    return NextResponse.json(
      { error: "Error al exportar participantes" },
      { status: 500 }
    );
  }
}
