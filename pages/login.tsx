import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  import { signIn, useSession } from "next-auth/react"
  import { getToken } from "next-auth/jwt"

  export default function Login() {
    const session = useSession()
    console.log('data =>', session)
      return (
        <div className="container mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Please Login First</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4">
                <Button onClick={() => signIn('github')}>Login GitHub</Button>
                {/* <Button onClick={() => signOut()}>Logout</Button> */}

              </div>
            </CardContent>
          
          </Card>
        </div>
      )
  }
  export const getServerSideProps = async ( context: any ) => {
    const token = await getToken({
        req: context.req,
        secret: process.env.NEXTAUTH_SECRET
    })

    if (token) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
  }