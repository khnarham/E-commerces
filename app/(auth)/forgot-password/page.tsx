"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link, Loader2 } from "lucide-react"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { ApiResponse } from "@/types/Types"


const formSchema = z.object({
  email: z.string().email('Invalid email address'),
})
 
export default function ProfileForm() {
  // 1. Define your form.
  const [isLoading, setisLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })
 async function onSubmit(values: z.infer<typeof formSchema>) {
      setisLoading(true)
      try {
        const response  =  await axios.post('/api/forgot-Password', values);
        if(response) {
        toast({
          title: 'Success',
          description: response.data.message,
        });
      }
      setisLoading(false)

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message || 'There was a problem with your login. Please try again.';
        toast({
          title: 'Login Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        setisLoading(false);
      }
  

  }

  return (
    <>
    <section className="flex w-full min-h-screen justify-center items-center" >
    <div className="w-full max-w-sm md:py-5 py-3 px-3 border-[1px] m-4 border-zinc-300 rounded-xl">
    <div className="w-full flex items-center justify-center mt-2 py-2 lg:py-6">
      <h1 className="text-2xl font-bold text-zinc-900">Reset Password</h1>
    </div>
    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-600 font-semibold " >Email</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            
            <Button type="submit" disabled={isLoading} className="w-full  max-w-sm mx-auto p-3">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Sending Reset Mail...
                </>
              ) : 'Send Reset Mail' }
            </Button>
          

          </form>
        </Form>
  </div>
    </section>
    
    </>
  )
}