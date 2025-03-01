import { useForm } from 'react-hook-form' 
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'

export const formSchema = z.object({
    title: z.string().min(1),
    url: z.string().min(1),
  })
  export type FormType = z.infer<typeof formSchema>
export default function useFormAction({
    values,
}: {
    values?: FormType
}) {
     const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: '',
          url: '',
        },
      })   
      
      useEffect(() => {
        if (values && Object.keys(values).length > 0 ) {
            form.reset(values)}
      }, [values, form])
      return { form }
}