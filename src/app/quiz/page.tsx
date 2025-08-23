import QuizCreation from "@/components/QuizCreation";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Quiz | Quizzy",
};

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  const params = await searchParams;
  const topic = params?.topic ?? "";

  return <QuizCreation topic={topic} />;
}
