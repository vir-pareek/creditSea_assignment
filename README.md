<h1 align="center">CreditSea Fullstack Assignment 📊</h1>

<p align="center"> A MERN-stack application to upload, parse, and visualize Experian XML credit reports. </p>

<p align="center"> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/> <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/> <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/> </p>

<h2>✨ Features</h2>

* This application fully meets the project requirements, allowing a user to process, store, and manage credit reports.

* 📤 XML File Upload: Securely upload .xml credit reports with backend validation.

* 🧠 Data Extraction: Automatically parses complex XML to extract:
  * Basic Details
  * Report Summary
  * Credit Account Information

* 📝 Full CRUD Functionality:

  * Create: Upload new reports.

  * Read: View all reports in a dashboard or a detailed single-report view.

  * Update: Edit the display name of reports for better organization.

  * Delete: Remove reports from the database with a confirmation.

* 💻 RESTful API: A clean backend built with REST principles for all data operations.

* 🧪 Unit Tested: Backend parsing logic is unit-tested using Vitest.

<h2> 🛠️ Tech Stack</h2>

* Frontend: React (with Vite), Tailwind CSS, axios

* Backend: Node.js, Express, Mongoose

* Database: MongoDB (using MongoDB Atlas)

* Testing: Vitest

* Development: nodemon for backend hot-reloading

<h2>🚀 Setup & Run Instructions</h2>

This project is in a monorepo structure. You will need to run the backend and frontend in two separate terminals.

<h3> Backend Setup (Node.js Server)</h3>

Navigate to the backend folder:

Bash
cd backend
Install dependencies:

Bash
npm install
Create the environment file: Create a new file in the backend folder named .env

Bash
touch .env
Add your MongoDB URI: Open the .env file and add your MongoDB Atlas connection string. Make sure to add your database name (e.g., creditsea-db) to the string.

MONGO_URI=mongodb+srv://<your-username>:<your-password>@cluster0.xxxxx.mongodb.net/creditsea-db?retryWrites=true&w=majority
Run the backend development server: This command uses nodemon to automatically restart the server on file changes.

Bash
npm run dev
✅ Your backend server will be running at http://localhost:8000.

<h3> Frontend Setup (React Client)</h3>

Open a new terminal window.

Navigate to the frontend folder:

Bash

cd frontend

Install dependencies:

Bash

npm install

Run the frontend development server:

Bash

npm run dev

✅ Your React application will automatically open in your browser at http://localhost:5173.

<h2>🎮 How to Use</h2>

1. Open http://localhost:5173 in your browser.

2. Use the "Upload Credit Report" form to select one of the sample .xml files.

3. Once uploaded, the report will appear in the "Processed Reports" list (e.g., as "Report 1").

4. You can click "Edit" to change the report's name or "Delete" to remove it.

5. Click the "View" button to navigate to the full, detailed report page.
