import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useFormAction from '@/hooks/useFormAction'
import { FormType } from '@/hooks/useFormAction'
import { useState } from 'react'
import { on } from 'events'

export default function FormContainer({
    id,
    values,
    onFinished,
}: {
    id?: number
    values?: FormType
    onFinished?: () => void
}) {
    const [loading, setLoading] = useState<boolean>(false)
    const { form } = useFormAction({ values })
    const onSubmit = async (values: FormType) => {
        setLoading(true)
        console.log(values)
        try {
            const type = id? 'patch' : 'post'

            const mapping = {
                post: {
                    method: 'POST',
                    url: '/api/links/create'
                },
                patch: {
                    method: 'PATCH',
                    url: `/api/links/edit/${id}`
                },
            }
          await fetch(mapping[type].url, {
            method: mapping[type].method,
            body: JSON.stringify(values),
          })
        } catch (error) {
        } finally {
          onFinished?.()
          if (!id) form.reset()  
          setLoading(false)
        }
      }
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url</FormLabel>
                <FormControl>
                  <Input placeholder="url ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading ...' : 'Submit'}
          </Button>
        </form>
      </Form>
    )
}