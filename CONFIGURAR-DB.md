# ⚙️ Configuración de Base de Datos

## ✅ Estado Actual
- ✅ Dependencias instaladas correctamente
- ✅ Archivo `.env` creado
- ⏳ Falta configurar PostgreSQL

## 🐘 Opción 1: PostgreSQL con Docker (Recomendado)

### 1. Instalar Docker Desktop
Descarga e instala desde: https://www.docker.com/products/docker-desktop

### 2. Ejecutar PostgreSQL
```bash
docker run --name sorteo-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sorteo_db -p 5432:5432 -d postgres:16-alpine
```

### 3. Verificar que esté corriendo
```bash
docker ps
```

---

## 🔧 Opción 2: PostgreSQL Local (Sin Docker)

### 1. Descargar PostgreSQL
https://www.postgresql.org/download/windows/

### 2. Instalar con configuración:
- Puerto: `5432`
- Usuario: `postgres`
- Contraseña: `password` (o la que prefieras)

### 3. Crear base de datos
Abre pgAdmin o usa la terminal:
```sql
CREATE DATABASE sorteo_db;
```

### 4. Actualizar .env si usas otra contraseña
Si elegiste otra contraseña, edita `.env`:
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/sorteo_db?schema=public"
```

---

## 📊 Opción 3: Base de Datos en la Nube (GRATIS)

### Usando Neon (PostgreSQL serverless)

1. Ve a https://neon.tech
2. Crea una cuenta gratis
3. Crea un nuevo proyecto llamado "sorteo"
4. Copia la connection string que te dan
5. Pégala en el archivo `.env`:
```env
DATABASE_URL="postgresql://usuario:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

---

## 🚀 Una vez tengas PostgreSQL configurado:

### 1. Ejecutar migraciones
```bash
npx prisma migrate dev --name init
```

### 2. Verificar conexión
```bash
npx prisma studio
```
Esto abrirá una interfaz web en http://localhost:5555

### 3. Crear usuario administrador
En Prisma Studio:
- Tabla `User` → Add record
- Completa:
  - email: tu@email.com
  - name: Tu Nombre
  - password: (deja vacío por ahora)
  - role: ADMIN
- Guarda

### 4. Iniciar el proyecto
```bash
npm run dev
```

### 5. Abrir en el navegador
http://localhost:3000

---

## 🆘 Solución de Problemas

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Revisa que el puerto 5432 esté disponible
- Confirma que la contraseña en `.env` sea correcta

### Error: "SSL connection required"
Si usas Neon u otra DB en la nube, agrega `?sslmode=require` al final de la URL

### Error al ejecutar migraciones
```bash
# Resetear base de datos
npx prisma migrate reset

# Volver a migrar
npx prisma migrate dev --name init
```

---

## 📝 Próximos Pasos

1. **Elige UNA de las 3 opciones arriba**
2. **Ejecuta las migraciones de Prisma**
3. **Crea un usuario administrador**
4. **Inicia el servidor con `npm run dev`**

¡Tu plataforma estará lista para usar! 🎉
