# Car Rental Backend API

A RESTful backend API for a car rental system built with Express.js, PostgreSQL, and Prisma ORM.

## Features

- User authentication with JWT (registration and login)
- Car booking management
- RESTful API endpoints
- PostgreSQL database with Prisma ORM
- Password hashing with bcryptjs

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd car-rental-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DATABASE_URL=postgresql://user:password@localhost:5432/car_rental
JWT_SECRET=your-secret-key-here-change-this-in-production
PORT=3000
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npm run seed
```

## Running the Application

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on port 3000 by default (or the port specified in `.env`).

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and receive JWT token

### Bookings

- `POST /bookings` - Create a new booking (requires authentication)
- `GET /bookings` - Get all bookings for the authenticated user
- `DELETE /bookings/:id` - Cancel a booking (requires authentication)

## Database Schema

### Users
- `id` (auto-increment)
- `username` (unique)
- `password` (hashed)
- `created_at`

### Bookings
- `id` (auto-increment)
- `user_id` (foreign key to Users)
- `car_name`
- `days`
- `rent_per_day`
- `status`
- `created_at`

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start server with nodemon
- `npm run seed` - Seed the database with initial data
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema changes to database

## Project Structure

```
car-rental-backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
├── src/
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── server.js             # Entry point
└── package.json
```

## License

ISC
