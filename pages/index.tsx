import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Drawer, DrawerContent } from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import useSWR from 'swr'
import FormContainer from '@/container/FormContainer'
import { useState, useRef } from 'react'
import { getToken } from 'next-auth/jwt'
import { useSession, signOut } from 'next-auth/react'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home() {
  const session = useSession()
  const popoverRef = useRef<HTMLButtonElement | null>(null)
  const [showCreate, setShowCreate] = useState<boolean>(false)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [valueEdit, setShowValueEdit] = useState<{
    id: number
    title: string
    url: string
  }>({
    id: 0,
    title: '',
    url: '',
  })
  const { data: dataLinks, isLoading, mutate } = useSWR('/api/links', fetcher)
  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/links/delete/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
    } finally {
      popoverRef.current?.click()
      mutate()
    }
  }
  return (
    <>
      <div className="container">
      <div className="flex justify-between gap-8">
        <h1 className="text-2xl font-bold">{`Hello ${session.data?.user?.name}👋`}</h1>
        <Button className='text-red-500 text-lg font-semibold' variant="outline" size="lg" onClick={() => signOut()}>
            Sign out
          </Button>
        
        </div>
        
          <h2 className="text-xl text-gray-500 font-semibold">
            📧 {session.data?.user?.email}
          </h2>
         

        <p className="text-lg">
          This is an area where you can create and manage your links, Let's
          create some links!
        </p>
      </div>
      <div className="flex justify-end py-4">
        <Button onClick={() => setShowCreate(true)}>Create Link</Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {isLoading && <p>Loading ...</p>}
        {dataLinks?.data?.map(
          (link: { id: number; url: string; title: string }) => (
            <Card key={link.id}>
              <CardContent className="flex justify-between">
                <a href={link.url} target="_blank">
                  {link.title}
                </a>
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowEdit(true)
                      setShowValueEdit({
                        id: link.id,
                        title: link.title,
                        url: link.url,
                      })
                    }}
                  >
                    Edit
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        ref={popoverRef}
                        className="text-red-600"
                        variant="ghost"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p>Are you sure you want to delete this data?</p>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(link.id)}
                      >
                        Yes
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>
      {/* Drawer Create */}
      <Drawer open={showCreate} onOpenChange={setShowCreate}>
        <DrawerContent>
          <div className="container mx-auto p-4">
            <FormContainer
              onFinished={() => {
                setShowCreate(false), mutate()
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
      {/* Drawer Edit */}
      <Drawer open={showEdit} onOpenChange={setShowEdit}>
        <DrawerContent>
          <div className="container mx-auto p-4">
            <FormContainer
              id={valueEdit.id}
              values={{
                title: valueEdit.title,
                url: valueEdit.url,
              }}
              onFinished={() => {
                setShowEdit(false), mutate()
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export const getServerSideProps = async (context: any) => {
  const token = await getToken({
    req: context.req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
