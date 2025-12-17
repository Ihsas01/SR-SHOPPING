export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  featured?: boolean;
}

export interface Category {
  name: string;
  image: string;
  description: string;
}

export interface Admin {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const defaultAdmins: Admin[] = [
  { name: 'Store Manager', email: 'Mohamedihsas001@gmail.com', password: 'admin123', phone: '0763913526' },
  { name: 'Admin One', email: 'admin@srshopping.com', password: 'admin123', phone: '0760000001' },
  { name: 'Owner', email: 'owner@srshopping.com', password: 'admin123', phone: '0760000002' },
];

export const defaultCategories: Category[] = [
  {
    name: 'Home items',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    description: 'Storage, decor, daily essentials for every room.',
  },
  {
    name: 'Kitchen items',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    description: 'Cookware, utensils, organizers, meal prep tools.',
  },
  {
    name: 'Living room items',
    image: 'https://images.unsplash.com/photo-1484100356142-db6ab6244067?auto=format&fit=crop&w=900&q=80',
    description: 'Cushions, throws, lamps, and tidy-up solutions.',
  },
  {
    name: 'Dresses & fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    description: 'Everyday outfits, workwear, and weekend picks.',
  },
  {
    name: 'Bathroom items',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    description: 'Towels, organizers, and fresh-scent essentials.',
  },
  {
    name: 'Study & school items',
    image: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=900&q=80',
    description: 'Stationery, backpacks, and tech accessories.',
  },
  {
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
    description: 'Comfort-first sneakers, sandals, and formal wear.',
  },
  {
    name: 'Children items',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    description: 'Toys, apparel, and school-ready essentials.',
  },
  {
    name: 'Beauty & cream products',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    description: 'Skin care, creams, and self-care kits.',
  },
  {
    name: 'Perfumes & scents',
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=900&q=80',
    description: 'Signature fragrances and deodorants.',
  },
  {
    name: 'Electrical items',
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43f?auto=format&fit=crop&w=900&q=80',
    description: 'Small appliances, lighting, and handy gadgets.',
  },
  {
    name: 'Cleaning & chemical products',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
    description: 'Detergents, disinfectants, and home care kits.',
  },
];

export const defaultProducts: Product[] = [
  {
    id: 'p-1',
    name: 'Velvet Throw Pillow',
    price: 18.99,
    quantity: 24,
    category: 'Living room items',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    id: 'p-2',
    name: 'Stainless Steel Pan Set',
    price: 54.5,
    quantity: 15,
    category: 'Kitchen items',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    id: 'p-3',
    name: 'Minimal Desk Lamp',
    price: 22.75,
    quantity: 30,
    category: 'Home items',
    image: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    id: 'p-4',
    name: 'Cotton Bath Towel Set',
    price: 19.99,
    quantity: 40,
    category: 'Bathroom items',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p-5',
    name: 'Study Backpack',
    price: 27.5,
    quantity: 18,
    category: 'Study & school items',
    image: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p-6',
    name: 'Casual White Sneakers',
    price: 35.0,
    quantity: 20,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    id: 'p-7',
    name: 'Kids Learning Kit',
    price: 16.0,
    quantity: 28,
    category: 'Children items',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p-8',
    name: 'Hydrating Face Cream',
    price: 14.25,
    quantity: 36,
    category: 'Beauty & cream products',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },
  {
    id: 'p-9',
    name: 'Fresh Citrus Perfume',
    price: 29.99,
    quantity: 22,
    category: 'Perfumes & scents',
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p-10',
    name: 'Compact Blender',
    price: 49.99,
    quantity: 12,
    category: 'Electrical items',
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p-11',
    name: 'Eco Dish Soap Duo',
    price: 9.95,
    quantity: 50,
    category: 'Cleaning & chemical products',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'p-12',
    name: 'Linen Summer Dress',
    price: 32.5,
    quantity: 16,
    category: 'Dresses & fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
];
