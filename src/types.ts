export type UserRole = 'tenant' | 'owner';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  favorites: string[];
}

export interface StrategicData {
  traffic: string;
  density: string;
  proximity: string[];
  analysis: string;
}

export interface Kiosk {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  photos: string[];
  facilities: string[];
  status: 'available' | 'rented';
  strategicData?: StrategicData;
  createdAt: any;
  updatedAt: any;
}

export interface Booking {
  id: string;
  kioskId: string;
  tenantId: string;
  ownerId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  surveyDate: string;
  message?: string;
  createdAt: any;
}

export interface Review {
  id: string;
  kioskId: string;
  tenantId: string;
  tenantName: string;
  rating: number;
  comment: string;
  createdAt: any;
}
