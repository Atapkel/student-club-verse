
import { toast } from "sonner";

const API_URL = "http://127.0.0.1:8000/api";

interface ApiError {
  detail?: string;
  message?: string;
  error?: string;
  [key: string]: any;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export async function getAuthTokens(username: string, password: string): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    const errorMessage = extractErrorMessage(error);
    throw new Error(errorMessage);
  }

  return response.json();
}

function extractErrorMessage(error: ApiError): string {
  // Attempt to find a meaningful error message in various formats
  if (typeof error === "string") return error;
  
  if (error.detail) return error.detail;
  if (error.message) return error.message;
  if (error.error) return error.error;
  
  // Check for field-specific errors
  for (const key in error) {
    if (Array.isArray(error[key])) {
      return `${key}: ${error[key][0]}`;
    } else if (typeof error[key] === "string") {
      return `${key}: ${error[key]}`;
    }
  }
  
  return "An unknown error occurred";
}

export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  data: any = null,
  requireAuth: boolean = true
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (requireAuth) {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication required");
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    // Handle 401 Unauthorized by redirecting to login
    if (response.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = extractErrorMessage(errorData);
      throw new Error(errorMessage);
    }

    // No content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unknown error occurred");
    }
    throw error;
  }
}

// Helper methods for common operations
export const api = {
  get: <T>(endpoint: string, requireAuth: boolean = true) => 
    apiRequest<T>(endpoint, "GET", null, requireAuth),
  
  post: <T>(endpoint: string, data: any, requireAuth: boolean = true) => 
    apiRequest<T>(endpoint, "POST", data, requireAuth),
  
  put: <T>(endpoint: string, data: any, requireAuth: boolean = true) => 
    apiRequest<T>(endpoint, "PUT", data, requireAuth),
  
  patch: <T>(endpoint: string, data: any, requireAuth: boolean = true) => 
    apiRequest<T>(endpoint, "PATCH", data, requireAuth),
  
  delete: <T>(endpoint: string, requireAuth: boolean = true) => 
    apiRequest<T>(endpoint, "DELETE", null, requireAuth),
};
