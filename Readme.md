# Employee Management & Leave Portal

A full-stack **Employee Management & Leave Portal** built using **React.js** and **Spring Boot**. This project is designed to demonstrate real-world Java Full Stack development skills including authentication, role-based authorization, employee management, leave management, REST APIs, and database design.

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Axios
* React Hook Form
* React Toastify

## Backend

* Java 21 (Java 17 compatible)
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* MySQL
* Lombok
* Maven

## Tools

* Cursor / VS Code
* IntelliJ IDEA
* Postman
* MySQL Workbench
* Git & GitHub

---

# 📌 Project Objective

The Employee Management & Leave Portal is a role-based web application that enables organizations to manage employees and leave requests efficiently.

There are two user roles:

* **Admin**
* **Employee**

The application provides secure authentication using JWT and follows a modern full-stack architecture with React.js and Spring Boot.

---

# User Roles

## Admin

* Login
* Dashboard
* Add Employee
* Update Employee
* Delete Employee
* View Employees
* Approve Leave Requests
* Reject Leave Requests
* Manage Departments
* View Employee Profiles

---

## Employee

* Login
* View Dashboard
* View Profile
* Update Profile
* Apply Leave
* View Leave History
* Check Leave Status
* Change Password

---

#  Application Workflow

```text
Employee Login
        │
        ▼
Employee Dashboard
        │
        ▼
Apply Leave
        │
        ▼
Leave Request (Pending)
        │
        ▼
Admin Dashboard
        │
 ┌──────┴──────┐
 │             │
Approve      Reject
 │             │
 └──────┬──────┘
        │
        ▼
Employee Views Updated Status
```

---

# Database Design

## Employee Table

| Column       |
| ------------ |
| id           |
| first_name   |
| last_name    |
| email        |
| password     |
| phone        |
| department   |
| designation  |
| joining_date |
| role         |
| status       |
| created_at   |
| updated_at   |

---

## Leave Request Table

| Column      |
| ----------- |
| id          |
| employee_id |
| leave_type  |
| start_date  |
| end_date    |
| reason      |
| status      |
| created_at  |

### Leave Status

* Pending
* Approved
* Rejected

---

## Department Table

| Column          |
| --------------- |
| id              |
| department_name |

---

## Future Modules

* Attendance Management
* Salary Management
* Notifications
* Email Service
* Reports & Analytics

---

#  UI Pages

## Authentication

* Login

---

## Employee Module

* Dashboard
* Profile
* Apply Leave
* Leave History
* Change Password

---

## Admin Module

* Dashboard
* Employees
* Add Employee
* Update Employee
* Leave Requests
* Departments
* Profile

---

#  REST API Design

## Authentication

| Method | Endpoint  |
| ------ | --------- |
| POST   | /login    |
| POST   | /register |

---

## Employee APIs

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /employees     |
| GET    | /employee/{id} |
| POST   | /employee      |
| PUT    | /employee/{id} |
| DELETE | /employee/{id} |

---

## Leave APIs

| Method | Endpoint    |
| ------ | ----------- |
| POST   | /leave      |
| GET    | /leave      |
| PUT    | /leave/{id} |
| DELETE | /leave/{id} |

---

## Admin APIs

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /leave/pending |
| PUT    | /leave/approve |
| PUT    | /leave/reject  |

---

#  Project Structure

```text
Employee_Management_Portal/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   ├── dto/
│   │   │   │   ├── config/
│   │   │   │   ├── security/
│   │   │   │   ├── exception/
│   │   │   │   ├── util/
│   │   │   │   └── mapper/
│   │   │   └── resources/
│   │   │       └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

#  Development Roadmap

### Phase 1

* Project Planning
* Database Design
* UI Design
* API Planning

### Phase 2

* Spring Boot Setup
* MySQL Configuration
* Entity Creation
* Repository Layer
* Service Layer
* REST APIs

### Phase 3

* Spring Security
* JWT Authentication
* Role-Based Authorization

### Phase 4

* React Setup
* Tailwind CSS
* Routing
* Authentication UI

### Phase 5

* Employee Management
* Leave Management
* Dashboard

### Phase 6

* Search & Pagination
* Charts & Reports
* Docker






