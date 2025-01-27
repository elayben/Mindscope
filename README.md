# Mindscope App

A full-stack web application for visualizing mental health data and insights. This project integrates a React-based client with an Express.js backend and MySQL database.

---

## Features

### Frontend
- Built with **React**.
- Visualization with charts and maps using **Recharts** and **SVGs**.
- Responsive design and user-friendly interfaces.

### Backend
- **Express.js** server with RESTful API.
- Routes for user authentication, disorder data retrieval, and country management.
- API endpoints for complex data queries, including disorder correlations and DALY differences.

### Database
- **MySQL** database schema designed for storing mental health data.
- Tables include users, disorders, countries, and in-year statistics.

## Setup Instructions

### Prerequisites
- **Node.js** 
- **MySQL** 
- **npm**

### Project Setup (Backend + Frontend)
1. Clone the repository:
   ```bash
   git clone https://github.com/elayben/Mindscope.git
   cd mindscope
   ```

2. Install dependencies:
   ```bash
   npm i
   ```

3. Set up the environment variables in `.env`:
   ```plaintext
   PORT=5014
   DB_HOST=localhost
   DB_USER=<your-database-username>
   DB_PASSWORD=<your-database-password>
   DB_NAME=mindscope
   ```

4. Initialize the MySQL database:
   - Import the provided SQL dump (`mindscope.sql`) into your MySQL server.

5. Start the server:
   ```bash
   node mindscope.js
   ```
---

## Usage

1. Open the app in your browser:
   ```
   http://localhost:5014
   ```

2. Log in or register to access the main dashboard.
3. Use the dropdowns and inputs to query mental health data.
4. Visualize results with charts, maps, and graphs.
