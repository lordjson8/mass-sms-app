import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+${cleaned}`;
  }
  return `+${cleaned}`;
}

export function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split("\n");
  return lines.map((line) => {
    return line.split(",").map((cell) => cell.trim().replace(/^\"|\"$/g, ""));
  });
}

export function calculateSMSPages(message: string): number {
  if (message.length <= 160) return 1;
  if (message.length <= 306) return 2;
  return Math.ceil(message.length / 153);
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusColor(
  status: "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "BOUNCED"
): string {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SENT: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    BOUNCED: "bg-red-100 text-red-800",
  };
  return colors[status];
}
