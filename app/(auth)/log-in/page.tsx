'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { login }  from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { handleCredentialsSignin } from '@/actions/authAction';


export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
 const formSchema = login();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      Password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setisLoading(true);

    const result = await signIn("credentials", {
      email: data.email,
      Password: data.Password,

    });

    setisLoading(false);

    if (result?.ok) {
      toast.success("Login successful", {
        position: "top-right",
        autoClose: 5000,
      });
      router.push("/"); // Redirect to home or a desired page
    } else {
      toast.error(result?.error || "An error occurred", {
        position: "top-right",
        autoClose: 5000,
      });
    }

  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md p-8 space-y-8 border-[1px] border-zinc-300  bg-white rounded-2xl shadow-md">
        <div className="text-center py-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-3xl mb-6">
            LogIn
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="Password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex py-1 w-full  items-center">
              <Link href="/forgot-password" className="text-sm font-semibold text-zinc-500 hover:text-zinc-700">
                Forgot Password?
              </Link>
            </div>
            <div className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="w-full max-w-sm mx-auto p-3">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                </>
              ) : 'Sign In' }
            </Button>
          </div>

          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
