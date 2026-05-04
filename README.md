# Sorteador Social

Aplicacion simple para hacer sorteos de redes sociales. No tiene login, roles,
pagos, tenants ni base de datos: se usa desde una sola pantalla y guarda el
trabajo en el navegador.

## Que permite hacer

- Crear un sorteo con nombre y premio.
- Pegar un link de Instagram o TikTok para identificar el origen.
- Pegar participantes por linea o separados por coma.
- Importar comentarios desde archivos `.txt` o `.csv`.
- Eliminar duplicados automaticamente.
- Definir cantidad de ganadores.
- Ejecutar un sorteo aleatorio.
- Copiar, compartir o exportar los ganadores a CSV.

## Importacion desde redes

La app detecta links de Instagram y TikTok, pero la lectura automatica de
comentarios requiere integrar APIs oficiales con autenticacion.

- Instagram requiere integracion con Meta/Instagram API para acceder a
  comentarios de publicaciones autorizadas.
- TikTok ofrece acceso a comentarios mediante Research API, con aprobacion y
  token.

Por eso esta version deja el flujo preparado y ofrece un camino inmediato:
pegar comentarios manualmente o importar una exportacion `.txt/.csv`.

## Arquitectura simplificada

```text
index.html        # Estructura de la app
styles.css        # Interfaz responsive
app.js            # Parser, importacion, sorteo, localStorage, CSV y compartir
server.mjs        # Servidor local opcional
scripts/check.mjs # Chequeo basico
```

## Requisitos

- Para usarla: cualquier navegador moderno.
- Para correr el servidor local opcional: Node.js 20 o superior recomendado.

## Ejecutar localmente

Opcion directa:

- Abrir `index.html` en el navegador.

Opcion con servidor local:

```bash
npm run dev
```

Abrir la URL que muestra la terminal. Si no hay una variable `PORT`, usa
`http://localhost:3000`.

## Chequeo

```bash
npm run check
```

No hay paso de build ni dependencias externas.

## Estado del refactor

Se elimino la version SaaS original:

- NextAuth y pantallas de login/registro.
- Paneles de admin y dashboard.
- API routes.
- Prisma, SQLite y modelos de usuarios/pagos.
- Roles, sorteos pagos, estados complejos y suscripciones.

La app final prioriza claridad y uso inmediato para una sola persona.
