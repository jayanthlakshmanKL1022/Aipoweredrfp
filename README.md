
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# Aipoweredrfp
.

📌 Aipoweredrfp — AI-Powered RFP Automation Platform (MERN + Gemini AI)

An AI-powered Request for Proposal (RFP) automation platform built using the MERN stack (MongoDB, Express, React, Node.js).
This platform streamlines the end-to-end RFP workflow—vendor management, sending proposals, receiving responses, and AI-powered analysis using Google Gemini AI.

🚀 #Features
✅ Vendor Management
Add, edit, and delete vendors
Store essential details like category, email, contact number, and average response time
View and search vendor lists

✉️ Proposal Automation
Send proposals to individual vendors
Send bulk proposals to multiple vendors at once
Real-time email delivery status
Automated professional proposal formatting generated using AI

🤖 AI-Powered RFP Analysis (Gemini AI)
Vendor responses are analyzed using Google Gemini API
Generates insights & AI-recommended decisions
Highlights risks, strengths, and weaknesses of each vendor’s response

📩 Response Management
Track and view individual vendor responses
View bulk response summaries
Responses structured for faster evaluation by procurement teams

🖥️ Modern UI
Built with React + Material UI (MUI)
Clean dashboard with navigation
Components for vendor forms, proposal screens, and response insights

🧩 Tech Stack

Frontend
React (Vite + TypeScript)
Material UI (MUI)
Axios
React Router

Backend
Node.js
Express.js
MongoDB + Mongoose
Google Gemini AI API
Nodemailer (Email service)

📌 Project Highlights

✉️ Send individual vendor proposal emails
📦 Send bulk proposal emails
🔁 Automated vendor replies (mocked for fast development)
🤖 Gemini AI–powered RFP analysis
📊 View AI-generated decision insights
🧾 Manage vendors (create / view)
📄 View all sent proposals (single + bulk)


AI Tools Used
Google Gemini (primary AI engine)
ChatGPT (coding assistance)
Lovable AI (UI generation support)

⚙️ Project Setup
1️⃣ Install Latest Tools
Make sure the following are installed:
Node.js 20+
MongoDB Community / Atlas

Git

2️⃣ Clone Repository
git clone https://github.com/jayanthlakshmanKL1022/Aipoweredrfp.git
cd Aipoweredrfp

3️⃣ Start Frontend
npm install
npm run dev

4️⃣ Start Backend
cd express-ts-backend
npm install
npm run dev


🔥 Note:
Environment variables are NOT used (for convenience).
API keys + email config are hardcoded temporarily (dev-mode).
Gemini API Key currently used:

AIzaSyD5XSMJ9nFpvCO3wrWuSU4u11739ldmDyA

🧩 Assumptions

Vendor replies are automated AI-generated responses (not real email replies).

Email sending uses Nodemailer, but for testing, no real inbox reading.

Gemini AI produces: summary, highlights, weaknesses, recommendation.

System runs locally — no deployments configured yet.

🧭 Application Flow (Design Overview)
1️⃣ Add Vendor

→ User opens “Add Vendor” form
→ Vendor stored in database (MongoDB)

2️⃣ Create RFP

→ User writes RFP content
→ Selects:

one vendor OR

multiple vendors

3️⃣ Send Proposal

→ Backend triggers email sending
→ AI generates formatted proposal content
→ Store record in DB

4️⃣ Vendor Replies (Automated)

→ System auto-generates vendor reply
→ Runs reply through Gemini AI for analysis
→ Stores insights (strengths, risks, recommendation)

5️⃣ View Responses

Individual Proposal Responses

Bulk Proposal Responses

AI Reports screen /aireports

🌐 API Documentation
📮 Email API
1. Send Individual Proposal
POST /sendEmail


Body

{
  "vendorEmail": "vendor@example.com",
  "json": "RFP contents",
  "companyName": "Vendor 1"
}

2. Send Bulk Proposal
POST /sendbulkemail


Body

{
  "vendorList": [...],
  "rfp": "proposal content"
}

📁 Proposal Retrieval
3. Get Individual Proposals
GET /proposals

4. Get Bulk Proposals
GET /bulkproposals

🧾 AI Reports
5. AI Analysis Reports
GET /aireports

🏢 Vendor APIs
6. Create Vendor
POST /vendor/create


Body

{
  "companyname": "Apex Solutions",
  "category": "IT Services",
  "email": "info@apex.com",
  "contactnumber": "9876543210",
  "avgresponsetime": "2 days"
}

7. Get Vendors
GET /vendor/getVendors

🗂️ Folder Structure
Aipoweredrfp/
│
|             # React Frontend
│── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── assets/
│   │   └── main.tsx
│   └── package.json
│
├── express-ts-backend/   # Node + Express API
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── server.ts
│
└── README.md

🚀 Future Improvements
Role-based authentication
Real email inbox parsing
Vendor scoring algorithm
Workflow automation

Proposal templates

Attachments support
//replace geminiapi -->exposed envs might not work.

RUN THE APP IN PORT 5000 IN LOCAL EVERYTHING IS HARDCODED INCLUDING envs for convenience.
<img width="1855" height="857" alt="image" src="https://github.com/user-attachments/assets/52c9005e-a033-4b37-9c82-c965d60c365b" />
<img width="1891" height="838" alt="image" src="https://github.com/user-attachments/assets/77791e84-8fe7-4775-8bd3-16e1ceb91cf3" />
<img width="1895" height="908" alt="image" src="https://github.com/user-attachments/assets/767b48e1-e434-4ebc-a811-ba79c2f0b4ed" />
<img width="1887" height="902" alt="image" src="https://github.com/user-attachments/assets/082076aa-9cc9-4cd0-9e00-06b5f64d2b6d" />



