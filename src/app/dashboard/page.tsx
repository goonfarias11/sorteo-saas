"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Users, Gift, Clock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  imageUrl?: string;
  type: string;
  status: string;
  price: number;
  startDate: string;
  endDate: string;
  maxParticipants?: number;
  isPrivate: boolean;
  numWinners: number;
  _count: {
    participants: number;
    winners: number;
  };
}

export default function DashboardPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRaffles();
  }, []);

  const fetchRaffles = async () => {
    try {
      const response = await fetch("/api/raffles?status=ACTIVE");
      const data = await response.json();
      setRaffles(data.raffles);
    } catch (error) {
      toast.error("Error al cargar sorteos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sorteos Activos</h1>
        <p className="text-gray-600">Participa en los sorteos disponibles</p>
      </div>

      {raffles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay sorteos activos
          </h3>
          <p className="text-gray-600">Vuelve pronto para ver nuevos sorteos</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {raffles.map((raffle) => (
            <div key={raffle.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {raffle.imageUrl && (
                <Image
                  src={raffle.imageUrl}
                  alt={raffle.title}
                                    width={600}
                                    height={192}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{raffle.title}</h3>
                  {raffle.type === "FREE" ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Gratis
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      ${raffle.price}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{raffle.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Gift className="h-4 w-4" />
                    <span>Premio: {raffle.prize}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>
                      {raffle._count.participants} participantes
                      {raffle.maxParticipants && ` de ${raffle.maxParticipants}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Finaliza: {new Date(raffle.endDate).toLocaleDateString("es-AR")}</span>
                  </div>
                </div>

                <Link
                  href={`/raffles/${raffle.id}`}
                  className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
