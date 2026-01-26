Foodify – Full Stack Food Delivery Web App

Foodify is a full-stack food delivery web application built using the MERN stack, featuring a customer-facing frontend, an admin dashboard, and a RESTful backend API.
The project is deployed using modern cloud platforms and follows real-world deployment practices.

🚀 Live Demo

Frontend (User App): https://food-delivery-frontend-tawny.vercel.app

Backend API: https://foodify-food-delivery-app.onrender.com

Admin Panel: https://food-delivery-admin-lime.vercel.app/

⚠️ Note: The backend is hosted on Render (free tier) and may take 30–60 seconds to respond on the first request due to cold start.

🧩 Tech Stack
Frontend

React.js

Vite

Axios

CSS / Tailwind (if applicable)

Deployed on Vercel

Backend

Node.js

Express.js

MongoDB (Atlas)

JWT Authentication

REST API architecture

Deployed on Render

Database

MongoDB Atlas (Free Tier)

🔑 Core Features
User Features

Browse food items

Add/remove items from cart

Place orders

View order summary

Authentication (JWT-based)

Admin Features

Secure admin login

Add / update / delete food items

View orders

Manage food catalog

Backend Features

RESTful API design

Secure JWT authentication

Environment-based configuration

Proper CORS handling

Cloud database integration

🏗️ Project Architecture
Foodify/
├── frontend/        # User-facing React app
├── admin/           # Admin dashboard (React)
├── backend/         # Express + MongoDB API
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── index.js

🌍 Environment Variables
Backend (Render)
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key

Frontend & Admin (Vercel)
VITE_API_URL=https://foodify-food-delivery-app.onrender.com

🛠️ Local Setup (Optional)
Backend
cd backend
npm install
npm start

Frontend
cd frontend
npm install
npm run dev

Admin Panel
cd admin
npm install
npm run dev

🧠 Key Learnings

Real-world deployment of a full-stack MERN application

Handling environment variables across platforms

MongoDB Atlas configuration and IP whitelisting

CORS and cross-origin API communication

Cloud deployment limitations (cold starts, free tiers)

Separating frontend, backend, and admin concerns

📌 Notes

This project was initially developed locally and later adapted for cloud deployment.

The backend may sleep when inactive due to Render’s free tier limitations.

MongoDB Atlas free clusters may auto-pause when idle.

👤 Author

Kartik Chouhan

GitHub: https://github.com/KartikChouhan03

📄 License

This project is for educational and learning purposes.
