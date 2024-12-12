'use client'; 

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { Loader2 } from 'lucide-react';
import { useState } from "react";
import axios, { AxiosError } from 'axios';
import Link from "next/link";
import { AuthFormSchema } from "@/lib/utils";
import { ApiResponse, AuthParams } from "@/types/Types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; 

export function Authform({ type }: AuthParams) {
  const formSchema = AuthFormSchema(type);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      Password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (type === 'SignUp') {
        const response = await axios.post<ApiResponse>('/api/sign-up', values);
        toast({
          title: 'Success',
          description: response.data.message,
        });
        router.replace(`/verify/${response.data._id}`);

      } 
    } catch (error) {
      console.error('Error during login:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message || 'There was a problem with your login. Please try again.';
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md md:py-5 px-3 border-[1px] m-4 border-zinc-300 rounded-xl">
      <div className="w-full flex items-center justify-center mt-2 py-2 lg:py-6">
        <h1 className="text-3xl font-bold text-zinc-900">{type}</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {type === 'SignUp' && (
            <div className="flex flex-col lg:px-6 py-4 p-2 gap-4">
              <CustomFormField
                control={form.control}
                name="username"
                label="Username"
                placeholder="Enter your name"
              />
              <CustomFormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <CustomFormField
                control={form.control}
                name="Password"
                label="Password"
                placeholder="Enter your password"
              />
            </div>
          )}

         

          <div className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="w-full max-w-sm mx-auto p-3">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                </>
              ) : type === 'Login' ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>

          <footer className="flex mx-auto gap-3 p-2 w-full max-w-xs justify-center items-center">
            <p className="text-zinc-700 text-sm font-semibold">
              {type === 'Login' ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Link href={type === 'Login' ? '/sign-up' : '/log-in'} className="text-black font-bold text-md">
              {type === 'Login' ? 'Sign up' : 'Sign in'}
            </Link>
          </footer>
        </form>
      </Form>
    </div>
  );
}
