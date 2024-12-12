import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const AuthFormSchema =( type: string ) => z.object ({
  username: z.string().min(3),
  email: z.string().email(),
  Password: z.string().min(8),
})
export const login = () => {
  return z.object({
    email: z.string().email('Invalid email address'),
    Password: z.string().min(8, 'Password must be at least 8 characters long'),
  });
};


export const Forgot = () => {
  return z.object({
    email: z.string().email('Invalid email address'),
  });
};
export const Reset = () => {
  return z.object({
    Password: z.string().min(8, 'Password must be at least 8 characters long'),
  });
};
