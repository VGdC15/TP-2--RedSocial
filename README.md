# 🎵 Red Social de Fiestas Electrónicas — Angular · NestJS · MongoDB
Segundo examen de programación IV, de la tecnicatura de programación UTN.

> Publicaciones · Perfiles · Likes · Comentarios (con edición) · Audio Player · Dashboard Admin · Roles · Moderación

---

## 🔗 Demo

**Live:** 
**API:** 

---

## ✨ Características

* **Feed de publicaciones** con texto, imágenes y comentarios.
* **Reproductor de música** integrado.
* **Perfil de usuario** (foto, bio, redes, historial de posts).
* **Likes** (optimistas), **comentarios** y **edición de comentarios**.
* **Eliminar publicaciones propias**; ver publicaciones de otros usuarios.
* **Roles y permisos**: `admin` y `miembro`.
* **Dashboard Admin**: alta/baja de admins y miembros, moderación de contenidos.
* **Notificaciones en vivo** vía WebSockets: nuevos likes, nuevos comentarios.
* **Responsive** y accesible.

---

## 🖼️ Screenshots

| Vista                  | Imagen                                                     |
| ---------------------- | ---------------------------------------------------------- |
| Home / Feed            | <img src="screenshots/feed.jpg" width="300"/>              |
| Reproductor            | <img src="screenshots/player.jpg" width="300"/>            |
| Perfil de usuario      | <img src="screenshots/perfil.jpg" width="300"/>            |
| Post con comentarios   | <img src="screenshots/post-comentarios.jpg" width="300"/>  |
| Edición de comentarios | <img src="screenshots/editar-comentario.jpg" width="300"/> |
| Likes                  | <img src="screenshots/likes.jpg" width="300"/>             |
| Crear publicación      | <img src="screenshots/nuevo-post.jpg" width="300"/>        |
| Dashboard Admin        | <img src="screenshots/admin-dashboard.jpg" width="300"/>   |
| Gestión de usuarios    | <img src="screenshots/admin-usuarios.jpg" width="300"/>    |

---

## 📦 Tech

* **Frontend:** Angular, TypeScript, CSS.
* **Backend:** NestJS (REST), Mongoose.
* **DB:** MongoDB (Atlas).
* **Realtime (opcional):** Socket.IO.

---

## 🔐 Autenticación y Roles

* **JWT** con refresh (opcional) · cookies httpOnly o localStorage (según preferencia).
* Roles: `admin` y `miembro`. Guards/Decorators (Nest) para proteger rutas.

---

## 🔌 Endpoints API (resumen)

* `POST /auth/login` · `POST /auth/register` · `POST /auth/refresh`
* `GET /users/me` · `PATCH /users/me`
* `GET /posts` · `POST /posts` · `DELETE /posts/:id`
* `GET /posts/:id/comments` · `POST /posts/:id/comments` · `PATCH /comments/:id`
* `POST /posts/:id/like` · `DELETE /posts/:id/like`
* `GET /media/stream/:id` (audio) · `POST /media/upload` (imágenes/audio)
* `GET /admin/users` · `PATCH /admin/users/:id/role` (solo admin)

---

## ⚙️ Configuración

### Frontend (Angular)

`frontend/src/environments/environment.ts`

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',
  wsUrl: 'ws://localhost:3000'
};
```

`frontend/src/environments/environment.prod.ts`

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://tu-backend.com',
  wsUrl: 'wss://tu-backend.com'
};
```

### Backend (NestJS)

`.env.example`

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/electro-social
JWT_SECRET=tu_clave_segura
STORAGE_DRIVER=local   # local | s3 | cloudinary
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
CLOUDINARY_URL=
CLIENT_ORIGIN=http://localhost:4200
```

---

## 🚀 Arranque rápido (dev)

### Requisitos

* Node 18+ · npm 9+
* MongoDB local o Atlas

### Pasos

```bash
# 1) Backend
cd backend
cp .env.example .env
npm i
npm run start:dev

# 2) Frontend
cd ../frontend
npm i
ng serve -o
```

---

## 🗺️ Roadmap

* [ ] Reacciones múltiples (🔥🎧🌙)
* [ ] Búsqueda por artistas/hashtags/venues
* [ ] Moderación asistida (flag/razones)
* [ ] PWA (installable + offline básico)

---

## 📬 Contacto

* **Autora:** Verónica Castillo
* **LinkedIn:** [https://www.linkedin.com/in/veronica-l-castillo](https://www.linkedin.com/in/veronica-l-castillo)
* **GitHub:** [https://github.com/VGdC15](https://github.com/VGdC15)

---


