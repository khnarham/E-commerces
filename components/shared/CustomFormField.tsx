import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { AuthFormSchema } from '@/lib/utils'

const formSchema = AuthFormSchema('signUp')

interface CustomField {
  control: Control<z.infer<typeof formSchema>>,
  name: FieldPath<z.infer<typeof formSchema>>,
  label: string,
  placeholder: string,
}

const CustomFormField = ({ control, label, name, placeholder }: CustomField) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => ( 
        <FormItem>
          <FormLabel className='text-sm px-1 text-zinc-700 font-bold'>{label}</FormLabel>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input 
                placeholder={placeholder}
                className="text-xs font-medium"
                type={name === 'Password' ? 'password' : 'text'}
                {...field}
              />
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
