export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member' | 'super_admin';
  department?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Sermon {
  id: number;
  title: string;
  description: string;
  preacher: string;
  date: string;
  videoUrl?: string;
  audioUrl?: string;
  pdfUrl?: string;
  thumbnailUrl: string;
  views: number;
  category: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  category: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: 'building' | 'pastor' | 'events' | 'worship' | 'youth' | 'children';
  uploadDate: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
}

export interface PrayerRequest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  request: string;
  category: string;
  status: 'pending' | 'prayed' | 'answered' | 'open' | 'ongoing';
  createdAt: string;
}

export interface Donation {
  id: number;
  name: string;
  email: string;
  amount: number;
  purpose: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export interface Ministry {
  id: number;
  name: string;
  description: string;
  leader: string;
  imageUrl: string;
  schedule: string;
}
