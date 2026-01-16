const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface SignupResponse {
  success: boolean;
  data?: {
    message: string;
    userId: number;
  };
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    message: string;
    token: string;
  };
  error?: string;
}

export interface Booking {
  id: number;
  car_name: string;
  days: number;
  rent_per_day: number;
  status: string;
  totalCost: number;
}

export interface BookingResponse {
  success: boolean;
  data?: Booking[] | {
    message: string;
    bookingId: number;
    totalCost: number;
  };
  error?: string;
}

export interface BookingSummaryResponse {
  success: boolean;
  data?: {
    userId: number;
    username: string;
    totalBookings: number;
    totalAmountSpent: number;
  };
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || 'An error occurred');
    }

    return response.json();
  }

  async signup(username: string, password: string): Promise<SignupResponse> {
    return this.request<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async createBooking(carName: string, days: number, rentPerDay: number): Promise<BookingResponse> {
    return this.request<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify({ carName, days, rentPerDay }),
    });
  }

  async getBookings(bookingId?: number): Promise<BookingResponse> {
    const params = bookingId ? `?bookingId=${bookingId}` : '';
    return this.request<BookingResponse>(`/bookings${params}`);
  }

  async getBookingSummary(): Promise<BookingSummaryResponse> {
    return this.request<BookingSummaryResponse>('/bookings?summary=true');
  }

  async updateBooking(
    bookingId: number,
    updates: { carName?: string; days?: number; rentPerDay?: number; status?: string }
  ): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBooking(bookingId: number): Promise<{ success: boolean; data?: { message: string }; error?: string }> {
    return this.request(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
