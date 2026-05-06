# Sorteador Social SaaS

## Funciones

- Importar comentarios reales de Instagram
- Eliminar usuarios duplicados
- Elegir uno o varios ganadores
- Exportar CSV
- Persistencia local
- UI responsive

## Requisitos

- Node.js 20+
- Python 3.11+
- pip

## Instalación

```bash
npm install
pip install instagrapi
```

## Variables de entorno

Crear `.env`:

```env
IG_USERNAME=usuario_instagram
IG_PASSWORD=password_instagram
```

## Ejecutar

```bash
IG_USERNAME=tu_usuario IG_PASSWORD=tu_password npm run dev
```

Abrir:

http://localhost:3000

## Importante

Usar una cuenta secundaria de Instagram para evitar bloqueos.
