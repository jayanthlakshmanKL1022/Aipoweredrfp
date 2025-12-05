
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

