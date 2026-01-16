import { PrismaClient, Booking } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);
  const hashedPassword3 = await bcrypt.hash('password789', 10);

  const user1 = await prisma.user.upsert({
    where: { username: 'rahul' },
    update: {},
    create: {
      username: 'rahul',
      password: hashedPassword1
    }
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'priya' },
    update: {},
    create: {
      username: 'priya',
      password: hashedPassword2
    }
  });

  const user3 = await prisma.user.upsert({
    where: { username: 'amit' },
    update: {},
    create: {
      username: 'amit',
      password: hashedPassword3
    }
  });

  console.log('Users created:', { user1, user2, user3 });

  const bookings = [
    {
      user_id: user1.id,
      car_name: 'Honda City',
      days: 3,
      rent_per_day: 1500,
      status: 'booked'
    },
    {
      user_id: user1.id,
      car_name: 'Maruti Swift',
      days: 5,
      rent_per_day: 1200,
      status: 'completed'
    },
    {
      user_id: user1.id,
      car_name: 'Hyundai Verna',
      days: 2,
      rent_per_day: 1600,
      status: 'cancelled'
    },
    {
      user_id: user2.id,
      car_name: 'Toyota Innova',
      days: 7,
      rent_per_day: 2000,
      status: 'booked'
    },
    {
      user_id: user2.id,
      car_name: 'Tata Nexon',
      days: 4,
      rent_per_day: 1400,
      status: 'completed'
    },
    {
      user_id: user3.id,
      car_name: 'Mahindra Thar',
      days: 6,
      rent_per_day: 1800,
      status: 'booked'
    },
    {
      user_id: user3.id,
      car_name: 'Kia Seltos',
      days: 3,
      rent_per_day: 1700,
      status: 'completed'
    },
    {
      user_id: user3.id,
      car_name: 'Renault Kwid',
      days: 2,
      rent_per_day: 1000,
      status: 'cancelled'
    }
  ];

  for (const booking of bookings) {
    await prisma.booking.create({
      data: booking
    });
  }

  console.log('Bookings created successfully!');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
