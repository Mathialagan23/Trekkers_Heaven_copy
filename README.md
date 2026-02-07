# Trekkers Heaven

Trekkers Heaven is a **full-stack MERN travel planning application** that helps users plan trips,

## Project Structure

```
Trekkers_Heaven/
│
├── client/ # React frontend (Vite)
│ ├── src/
│ ├── public/
│ └── vite.config.js
│
├── server/ # Express backend
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── utils/
│ │ └── app.js
│ └── server.js
│
└── README.md
```

## Features

- 🔐 User Authentication (JWT-based)
- 🧭 Itinerary Management (Trip-specific)
- 💰 Expense Tracking with Budget & Warnings
- ✈️ Flights / 🚌 Bus / 🚆 Train / 🏨 Accommodation (linked to itinerary)
- 💱 Currency Support (INR / USD)
- 📊 Budget usage percentage & alerts
- 📝 Travel Blogs (Public + Personal)
- 📍 Map View (Destinations)
- 📱 Responsive UI (Desktop & Mobile)
- 🌐 Deployed-ready (Vercel + Render + MongoDB Atlas)

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- React Icons
- Google Maps JavaScript API

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- bcrypt

## Setup Instructions

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `config.env` file in `server/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
<!-- VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key Optional -->
```

4. Start the development server:
```bash
npm run dev
```

## Backend API Overview

Trekkers Heaven uses a RESTful API secured with JWT authentication.

### Core Modules
- Authentication (JWT-based)
- Itineraries (Trip planning & budgets)
- Expenses (Trip-based expense tracking)
- Accommodations (Hostel/Hotel stays)
- Flights, Buses, Trains (Travel bookings)
- Blogs (Public travel experiences)

All protected routes require a valid JWT token in the `Authorization` header.

### Example Protected Request
```http
GET /api/itineraries
Authorization: Bearer <JWT_TOKEN>
```

### Deployment

- Frontend: Deploy to Vercel
- Backend: Deploy to Render
- MongoDB Atlas

Make sure to update environment variables in your deployment platforms.

