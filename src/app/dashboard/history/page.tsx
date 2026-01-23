"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Trophy, Calendar, Gift } from "lucide-react";
import toast from "react-hot-toast";

interface Participation {
  id: string;
  participatedAt: string;
  raffle: {
    id: string;
    title: string;
    prize: string;
    status: string;
    endDate: string;
    _count: {
      participants: number;
    };
  };
}

interface Win {
  id: string;
  position: number;
  wonAt: string;
  raffle: {
    id: string;
    title: string;
    prize: string;
  };
}

export default function HistoryPage() {
  const { data: session } = useSession();
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [wins, setWins] = useState<Win[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const [participationsRes, winsRes] = await Promise.all([
        fetch(`/api/users/${session?.user?.id}/participations`),
        fetch(`/api/users/${session?.user?.id}/wins`),
      ]);

      if (participationsRes.ok) {
        const participationsData = await participationsRes.json();
        setParticipations(participationsData.participations || []);
      }

      if (winsRes.ok) {
        const winsData = await winsRes.json();
        setWins(winsData.wins || []);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
      toast.error("Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchHistory();
    }
  }, [session?.user?.id, fetchHistory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Historial</h1>
        <p className="text-gray-600">Revisa tus participaciones y premios ganados</p>
      </div>

      {/* Premios Ganados */}
      {wins.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Premios Ganados
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {wins.map((win) => (
              <div
                key={win.id}
                className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{win.raffle.title}</h3>
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-bold">
                    #{win.position}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">
                  <Gift className="inline h-4 w-4 mr-1" />
                  {win.raffle.prize}
                </p>
                <p className="text-sm text-gray-600">
                  Ganado el {new Date(win.wonAt).toLocaleDateString("es-AR")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participaciones */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis Participaciones</h2>
        {participations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No has participado en sorteos
            </h3>
            <p className="text-gray-600">Comienza a participar para ver tu historial</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sorteo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participations.map((participation) => (
                  <tr key={participation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {participation.raffle.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{participation.raffle.prize}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          participation.raffle.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : participation.raffle.status === "FINISHED"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {participation.raffle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {participation.raffle._count.participants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(participation.participatedAt).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
