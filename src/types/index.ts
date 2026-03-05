// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  age?: number;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  age?: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// State Types
export interface State {
  id: string;
  name: string;
  description: string;
  image: string;
  destinations?: Destination[];
  createdAt: string;
}

// Destination Types
export interface Destination {
  id: string;
  name: string;
  stateId: string;
  state?: State;
  description: string;
  highlights: string[];
  rating: number;
  price: number;
  image: string;
  mapEmbedUrl: string;
  createdAt: string;
}

export interface DestinationWithState extends Destination {
  state: State;
}

// Booking Types
export type Transport = 'CAR' | 'TRAIN' | 'FLIGHT';
export type FoodPreference = 'VEG' | 'NON_VEG' | 'JAIN' | 'NO_MEALS';
export type PaymentMethod = 'GOOGLE_PAY' | 'PHONEPE' | 'PAYTM' | 'PAYPAL' | 'BHIM_UPI' | 'CARD';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING';

export interface Booking {
  id: string;
  bookingId: string;
  userId: string;
  user?: User;
  destinationId: string;
  destination?: Destination;
  travelDate: string;
  numberOfPersons: number;
  transport: Transport;
  foodPreference: FoodPreference;
  totalCost: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestAddress?: string;
  guestAge?: number;
  createdAt: string;
}

export interface BookingFormData {
  travelDate: string;
  numberOfPersons: number;
  transport: Transport;
  foodPreference: FoodPreference;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestAddress?: string;
  guestAge?: number;
}

export interface BookingStep1Data {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  age: number;
  travelDate: Date;
  numberOfPersons: number;
}

export interface BookingStep2Data {
  transport: Transport;
}

export interface BookingStep3Data {
  foodPreference: FoodPreference;
}

export interface BookingStep4Data {
  paymentMethod: PaymentMethod;
}

export interface FullBookingData extends BookingStep1Data, BookingStep2Data, BookingStep3Data, BookingStep4Data {}

// Review Types
export interface Review {
  id: string;
  userId: string;
  user?: User;
  destinationId: string;
  destination?: Destination;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ReviewFormData {
  rating: number;
  comment?: string;
}

// Transport Pricing
export interface TransportOption {
  type: Transport;
  name: string;
  basePrice: number;
  pricePerKm?: number;
  icon: string;
  description: string;
}

// Food Pricing
export interface FoodOption {
  type: FoodPreference;
  name: string;
  pricePerDay: number;
  description: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  confirmedTrips: number;
  pendingBookings: number;
  recentBookings: Booking[];
}

// Cost Breakdown
export interface CostBreakdown {
  destinationPrice: number;
  persons: number;
  destinationTotal: number;
  transportCost: number;
  foodCost: number;
  foodDays: number;
  serviceFee: number;
  totalCost: number;
}
