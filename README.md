# Expense Sharing Backend

A backend REST API for an expense-sharing application that allows users to create groups, add shared expenses, split costs, and track balances between group members.

---

## 🚀 Features

* User management
* Group creation and management
* Add shared expenses within a group
* Automatic expense splitting among group members
* Track balances between users
* Prevent group deletion if pending balances exist
* RESTful API design

---

## 🛠 Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **ODM**: Mongoose
* **Environment Management**: dotenv
* **Development Tools**: nodemon

---

## 📂 Project Structure

```
ExpenseSharingBackend/
├── src/
│   ├── models/        # Mongoose schemas
│   ├── controllers/  # Request handling logic
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── middlewares/   # Custom middlewares & error handling
│   └── config/        # Database & app configuration
├── index.js           # Entry point
├── package.json
├── package-lock.json
└── .env               # Environment variables
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/AbhishekRajvanshi07/ExpenseSharingBackend.git
cd ExpenseSharingBackend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/expense-sharing
```

### 4️⃣ Start the server

```bash
npm run dev
```

Server will run at:

```
http://localhost:3000
```

---

## 📌 API Endpoints (Sample)

### Users

* `POST /users` – Create a user
* `GET /users` – Get all users

### Groups

* `POST /groups` – Create a group
* `GET /groups/:id` – Get group details
* `DELETE /groups/:id` – Delete group (only if no pending balances)

### Expenses

* `POST /expenses` – Add an expense to a group
* `GET /expenses/:groupId` – Get all expenses of a group

---

## 🧠 Business Logic Highlights

* Expenses are split equally among group members by default
* Balances are calculated and stored per user
* Group deletion is blocked if any user has pending balances

---

## 🔮 Future Improvements

* JWT-based authentication
* Role-based access control
* Expense split by percentage or exact amounts
* Settlement and payment history
* API documentation using Swagger
* Unit and integration tests

---

## 📄 License

This project is open-source and available under the MIT License.

##Author
Abhishek Kumar

