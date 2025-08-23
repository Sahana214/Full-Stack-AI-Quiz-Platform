// /app/api/game/route.ts

import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import axios from "axios";
import { GameType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in" }, 
        { status: 401 });
    }

    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        gameType: type as GameType,
        timeStarted: new Date(),
        userId: session.user.id,
        title: topic,
      },
    });
    await prisma.topicCount.upsert({
      where: { topic },
      create: { topic, count: 1 },
      update: { count: { increment: 1 } },
    });

    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    const questions = data.questions ?? data.data;
    if (!questions || !Array.isArray(questions)) {
      console.error("No questions generated, response:", data);
      return NextResponse.json(
        { warning: "No questions generated, please try again later.", gameId: game.id },
        { status: 200 }
      );
    }
    if (type === "mcq") {
      const manyData = questions.map((q: any) => {
        let options = [...q.options];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: q.question,
          answer: q.correctAnswer ||  q.answer || q.correct_option || "UNKNOWN", 
          explanation: q.explanation || "",
          options,
          gameId: game.id,
          questionType: GameType.mcq,
        };
      });
      await prisma.question.createMany({ data: manyData });
    }

    if (type === "open_ended") {
      const manyData = questions.map((q: any) => ({
        question: q.question,
        answer: q.correctAnswer ||  q.answer || q.correct_option || "UNKNOWN", 
        explanation: q.explanation || "",
        gameId: game.id,
        questionType: GameType.open_ended,
      }));
      await prisma.question.createMany({ data: manyData });
    }

    return NextResponse.json({ id: game.id }, 
      { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, 
        { status: 400 });
    }

    console.error("Error in /api/game:", error);
    return NextResponse.json({ error: "Something went wrong" }, 
      { status: 500 });
  }
}
