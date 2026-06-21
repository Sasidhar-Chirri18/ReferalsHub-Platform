# ReferalsHub Platform 🚀

ReferalsHub is a modern, premium web platform designed to connect job seekers (Candidates) with employees at top tech companies (Referrers). Candidates can request job referrals, and referrers can manage requests, toggle their availability, and refer candidates to open positions.

---

## 🌟 Key Features

* **Role-Based Portals**:
  * **Candidates**: Search for jobs, build profiles (skills, experience, portfolio, resume), submit referral requests, and track request status.
  * **Referrers**: Manage company-specific job listings, toggle referral availability, view candidate profiles/resumes, and accept/reject/mark requests as "Referred".
  * **Admins**: Monitor users, job listings, and platform metrics.
* **Modern Glassmorphic UI**: Beautiful, premium dark mode user interface built with Vite, React, Tailwind CSS, and Lucide Icons.
* **Notification Engine**: Candidates and Referrers get real-time application notifications for actions (e.g., status changes, new requests).
* **Robust Security**: Secure authentication and authorization powered by Spring Security, JWT, and BCrypt.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Tailwind CSS, Axios, Lucide Icons, React Hot Toast
* **Backend**: Spring Boot 3.3, Spring Security, Spring Data JPA, JWT Authentication
* **Database**: MySQL 8.0

---

## 📂 Project Structure

```text
ReferalsHub Platform/
├── backend/                  # Spring Boot backend application
│   ├── src/main/java/        # Java source code
│   └── src/main/resources/   # Application properties and assets
├── frontend/                 # React + Vite frontend application
│   ├── src/components/       # Reusable UI components
│   ├── src/pages/            # View pages and dashboards
│   └── src/services/         # API integration services
├── schema.sql                # Database initialization schema
├── docker-compose.yml        # Docker composition settings
└── DEPLOYMENT_GUIDE.md       # Deployed environments instructions
```

---

## 🚀 Local Setup & Installation

### Prerequisites
* **Java SDK 17 or higher** (Java 20 recommended)
* **Node.js** (v18 or higher) & **npm**
* **MySQL Server** (v8.0)

---

### Step 1: Database Setup
1. Open your MySQL client (e.g., Workbench, DBeaver) and log in.
2. Run the SQL statements inside [schema.sql](file:///c:/Users/Cloud/Desktop/ReferalsHub%20Platform/schema.sql) to create the database (`referalshub`) and initialize tables:
   ```sql
   source schema.sql;
   ```

---

### Step 2: Running the Backend
1. Navigate to the `backend` directory.
2. Build the project using Maven Wrapper:
   ```bash
   ./mvnw clean package -DskipTests
   ```
3. Run the application jar by setting the database and JWT environments:
   ```bash
   # On Windows (PowerShell):
   $env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/referalshub?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
   $env:SPRING_DATASOURCE_USERNAME="root";
   $env:SPRING_DATASOURCE_PASSWORD="YOUR_PASSWORD";
   $env:JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
   java -jar target/platform-0.0.1-SNAPSHOT.jar
   ```
   *The backend will start on* **`http://localhost:8080`**.

---

### Step 3: Running the Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on* **`http://localhost:5173`**.

---

## 🐳 Running with Docker
If you have Docker and Docker Compose installed, you can spin up the entire application stack (MySQL database, Backend, and Frontend) with a single command:
```bash
docker-compose up --build
```
* Access Frontend: `http://localhost`
* Access Backend: `http://localhost:8080`
* Access Database: `localhost:3306`

---

## 🌐 Cloud Deployment
For deploying the database to the cloud (Aiven/Clever Cloud), backend API to **Render**, and React frontend to **Vercel**, refer to the detailed [DEPLOYMENT_GUIDE.md](file:///c:/Users/Cloud/Desktop/ReferalsHub%20Platform/DEPLOYMENT_GUIDE.md).
