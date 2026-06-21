# Deployment Guide - ReferalsHub Platform

This guide describes how to deploy the ReferalsHub Platform locally and on cloud services.

## Local Deployment with Docker Compose

To run the complete platform locally with a single command:
1. Ensure Docker Desktop is installed and running.
2. Run the following command in the project root:
   ```bash
   docker-compose up --build
   ```
3. Once running, access:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:8080`
   - MySQL Database: `localhost:3306`

---

## 1. Cloud Database (MySQL)

Since Supabase is natively PostgreSQL, for a cloud-hosted MySQL database, you can use **Clever Cloud**, **Aiven**, or **Amazon RDS**:

### Using Aiven / Clever Cloud (Recommended for Free Tiers):
1. Sign up on [Aiven.io](https://aiven.io) or [Clever Cloud](https://www.clever-cloud.com).
2. Create a new **MySQL** instance.
3. Obtain your connection credentials:
   - Host
   - Database Name
   - Port
   - Username
   - Password
4. Execute the SQL commands in `schema.sql` in your database client (e.g. MySQL Workbench, DBeaver) to initialize the tables.

---

## 2. Backend Deployment (Render)

Render is ideal for hosting Spring Boot applications.

1. Sign up on [Render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your Git repository.
4. Configure the Web Service settings:
   - **Environment**: `Docker`
   - **Docker Path**: `Dockerfile.backend` (Render lets you specify the dockerfile)
   - **Plan**: Free/Starter
5. Add the following **Environment Variables** under the "Environment" tab:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<your-db-host>:<port>/<db-name>?useSSL=false&serverTimezone=UTC`
   - `SPRING_DATASOURCE_USERNAME`: `<your-db-username>`
   - `SPRING_DATASOURCE_PASSWORD`: `<your-db-password>`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
6. Deploy the service. Take note of the Render URL (e.g., `https://referalshub-backend.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

Vercel is the easiest place to host Vite + React static applications.

1. Sign up on [Vercel.com](https://vercel.com).
2. Click **Add New** -> **Project** and import your Git repository.
3. In the project config:
   - Set **Root Directory** to `frontend`.
   - The build settings will auto-detect Vite:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
4. Add the following **Environment Variable**:
   - `VITE_API_BASE_URL`: `<your-deployed-render-backend-url>` (e.g., `https://referalshub-backend.onrender.com`)
5. Click **Deploy**. Vercel will provide you with a production URL.
