# Library Management System (MERN)

A full-stack Library Management System built with the MERN stack. A librarian can manage books and members, issue and return books, and view a dashboard. All data is stored in MongoDB through a Node.js/Express REST API.

## Technologies
- MongoDB + Mongoose
- Node.js + Express.js
- React.js (Vite)
- Axios
- React Router
- CSS

## Features
- Books: add, view, edit, delete, search (title/author), category filter
- Members: add, view, edit, delete, search (name/email)
- Issue and return books (available quantity updates automatically)
- Transactions with status filter (Issued / Returned)
- Dashboard with total books, members, issued, returned, available
- Validation, duplicate ISBN/email check, delete confirmation

## Setup

### Backend
```bash
cd backend
npm install
```
Create a `.env` file (see `.env.example`):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```
Run:
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## API Endpoints

### Books
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/books | Add book |
| GET | /api/books?search=&category= | List books (search/filter) |
| GET | /api/books/categories | Category list |
| GET | /api/books/:id | Single book |
| PUT | /api/books/:id | Update book |
| DELETE | /api/books/:id | Delete book |

### Members
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/members | Add member |
| GET | /api/members?search= | List members (search) |
| GET | /api/members/:id | Single member |
| PUT | /api/members/:id | Update member |
| DELETE | /api/members/:id | Delete member |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/transactions/issue | Issue book |
| PUT | /api/transactions/:id/return | Return book |
| GET | /api/transactions?status=&bookId= | List transactions |
| GET | /api/transactions/issued | Issued only |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/dashboard | Statistics |

## Database
Database `library_management` with collections `books`, `members`, `transactions`.

## Screenshots
![Dashboard](screenshots/dashboard.png)
![Books](screenshots/books.png)
![Members](screenshots/members.png)
![Issue Book](screenshots/issue.png)
![Transactions](screenshots/transactions1.png)
![MongoDB](screenshots/mongodb.png)

## Author
Name: _Nimra Atiq_______
Roll No: __486895______