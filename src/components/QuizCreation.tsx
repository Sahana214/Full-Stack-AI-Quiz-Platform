"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { CopyCheck, BookOpen } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation";
import LoadingQuestions from "@/components/LoadingQuestions";



const quizCreationSchema = z.object({
  //title: z.string().min(1, "Title must be atleast 4 characters long"),
  topic: z.string().min(1, "Topic must be atleast 4 characters long"),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(10),
})

type QuizCreationInput = z.infer<typeof quizCreationSchema>

export default function QuizCreation({ topic }: { topic: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [showLoader,setShowLoader]=React.useState(false);
  const [finished, setFinished] = React.useState(false);


  const form = useForm<QuizCreationInput>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topic,
      //topic: topic,
      type: "mcq",
      amount: 3,
    },
  })

  const onSubmit = async (values: QuizCreationInput) => {
    try {
      setIsPending(true)
      setShowLoader(true)
      console.log("Form submitted :", values)
      const response = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const result = await response.json()

      if (response.ok) {
        setFinished(true);
        setTimeout(()=>{
        // redirect to the page depending on type
        if (values.type === "mcq") {
          router.push(`/play/mcq/${result.id}`)
        } else {
          router.push(`/play/open_ended/${result.id}`)
        }
      },1000);
      } else {
        console.error("Failed to create quiz:", result)
        setShowLoader(false);
      }
    }
    catch (err) {
      console.error(err)
       setShowLoader(false);
    } finally {
      setIsPending(false)
    }
  }
  const type = form.watch("type");
  if(showLoader){
    return <LoadingQuestions finished={finished} />;
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bottom-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Quiz Creation</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a topic" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please provide any topic you would like to be quizzed on here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How many questions?"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          form.setValue("amount", e.target.value === "" ? 0 : parseInt(e.target.value , 10))
                        }
                        
                      />
                    </FormControl>
                    <FormDescription>
                      You can choose how many questions you would like to be quizzed on here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
              <div className="flex justify-between">
                <Button
                  type="button"
                  //variant={form.getValues("type") === "mcq" ? "black" : "secondary"}
                  className={`w-1/2 rounded-none rounded-l-lg  text-white font-bold  transition flex items-center gap-2 ${type === "mcq" ? "bg-black text-white font-bold" : "bg-gray-200 text-black"}`}
                  onClick={() => form.setValue("type", "mcq",{ shouldDirty: true })}
                 
                >
                  <CopyCheck className="w-4 h-4" /> Multiple Choice
                </Button>

                <Separator orientation="vertical" />

                <Button
                type="button"
                //variant={form.getValues("type") === "open_ended"  ? "bg-black text-white font-bold" : "bg-gray-200 text-gray-800}
                className={`w-1/2 rounded-none rounded-r-lg bg-black text-white font-bold flex items-center gap-2 ${type === "open_ended" ? "bg-black text-white font-bold" : "bg-gray-200 text-black"}`}
                onClick={() => form.setValue("type", "open_ended",{ shouldDirty: true })}
                
              >
              <BookOpen className="w-4 h-4" /> Open Ended
              </Button>
              </div>

              <Button className="bg-black  text-white font-bold " disabled={isPending} type="submit">
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
