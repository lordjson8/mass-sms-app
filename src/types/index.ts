import { Role } from "@prisma/client";

export type UserRole = Role;

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ContactWithCategory {
  id: string;
  phoneNumber: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt: Date;
}

export interface SMSLogWithDetails {
  id: string;
  sentBy: string;
  recipient: string;
  message: string;
  status: string;
  categoryId?: string;
  twilioSid?: string;
  sentAt: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
