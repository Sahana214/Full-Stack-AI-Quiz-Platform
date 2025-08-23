
import SignInButton from "@/components/SignInButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";


export default async function Home() {
  const session =await getAuthSession()
  if(session?.user){
    return redirect('/dashboard')
  }
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>welcome to Quizzy</CardTitle>
          <CardDescription>
            Quizzy is a quiz app that allows you to create and share quiz with your friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text="Sign In with Google!"  className="bg-black text-white border "/>
        </CardContent>
      </Card>
    </div>

  );
}




