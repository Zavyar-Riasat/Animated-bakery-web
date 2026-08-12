export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number; // in USD
  category: "Custom Cakes" | "Cupcakes" | "Gluten-Free" | "Artisan Breads" | "Viennoiserie" | "Pastries";
  allergens: ("Dairy" | "Gluten" | "Nuts" | "Eggs" | "Soy" | "Sesame")[];
  stock: boolean;
  stockQuantity: number;
  image: string;
  isFeatured?: boolean;
  rating?: number;
  prepTimeMinutes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: {
    size?: string;
    inscription?: string;
    flavor?: string;
  };
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: number;
  cakeTier: string;
  flavorProfile: string;
  budgetRange: string;
  designDescription: string;
  dietaryRestrictions: string[];
}

export interface InquiryDocument extends InquiryFormData {
  _id: string;
  status: "pending" | "reviewed" | "quoted" | "confirmed";
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  cardExp: string;
  cardCvc: string;
  nameOnCard: string;
  deliveryDate: string;
  deliveryNotes?: string;
}
