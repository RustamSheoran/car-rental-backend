export interface Car {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  features: string[];
  description: string;
}

export const CARS: Car[] = [
  {
    id: '1',
    name: 'Honda City',
    type: 'Sedan',
    price: 1500,
    image: '🚗',
    features: ['Automatic', '5 Seats', 'Air Conditioning', 'Bluetooth'],
    description: 'A reliable and comfortable sedan perfect for city drives and highway trips.'
  },
  {
    id: '2',
    name: 'Maruti Swift',
    type: 'Hatchback',
    price: 1200,
    image: '🚙',
    features: ['Manual', '5 Seats', 'Air Conditioning', 'Fuel Efficient'],
    description: 'Compact and efficient hatchback ideal for urban commuting.'
  },
  {
    id: '3',
    name: 'Hyundai Verna',
    type: 'Sedan',
    price: 1600,
    image: '🚗',
    features: ['Automatic', '5 Seats', 'Sunroof', 'Premium Audio'],
    description: 'Stylish sedan with premium features for a comfortable ride.'
  },
  {
    id: '4',
    name: 'Toyota Innova',
    type: 'SUV',
    price: 2000,
    image: '🚐',
    features: ['Automatic', '7 Seats', 'Spacious', 'Power Windows'],
    description: 'Spacious SUV perfect for family trips and group travel.'
  },
  {
    id: '5',
    name: 'Tata Nexon',
    type: 'Compact SUV',
    price: 1400,
    image: '🚙',
    features: ['Manual', '5 Seats', 'Compact', 'High Safety Rating'],
    description: 'Compact SUV with excellent safety features and modern design.'
  },
  {
    id: '6',
    name: 'Mahindra Thar',
    type: 'SUV',
    price: 1800,
    image: '🚙',
    features: ['Manual', '4 Seats', '4x4', 'Convertible Top'],
    description: 'Rugged off-roader perfect for adventure seekers.'
  },
  {
    id: '7',
    name: 'Kia Seltos',
    type: 'SUV',
    price: 1700,
    image: '🚙',
    features: ['Automatic', '5 Seats', 'Turbo', 'UVO Connect'],
    description: 'Feature-packed SUV with modern technology and comfort.'
  },
  {
    id: '8',
    name: 'Renault Kwid',
    type: 'Hatchback',
    price: 1000,
    image: '🚗',
    features: ['Manual', '4 Seats', 'Compact', 'Budget Friendly'],
    description: 'Budget-friendly hatchback perfect for short city trips.'
  },
  {
    id: '9',
    name: 'Honda Jazz',
    type: 'Hatchback',
    price: 1300,
    image: '🚗',
    features: ['Manual', '5 Seats', 'Magic Seats', 'Spacious'],
    description: 'Versatile hatchback with flexible seating configurations.'
  },
  {
    id: '10',
    name: 'Skoda Octavia',
    type: 'Sedan',
    price: 2200,
    image: '🚗',
    features: ['Automatic', '5 Seats', 'Premium', 'Diesel'],
    description: 'Premium sedan with powerful engine and luxury features.'
  },
  {
    id: '11',
    name: 'Ford EcoSport',
    type: 'Compact SUV',
    price: 1500,
    image: '🚙',
    features: ['Automatic', '5 Seats', 'Compact', 'High Ground Clearance'],
    description: 'Compact SUV with excellent ground clearance and urban appeal.'
  },
  {
    id: '12',
    name: 'Toyota Fortuner',
    type: 'SUV',
    price: 2500,
    image: '🚙',
    features: ['Automatic', '7 Seats', '4x4', 'Powerful'],
    description: 'Premium SUV with unmatched power and off-road capabilities.'
  }
];
