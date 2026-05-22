# SpendSmart Frontend

A modern Angular-based frontend application for the SpendSmart Personal Finance Management System.

The frontend communicates with Spring Boot microservices through the API Gateway.

---

# Tech Stack

- Angular
- TypeScript
- Angular Material
- RxJS
- Bootstrap/Tailwind CSS
- JWT Authentication
- Google OAuth

---

# Features

- User Authentication
- Google Login
- Dashboard Analytics
- Expense Tracking
- Income Management
- Budget Planning
- Category Management
- Notification System
- Responsive UI
- API Integration with Spring Boot Backend

---

# Project Structure

```bash
spendsmart-frontend/
│
├── src/
├── app/
├── assets/
├── environments/
├── angular.json
├── package.json
└── README.md
```

---

# Clone Repository

```bash
git clone https://github.com/anupamshukla18/spendsmart-frontend.git
cd spendsmart-frontend
```

---

# Install Dependencies

```bash
npm install
```

---

# Environment Setup

Create `.env` or configure environment files.

Example:

```env
API_BASE_URL=http://localhost:8080
GOOGLE_CLIENT_ID=your-google-client-id
```

---

# Run Application

```bash
ng serve
```

Application runs at:

```text
http://localhost:4200
```

---

# Build Application

```bash
ng build
```

---

# Backend Connection

The frontend connects to:

```text
http://localhost:8080
```

through the API Gateway.

---

# Authentication

- JWT Token Authentication
- Google OAuth Login
- Route Guards
- HTTP Interceptors

---

# UI Features

- Responsive Design
- Dynamic Charts
- Modular Components
- Lazy Loading
- Reusable Services

---

# Future Improvements

- PWA Support
- Dark Mode
- Advanced Analytics
- Mobile App Integration

---

# Author

Anupam Shukla

GitHub:
https://github.com/anupamshukla18
