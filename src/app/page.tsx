import Link from "next/link";
import { Trophy, Gift, Users, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">Sorteos Online</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Participa en Sorteos <span className="text-purple-600">Seguros</span> y{" "}
            <span className="text-pink-600">Transparentes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            La plataforma más confiable para sorteos online. Crea, participa y gana de forma justa.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/raffles"
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-lg"
            >
              Ver Sorteos Activos
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 font-medium text-lg"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sorteos Variados</h3>
            <p className="text-gray-600">
              Participa en sorteos gratuitos y pagos. Múltiples premios y categorías disponibles.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">100% Transparente</h3>
            <p className="text-gray-600">
              Algoritmo de selección aleatorio y verificable. Todos los sorteos son auditables.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidad Activa</h3>
            <p className="text-gray-600">
              Miles de participantes en cada sorteo. Únete a nuestra comunidad de ganadores.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Sorteos Realizados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">10k+</div>
              <div className="text-gray-600">Usuarios Registrados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">5k+</div>
              <div className="text-gray-600">Ganadores Felices</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Seguro y Confiable</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2026 Sorteos Online. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
