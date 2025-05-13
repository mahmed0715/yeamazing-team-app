# 🧩 TeamHub — Full-Stack Team Collaboration App

**TeamHub** is a full-stack team collaboration platform designed to streamline communication and task management within teams. It features real-time 1-on-1 messaging, file sharing, and robust role-based access control for Admins, Managers, and Members.

# Demo video
https://www.loom.com/share/631295b050d3447a9206e98f9c771fcc
---

## 🚀 Features

- 🔐 **Role-Based Access Control**
- Admin will have an extra menu item in sidebar for user management, no other user can access that, URL : `/admin/users`
- Please login as admin user: email/pwd: admin@gmail.com / admin

  - Supports `Admin`, `Manager`, and `Member` roles
  - Admins can assign and manage user roles

- 🗃️ **Database & ORM**

  - Built with **PostgreSQL** and **Prisma ORM**
  - Core models: `User`, `Message`, `Conversation` etc

- 🧩 **API Routes**

  - Built using **Next.js App Router**
  - RESTful API endpoints following security best practices

- 📤 **File Upload**

  - Upload and share **images, documents, and PDFs**
  - Supports third-party storage providers: Cloudinary, using next-cloudinary

- ✅ **Input Validation**

  - Uses **Zod** for type-safe validation on both client and server

- 💬 **Real-Time 1-on-1 Chat**
  - Authenticated users can chat in real-time
  - Chats are stored persistently in the database
  - Powered by **Pusher**

## Deployed App

https://yeamazing-team-app.onrender.com/ 

## Listed Features

### 1. Real-time Messaging using Pusher

The application leverages Pusher to enable real-time messaging between users, ensuring messages are delivered instantly.

### 2. Message Notifications and Alerts

Users receive notifications and alerts for new messages and other important events, keeping them informed at all times.

### 3. Tailwind Design for Sleek UI

The project utilizes Tailwind CSS to create a modern and visually appealing user interface.

### 4. Tailwind Animations and Transition Effects

Enhance the user experience with smooth animations and transition effects created using Tailwind CSS.

### 5. Full Responsiveness for All Devices

The application is designed and optimized to be fully responsive, allowing users to access and use it seamlessly on various devices.

### 6. Credential Authentication with NextAuth

User authentication is implemented using NextAuth, allowing users to sign up, log in, and manage their accounts securely.

### 7. Google Authentication Integration

Users have the option to sign in using their Google accounts, providing a convenient and quick login process.

### 8. File and Image Upload using Cloudinary CDN

Users can upload files and images to the application using the Cloudinary CDN service, making it easy to share media.

### 9. Client Form Validation and Handling using react-hook-form and zod

Form validation and handling on the client-side are managed using the powerful `react-hook-form` library with ZOD
Api routes are validated using ZOD as well.

### 10. Server Error Handling with react-toast

Error handling on the server-side is implemented with `react-toast`, providing clear and informative error messages to users.

### 11. Message Read Receipts

Users can see if their messages have been read by other recipients, providing insight into the message's status.

### 12. Online/Offline User Status

The application displays the online/offline status of users, making it easier to know who is currently active.

### 13. One-on-One Messaging

Users can engage in one-on-one messaging, supporting various communication scenarios.

### 14. Message Attachments and File Sharing

Files and attachments can be shared within the messaging platform, allowing users to exchange various media types using cloudinary

### 15. User Profile Customization and Settings

Users can customize their profiles and manage settings to personalize their experience.

### 16. Writing POST, GET, and DELETE Routes in Route Handlers (app/api)

The project includes examples and guides on writing various API routes to handle data interactions.

### 17. Fetching Data in Server React Components Directly from the Database (WITHOUT API!)

The project demonstrates how to fetch data directly from the database in server-side React components, without relying on APIs.

### 18. Handling Relations between Server and Child Components in a Real-time Environment

Learn how to manage and handle relations between server and child components in a real-time messaging environment.

### 19. Creating and Managing Chat Rooms and Channels

The application supports the creation and management of chats.

### 20. Admin panel: Manage users role, admin only, RBACK

The application supports the management of user roles.

### Prerequisites

**Node version 14.x**

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Node.js, Next.js Route Handlers
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js (Google)
- **Real-Time:** Pusher
- **Validation:** Zod
- **File Upload:** Cloudinary

### Cloning the repository

```shell
git clone https://github.com/mahmed0715/yeamazing-team-app
```

### Install packages

```shell
npm i
```

### Setup .env file, or copy env example file to .env and set these env variables properly

```js
DATABASE_URL =
  "postgresql://aa:aa@ep-bold-star-77549996.us-west-2.aws.neon.tech/neondb?sslmode=require";
NEXTAUTH_SECRET = "asdadsadsadsads";
NEXTAUTH_URL = "http://localhost:3000";
PUSHER_APP_ID = "aa";
PUSHER_SECRET = "aa";
NEXT_PUBLIC_PUSHER_APP_KEY = "aa";

NEXT_PUBLIC_CLOUDINARY_API_KEY = "aa";
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "aa";
CLOUDINARY_API_SECRET = "aa";

GOOGLE_CLIENT_ID = "56110261084-aa.apps.googleusercontent.com";
GOOGLE_CLIENT_SECRET = "GOCSPX-aa";
```
# Please ask for the real env variabales used in the deployed version.

### Setup Prisma

```shell
npx prisma db push

```

### Start the app

```shell
npm run build
npm start

# for develoment 
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
