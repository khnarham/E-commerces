'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { Reset } from '@/lib/utils'; // Assuming this is your utility for handling requests
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { ApiResponse } from '@/types/Types';

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = Reset(); 
  const Params = useParams<{ id: string }>();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Password: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
      
    setIsLoading(true);
    try {
        
      const result = await axios.post<ApiResponse>('/api/Reset-password', {
        Token: Params.id,
        Password: data.Password,
      });

      if (result) {
        toast({
          title: 'Reset successful',
          description: 'Your password has been reset successfully.',
        });
      }
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: 'Failed to reset password. Please try again.',
        variant: 'destructive', 
      });
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 border-[1px] border-zinc-300 bg-white rounded-2xl shadow-md">
        <div className="text-center py-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-3xl mb-6">
            Reset Password
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={isLoading} className="w-full max-w-sm mx-auto p-3">
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp; Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
