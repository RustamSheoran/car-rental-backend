# Car Rental System

A full-stack car rental management system built as a monorepo using Turborepo, featuring a Next.js frontend with shadcn/ui components and an Express.js backend with PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with signup and login
- **Car Catalog**: Browse and book from a curated list of premium vehicles
- **Booking Management**: Create, view, update, and cancel bookings
- **User Dashboard**: Track booking history and spending
- **Admin Panel**: Manage all bookings with admin toggle switch
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Toast Notifications**: Sonner

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for cross-origin requests

### Monorepo
- **Tool**: Turborepo
- **Package Manager**: npm workspaces

## Project Structure

```
car-rental-backend/
├── apps/
│   ├── backend/           # Express.js backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   └── utils/
│   │   ├── server.js
│   │   └── package.json
│   └── frontend/          # Next.js frontend
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   └── signup/
│       │   ├── cars/
│       │   ├── dashboard/
│       │   ├── admin/
│       │   └── page.tsx
│       ├── components/
│       │   └── ui/       # shadcn/ui components
│       ├── lib/
│       │   ├── api.ts
│       │   ├── auth-context.tsx
│       │   └── cars.ts
│       └── package.json
├── turbo.json            # Turborepo configuration
├── package.json          # Root package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/RustamSheoran/car-rental-backend.git
cd car-rental-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Backend environment:
```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env` with your database credentials:
```
DATABASE_URL=postgresql://user:password@localhost:5432/car_rental
JWT_SECRET=your-secret-key-here-change-this-in-production
PORT=3000
```

Frontend environment:
```bash
# apps/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Set up the database:
```bash
cd apps/backend
npx prisma generate
npx prisma db push
npm run seed
```

## Running the Application

Start both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- Backend: http://localhost:3000
- Frontend: http://localhost:3001

Start individual apps:
```bash
# Start only backend
cd apps/backend
npm run dev

# Start only frontend
cd apps/frontend
npm run dev
```

Build for production:
```bash
npm run build
```

Start in production:
```bash
npm start
```

## Usage

### User Flow

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Sign in with your credentials at `/login`
3. **Browse Cars**: View available cars at `/cars`
4. **Book a Car**: Select a car and specify rental duration
5. **View Dashboard**: Manage your bookings at `/dashboard`
6. **Admin Panel**: Access admin features at `/admin` (toggle admin mode)

### API Endpoints

#### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and receive JWT token

#### Bookings
- `POST /bookings` - Create a new booking (requires auth)
- `GET /bookings` - Get user's bookings (requires auth)
- `GET /bookings?summary=true` - Get booking summary (requires auth)
- `PUT /bookings/:id` - Update a booking (requires auth)
- `DELETE /bookings/:id` - Cancel a booking (requires auth)

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
- `status` (booked/completed/cancelled)
- `created_at`

## Scripts

### Root
- `npm run dev` - Start both apps in development
- `npm run build` - Build all apps
- `npm start` - Start all apps in production
- `npm run lint` - Lint all apps

### Backend
- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend server
- `npm run seed` - Seed database with sample data
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database

### Frontend
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build Next.js for production
- `npm start` - Start Next.js production server
- `npm run lint` - Run ESLint

## License

ISC
hello