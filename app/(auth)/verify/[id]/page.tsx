'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/VerifySchema';
import { ApiResponse } from '@/types/Types';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function VerifyAccount() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  console.log('Params:', params); 

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log('params ID:' ,  params.id );
    
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verifyCode`, {
        userId: params.id,
        code: data.code,
      });

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: response.data.message,
        });
        router.push('/');
      } else {
        toast({
          title: 'Error',
          description: response.data.message,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
      });
       setIsLoading(false)
    } 
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex   flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="w-full  max-w-[120px]  mx-auto p-3 ">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Veryfing...
                    </>
                  ) : 'Verify'
                }
                </Button>
              </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
