import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const raffleSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  prize: z.string().min(1, "El premio es requerido"),
  imageUrl: z.string().optional(),
  type: z.enum(["FREE", "PAID"]),
  price: z.number().min(0),
  startDate: z.string(),
  endDate: z.string(),
  maxParticipants: z.number().optional(),
  isPrivate: z.boolean(),
  accessCode: z.string().optional(),
  numWinners: z.number().min(1).default(1),
});

// GET - Listar sorteos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }

    const raffles = await prisma.raffle.findMany({
      where,
      include: {
        _count: {
          select: {
            participants: true,
            winners: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ raffles });
  } catch (error) {
    console.error("Error al obtener sorteos:", error);
    return NextResponse.json(
      { error: "Error al obtener sorteos" },
      { status: 500 }
    );
  }
}

// POST - Crear sorteo (solo admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = raffleSchema.parse(body);

    const raffle = await prisma.raffle.create({
      data: {
        title: data.title,
        description: data.description,
        prize: data.prize,
        imageUrl: data.imageUrl,
        type: data.type,
        price: data.price,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        maxParticipants: data.maxParticipants,
        isPrivate: data.isPrivate,
        accessCode: data.isPrivate ? data.accessCode : null,
        numWinners: data.numWinners,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ raffle }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error al crear sorteo:", error);
    return NextResponse.json(
      { error: "Error al crear sorteo" },
      { status: 500 }
    );
  }
}
