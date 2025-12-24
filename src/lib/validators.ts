import { z } from "zod";

// Auth validators
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
});

// Category validators
export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
});

// Contact validators
export const contactSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (E.164 format)"),
  categoryId: z.string().cuid("Invalid category ID"),
});

export const bulkImportSchema = z.object({
  contacts: z.array(
    z.object({
      phoneNumber: z.string(),
      categoryId: z.string(),
    })
  ),
});

// SMS validators
export const sendSmsSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(1600, "Message must be less than 1600 characters"),
  recipientType: z.enum(["all", "category", "individual"]),
  categoryId: z.string().cuid().optional(),
  contactIds: z.array(z.string().cuid()).optional(),
});

// API response validators
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SendSmsInput = z.infer<typeof sendSmsSchema>;
export type BulkImportInput = z.infer<typeof bulkImportSchema>;
