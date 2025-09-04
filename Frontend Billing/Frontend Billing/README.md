Billing Application – Full Stack Project

Introduction

This project is a full-stack billing management application built with Spring Boot (Java) for the backend and React.js for the frontend. It provides features such as user authentication, customer management, product & invoice handling, and payment processing. The goal of the application is to streamline billing operations through a secure backend and an interactive frontend UI.

Tech Stack
Backend (Spring Boot)
Java 17
Spring Boot
Spring Security + JWT Authentication
Spring Data JPA + Hibernate
H2 (in-memory) Database (configured)
Lombok
Frontend (React.js)
React 18
React Router
Axios (API integration)
Project Structure
Backend (/Backend Billing excelR)
src/main/java/com/example/billing
 ├── controller/       → REST Controllers
 ├── service/          → Business logic
 ├── repository/       → Data access layer
 ├── entity/           → Database models (Customer, Invoice, Product, Users, etc.)
 └── security/         → JWT & Spring Security configs

src/main/resources/
 ├── application.properties
 └── data.sql (sample data)

pom.xml
Frontend (/Frontend Billing excelR)
public/
src/
 ├── api/              → Axios instance & API helpers
 ├── assets/           → Images and static resources
 ├── components/       → Reusable React components (Navbar, Forms, etc.)
 ├── pages/            → Page-level components (Login, Signup, Billing, etc.)
 ├── App.js
 └── index.js

package.json
Setup Instructions
1. Clone the Repository
git clone https://github.com/spurthibojja/Billing-Application.git
cd Billing-Application
2. Backend Setup
Requirements:

Java 17
Maven
Run backend:

cd "Backend Billing excelR"
mvn spring-boot:run
Backend will run at: http://localhost:8080

3️. Frontend Setup
Requirements:

Node.js
npm
Install dependencies & run:

cd "Frontend Billing excelR"
npm install
npm start
Frontend will run at: http://localhost:3000

Features
✔️ User registration & login with JWT authentication ✔️ Role-based authorization (Admin, Accountant, Customer) ✔️ Customer, Product, Invoice & Payment management ✔️ Secure REST API built with Spring Boot ✔️ Responsive frontend built with React.js ✔️ Axios integration for backend communication

📎 GitHub Repository
👉 Billing Application GitHub Link
