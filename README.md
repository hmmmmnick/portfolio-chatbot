# Personal Portfolio Website with API-Based Chatbot Integration

**Student Name:** Ambesh Mishra  
**Degree:** B.Tech in Computer Science & Engineering (Specialization in AI & ML)  
**Institution:** JECRC University, Jaipur  
**GitHub Profile:** [@hmmmmnick](https://github.com/hmmmmnick)  
**Live Deployed Portfolio:** [https://ambesh-mishra-portfolio.vercel.app](https://ambesh-mishra-portfolio.vercel.app)

---

## 📌 Project Overview
This project is an individual practical internal assessment developing a modern, responsive personal portfolio website integrated with a grounded AI chatbot. It showcases coursework projects, interactive filtering, theme switching, and secure API integration deployed to Vercel.

---

## 🛠️ Tech Stack
- **Frontend:** Semantic HTML5, Modern CSS3 (Variables, Flexbox, Grid), Vanilla JavaScript (ES6+)
- **AI & Tools:** Cursor AI, Google Gemini API
- **Deployment:** Vercel (Static Hosting & Serverless Functions)
- **Version Control:** Git, GitHub

---

## 🚀 Key Features

### 1. Personalized Portfolio
- Dedicated sections for **Home**, **About Me**, **Skills**, **Projects**, and **Contact Information**.
- Details academic progression at JECRC University in AI & ML with zero sample placeholders.

### 2. Five Featured Coursework Projects
1. **Python Programs Collection:** Factorial, Fibonacci sequence, and Structure-to-Dictionary serialization.
2. **Messy Python Code Improvement:** AI-assisted refactoring adhering to PEP 8 clean-code standards.
3. **Bug Fixing Using Cursor AI:** Root cause analysis and fixes for runtime logic bugs using Cursor AI.
4. **Interactive Quiz Application (Lecture 10):** Dynamic quiz application with immediate scoring and DOM feedback.
5. **Book Reading List Application (Lecture 11):** Local storage-backed reading manager with working live links.

### 3. Interactive Functionality
- **Search and Filter:** Real-time search by keyword (e.g., "Python", "Quiz", "Book") and category filter chips.
- **Theme Switcher:** Light and dark mode toggle with persistent state via `localStorage`.

### 4. API-Grounded Chatbot
- Embedded AI chat widget grounded in portfolio data.
- **Zero Secret Exposure:** Uses a Vercel Serverless Function (`/api/chat.js`) to protect API keys from client exposure or GitHub commits.
- Handles common queries: *"Who are you?"*, *"What are your skills?"*, *"Explain your Python programs"*, *"Where is your GitHub?"*.

---

## 💻 Local Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/hmmmmnick/portfolio-chatbot.git
   cd portfolio-chatbot