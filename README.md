# Plataforma de Sorteos Online 🎉

Una plataforma web completa para gestionar sorteos online de forma segura, transparente y escalable.

## 🚀 Características

### Para Usuarios
- ✅ Registro e inicio de sesión (credenciales, Google OAuth)
- 🎟️ Participación en sorteos activos
- 📊 Historial de participaciones
- 🏆 Visualización de premios ganados
- 🔒 Sorteos públicos y privados con código de acceso

### Para Administradores
- 📝 CRUD completo de sorteos
- ⚙️ Configuración flexible de sorteos:
  - Sorteos gratuitos o pagos
  - Uno o múltiples ganadores
  - Límite de participantes
  - Fechas de inicio y fin
  - Sorteos públicos o privados
- 🎲 Ejecución de sorteos con algoritmo justo y verificable
- 📈 Dashboard con métricas y estadísticas
- 👥 Visualización de participantes
- 📥 Exportación de participantes a CSV
- 🎯 Gestión de ganadores

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS + Lucide Icons
- **Backend:** API Routes + Server Actions
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Autenticación:** NextAuth.js
- **Pagos:** MercadoPago (opcional)
- **Notificaciones:** React Hot Toast

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd sorteo
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sorteo_db?schema=public"

# NextAuth
NEXTAUTH_SECRET="tu-clave-secreta-muy-segura"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="tu-client-id"
GOOGLE_CLIENT_SECRET="tu-client-secret"

# MercadoPago (opcional)
MERCADOPAGO_ACCESS_TOKEN="tu-access-token"
MERCADOPAGO_PUBLIC_KEY="tu-public-key"
```

### 4. Configurar base de datos

#### Opción A: PostgreSQL local
```bash
# Instalar PostgreSQL en tu sistema
# Crear base de datos
createdb sorteo_db
```

#### Opción B: PostgreSQL con Docker
```bash
docker run --name sorteo-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sorteo_db -p 5432:5432 -d postgres
```

### 5. Ejecutar migraciones de Prisma
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6. (Opcional) Seed de datos
Crea un usuario administrador:

```bash
npx prisma studio
```

Luego crea manualmente un usuario y cambia su rol a `ADMIN`.

### 7. Iniciar servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
sorteo/
├── prisma/
│   └── schema.prisma          # Schema de base de datos
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Autenticación
│   │   │   ├── raffles/       # CRUD de sorteos
│   │   │   ├── users/         # Endpoints de usuarios
│   │   │   └── admin/         # Endpoints admin
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── dashboard/         # Dashboard de usuarios
│   │   ├── admin/             # Panel administrador
│   │   ├── raffles/           # Páginas de sorteos
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/            # Componentes reutilizables
│   ├── lib/
│   │   ├── prisma.ts          # Cliente de Prisma
│   │   ├── auth.ts            # Configuración de NextAuth
│   │   └── raffle-algorithm.ts # Algoritmo de sorteo
│   └── types/                 # Tipos de TypeScript
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🎲 Algoritmo de Sorteo

El sistema utiliza un algoritmo criptográficamente seguro para seleccionar ganadores:

- Usa `crypto.randomBytes` de Node.js para generar números aleatorios
- Implementa Fisher-Yates Shuffle para garantizar distribución uniforme
- Genera y almacena un seed aleatorio para trazabilidad
- Guarda metadata completa: fecha de ejecución, participantes, semilla aleatoria

## 🔐 Seguridad

- ✅ Autenticación con NextAuth.js
- ✅ Middleware para protección de rutas
- ✅ Validación de datos con Zod
- ✅ Hashing de contraseñas con bcryptjs
- ✅ Sanitización de inputs
- ✅ Protección CSRF
- ✅ Verificación de roles (USER/ADMIN)

## 📊 Modelos de Datos

### User
- Información de usuario
- Rol (USER/ADMIN)
- Relaciones con participaciones y premios

### Raffle
- Información del sorteo
- Configuración (tipo, precio, fechas, límites)
- Estados: DRAFT, ACTIVE, CLOSED, FINISHED

### Participant
- Registro de participaciones
- Relación usuario-sorteo única

### Winner
- Registro de ganadores
- Posición del premio
- Estado de notificación y reclamo

### Payment (opcional)
- Registro de pagos con MercadoPago

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel Dashboard
```

#### Redeploy rápido
Si ya está conectado a GitHub, cada `git push` a `main` dispara un build. Para forzar un redeploy manual del último commit:

```bash
vercel pull --yes --environment=production
vercel build
vercel deploy --prebuilt
```

Último redeploy solicitado: 2026-01-23 20:06 UTC.

### Docker

```bash
# Build
docker build -t sorteo-platform .

# Run
docker run -p 3000:3000 sorteo-platform
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

## 🔄 Flujo de Trabajo

### Crear Sorteo (Admin)
1. Panel Admin → Crear Sorteo
2. Configurar todos los parámetros
3. Guardar como DRAFT
4. Cambiar estado a ACTIVE cuando esté listo

### Participar en Sorteo (Usuario)
1. Ver sorteos activos
2. Seleccionar sorteo
3. (Si es privado) Ingresar código de acceso
4. Confirmar participación
5. Ver confirmación

### Ejecutar Sorteo (Admin)
1. Panel Admin → Ver Sorteo
2. Verificar participantes
3. Ejecutar Sorteo
4. Sistema selecciona ganadores automáticamente
5. Ver resultados y exportar

## 🎨 Personalización

### Colores
Edita `tailwind.config.ts` para cambiar la paleta de colores.

### Estilos
Los estilos globales están en `src/app/globals.css`.

### Logo y Branding
Reemplaza el componente Trophy con tu logo personalizado.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o soporte, abre un issue en el repositorio.

---

**Desarrollado con ❤️ usando Next.js 14**
