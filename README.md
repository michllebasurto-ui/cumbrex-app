# 🏔️ Cumbrex App — Dashboard/Editor SPA

Panel de administración SaaS multi-tenant para la plataforma **Cumbrex**. Permite a los usuarios de cada tenant editar su landing page en tiempo real mediante un editor visual con iframe + postMessage.

Construido con **React 19 + Vite + TypeScript + Tailwind CSS 4**.

---

## 🏗️ Arquitectura

```
cumbrex.lat
├── api.cumbrex.lat         → .NET 8 Web API
├── clienteA.cumbrex.lat    → Landing SSR Astro 5
└── clienteA.cumbrex.lat/app → Este dashboard SPA
```

## 🚀 Cómo correr localmente

```bash
git clone https://github.com/michllebasurto-ui/cumbrex-app.git
cd cumbrex-app
npm install
npm run dev
```

URL: `http://localhost:5173/app?tenant=acme`

## 🎭 Mock Mode — Sin backend

Funciona completamente sin backend.

### Usuarios demo

| Email | Contraseña | Tenant |
|-------|-----------|--------|
| `acme@cumbrex.lat` | `Demo123!` | acme |
| `globex@cumbrex.lat` | `Demo123!` | globex |

## 🌍 Variables de entorno

```
VITE_API_URL=http://localhost:5000
VITE_LANDING_URL=http://localhost:4321
VITE_DOMAIN=localhost
```

## ⭐ Editor visual — iframe + postMessage

```
┌──────────────┬──────────────────────────────────┐
│ ⚙️ General   │                                  │
│ 🦸 Hero [ON] │       iframe preview              │
│ ✨ Features  │  (Astro Landing en tiempo real)   │
│ 💬 Testimonios│                                  │
│ 💰 Precios   │  postMessage:                    │
│ 📄 Footer    │   UPDATE_COLORS                  │
│              │   UPDATE_COMPONENT               │
│ [💾 Guardar] │   TOGGLE_COMPONENT               │
│ [🚀 Publicar]│                                  │
└──────────────┴──────────────────────────────────┘
```

## ☁️ Deploy a Azure Storage

El workflow `.github/workflows/deploy-app.yml` automatiza el deploy a Azure Storage + purge de Front Door cache.

## 🛠️ Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Producción
npm run lint     # Lint
npm run preview  # Preview build
```
