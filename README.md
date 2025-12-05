# 🍽️ VitalPlate – Smart Meal Planner for Health & Wellness

VitalPlate is an intelligent, interactive 🧠🍱 meal planning platform designed to support users with personalized dietary needs and chronic health conditions. Built using the **MERN stack** (MongoDB, Express, React, Node.js), VitalPlate enables users to register, select their health profile, and receive tailored meal recommendations with smart scheduling and nutrition insights.

---

## ✨ Features

### 🔐 Authentication & User Management
- Secure Login & Registration with JWT
- Auto-login persistence with token storage
- User-specific dietary and medical profiles

### 🍽️ Personalized Meal Planner
- Weekly drag-and-drop meal scheduling
- Diet recommendations for conditions like:
  - Diabetes
  - Hypertension
  - Weight loss goals
  - Heart disease
  - IBS and more...
- Smart grocery list generation based on selected meals

### 🍲 Recipe Discovery
- Browse and view detailed nutritional recipes
- Categorized by health needs
- Integrated with Spoonacular API for real meal data

### 🧠 Health Insights
- Guidelines for food choices based on profile
- AI-generated meal suggestions *(optional)*

### 🎨 Responsive UI/UX
- TailwindCSS modern styling
- Smooth animations (Framer Motion)
- Mobile-first responsive design

---

## 🧩 Tech Stack

| Layer | Technologies |
|------|--------------|
| Frontend | React, React Router, TailwindCSS, Framer Motion |
| Backend | Node.js, Express, JWT |
| Database | MongoDB + Mongoose |
| APIs | Spoonacular API, OpenAI API *(optional)* |
| Deployment | AWS (planned) |

---

## 📂 Project Structure




---

## 🚀 Getting Started

### 📌 Prerequisites
Ensure you have:
- Node.js (LTS)
- MongoDB Compass or MongoDB Atlas
- Git
- Spoonacular API Key
- (Optional) OpenAI API Key

---

### ⚙️ Backend Setup

```bash
cd backend
npm install

MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
SPOONACULAR_API_KEY=your_spoonacular_api_key
OPENAI_API_KEY=your_openai_api_key (optional)

npm run dev

http://localhost:5000

cd frontend
npm install
npm run dev

http://localhost:5173

| Feature                       | Status      |
| ----------------------------- | ----------- |
| AI-based meal recommendations | ⏳ WIP       |
| Nutrition tracker             | Planned     |
| Weight analytics              | Planned     |
| Grocery delivery integration  | Future      |
| Admin dashboard               | Coming soon |

| Page          | Preview |
| ------------- | ------- |
| Login         | ✔       |
| Dashboard     | ✔       |
| Planner       | ✔       |
| Recipe Detail | ✔       |

🤝 Contribution

Pull requests and feature contributions are welcome!
Open an issue to suggest improvements or report bugs.

📜 License

This project is licensed under the MIT License.

👤 Author : Kuboja Daniel

VitalPlate Development
🔗 GitHub: https://github.com/Kubojah-Dan
📧 Email: kubodan014@gmail.com

⭐ Support

If you like this project, please consider giving it a GitHub star ⭐ — it encourages future development and improvements!

VitalPlate’s mission:
“To simplify healthy eating for individuals with specific health needs through smart, personalized meal planning.” 💙


---

You can now **paste this directly into VS Code** as your `README.md` and push to GitHub 🟢

Would you like:
✔ VitalPlate logo design?  
✔ Preview images/screenshot layout?  
✔ A live demo section or badges for GitHub?
