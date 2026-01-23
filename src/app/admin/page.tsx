"use client";

import { useEffect, useState } from "react";
import { Plus, Trophy, Users, Gift, TrendingUp } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Stats {
  totalRaffles: number;
  activeRaffles: number;
  finishedRaffles: number;
  totalParticipants: number;
}

interface Raffle {
  id: string;
  title: string;
  status: string;
  type: string;
  startDate: string;
  endDate: string;
  _count: {
    participants: number;
    winners: number;
  };
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    totalRaffles: 0,
    activeRaffles: 0,
    finishedRaffles: 0,
    totalParticipants: 0,
  });
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rafflesRes, statsRes] = await Promise.all([
        fetch("/api/raffles"),
        fetch("/api/admin/stats"),
      ]);

      if (rafflesRes.ok) {
        const data = await rafflesRes.json();
        setRaffles(data.raffles);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
    } catch (error) {
      toast.error("Error al cargar datos");
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
          <p className="text-gray-600">Gestiona sorteos y visualiza estadísticas</p>
        </div>
        <Link
          href="/admin/raffles/create"
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
        >
          <Plus className="h-5 w-5" />
          Crear Sorteo
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="h-8 w-8 text-purple-600" />
            <span className="text-3xl font-bold text-gray-900">{stats.totalRaffles}</span>
          </div>
          <p className="text-gray-600 font-medium">Total Sorteos</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <span className="text-3xl font-bold text-gray-900">{stats.activeRaffles}</span>
          </div>
          <p className="text-gray-600 font-medium">Sorteos Activos</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Gift className="h-8 w-8 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">{stats.finishedRaffles}</span>
          </div>
          <p className="text-gray-600 font-medium">Sorteos Finalizados</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 text-pink-600" />
            <span className="text-3xl font-bold text-gray-900">{stats.totalParticipants}</span>
          </div>
          <p className="text-gray-600 font-medium">Total Participantes</p>
        </div>
      </div>

      {/* Raffles Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Todos los Sorteos</h2>
        </div>
        {raffles.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay sorteos creados</h3>
            <p className="text-gray-600 mb-4">Crea tu primer sorteo para comenzar</p>
            <Link
              href="/admin/raffles/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              <Plus className="h-5 w-5" />
              Crear Sorteo
            </Link>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {raffles.map((raffle) => (
                <tr key={raffle.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{raffle.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        raffle.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : raffle.status === "FINISHED"
                          ? "bg-gray-100 text-gray-800"
                          : raffle.status === "CLOSED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {raffle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {raffle.type === "FREE" ? "Gratis" : "Pago"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {raffle._count.participants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(raffle.endDate).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/raffles/${raffle.id}`}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Ver Detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
