****🍔 FoodieExpress – Complete Project Documentation**

FoodieExpress is a powerful, feature-rich MERN stack food delivery application where Users, Food Store Owners, and Delivery Boys can create accounts and interact with a real-time order delivery system, including live tracking, online payments, Cloudinary image management, and role‑based dashboards.

---

 1. Project Information

🧾 Project Name: FoodieExpress

🛠 Tech Stack: MERN Stack

📚 Libraries & Tools Used:

Frontend:

* React 
* Redux Toolkit 
* React Redux 
* React Router 
* Tailwind CSS 
* @tailwindcss/vite
* Axios 
* React Icons 
* Lucide React 
* Framer Motion 
* Recharts 
* React Spinners 
* Leaflet  & React Leaflet  (map tracking)
* Firebase  (location tracking)
* Socket.io-client 

Backend:

* Node.js
* Express.js
* MongoDB + Mongoose
* Multer ^2.0.2 (file handling)
* Cloudinary ^2.7.0 (image hosting)
* Firebase (real-time tracking)
* Razorpay (payment integration)
* Socket.io (real-time updates)

---

 2. Key Features Overview

⭐ Role-Based System (3 Types of Users)

👤 1. Normal User

* Signup/Login
* Browse food stores in their city only
* Place order (COD / Razorpay online payment)
* See live tracking once delivery boy accepts the order
* Update profile info + profile picture

### 🏪 2. Food Store Owner

* Create restaurant/store
* Add/edit/delete food items
* Get real-time orders using Socket.io
* Update order status:

  * Pending → Preparing → Out for Delivery → Delivered
* Update personal info + profile picture

 🛵3. Delivery Boy

* Get live new order notifications via Socket.io
* Accept or reject orders
* Share live location using Firebase + Leaflet map
* Update delivery progress
* Update profile + picture

---

 3. Major Functionalities

🔥 A. Real-Time Features (Socket.io)**

* Owner receives live incoming orders
* Delivery boy receives new order popups instantly
* Users see live order status updates


---

 🗺️ B. Live Tracking System

* Delivery boy location tracked in real-time using Firebase
* User sees moving marker on map (Leaflet)
* Owner tracks both the order & delivery boy

---

 💰 C. Payment Integration (Razorpay)

* Secure online payment support
* COD available


---

## 🖼️ **D. Cloudinary Image Upload**

* Multer for handling form-data
* Cloudinary for image storage
* Profile picture support for all roles
* Auto-delete old images when updating

---

## 🔐 **E. Authentication System**

* JWT-based authentication
* Token stored inside HTTP-only **secure cookies**
* CORS configured with cookies enabled
* Auto logout on expiration

---

 📌 4. Folder Structure

```
FoodieExpress/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   └── App.jsx
│   └── ...
│
└── backend/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── config/
    ├── utils/
    └── server.js
```

---

5. Environment Variables


Backend `.env`

```
PORT=5000
MONGO_URI=your_mongo_url
JWT_SECRET=your_jwt
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
RAZORPAY_KEY_ID=xxxx
RAZORPAY_KEY_SECRET=xxxx
FIREBASE_API_KEY=xxxx
FRONTEND_URL=https://your-frontend-url.com
```

---

6. API Routes Overview

 🔐 Auth Routes

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/logout
```

### 🛒 **Order Routes**

```
POST /api/order/create
GET /api/order/user/:id
GET /api/order/owner/:id
PATCH /api/order/status-update
```

### 🍽️ **Food Store Routes**

```
POST /api/store/create
POST /api/store/item/add
PATCH /api/store/item/:id
DELETE /api/store/item/:id
```

### 🛵 **Delivery Boy Routes**

```
GET /api/delivery/orders
PATCH /api/delivery/accept
PATCH /api/delivery/location-update
```

---

# 📌 **7. Profile Management**

* Name update
* Gender update
* Date of Birth update
* Upload/change profile picture
* Cloudinary auto-delete enabled

---

# 📌 **8. Installation Guide**

### **1️⃣ Clone Repo**

```
git clone https://github.com/yourname/FoodieExpress.git
cd FoodieExpress
```

### **2️⃣ Install Frontend**

```
cd frontend
npm install
npm run dev
```

### **3️⃣ Install Backend**

```
cd backend
npm install
npm start
```

---

# 📌 **9. Screenshots**



---

# 📌 **10. Developer**

👨‍💻 **Pallab Saha**

---

# 📌 **9. Live Deployment Links**

### 🚀 **Frontend Live:** -> https://foodieexpress-5olv.onrender.com

### 🚀 **Backend Live:**  -> https://foodieexpress-backend-qfcg.onrender.com

### 📦 **Full Source Code (GitHub):** ->

---

# 📌 **10. How to Test the Project (Step‑by‑Step Guide)**

This section helps new users, store owners, and delivery boys understand how to use your project properly.

**(Please create owner account first)**

## 👤 **1. How to Create a User Account**

1. Go to the frontend live link.
2. Click **Signup**.
3. Select **User** as your role.
4. Enter name, email, password, city, DOB, gender.
5. Login and browse food stores available in **your city**.
6. Add items to cart and place order using **COD** or **Razorpay online payment**.
7. After order placement, you can see **live order tracking** once delivery boy accepts.

---

## 🏪 **2. How to Create Store Owner Account & Add Foods**   

1. Signup by choosing **Store Owner** as role.
2. After login, go to **Create Store** page.
3. Add store details (name, city, address, image).
4. Go to **Add Food Items** section.
5. Upload item image → (Uploaded to Cloudinary).
6. Add food name, description, price, category.
7. Once added, items become visible to users in your **same city**.
8. When user orders → you get **Live Order Notification** through Socket.io.
9. Update order status:

   * Pending → Preparing → Out for Delivery → Delivered.

---

## 🛵 **3. How Delivery Boy Uses the System**

1. Signup as **Delivery Boy**.
2. After login, the dashboard shows **Live New Orders**.
3. Accept an order → User & Owner can now see tracking.
4. Allow location → Your live coordinates update via Firebase.
5. Move the vehicle → User sees live movement on Leaflet map.
6. Mark order status as delivered after completion.


