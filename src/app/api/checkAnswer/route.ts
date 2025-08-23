// /app/api/checkAnswer/route.ts

import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import stringSimilarity from "string-similarity";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    //console.log("👉 Raw request body:", body);

    const { questionId, userInput } = checkAnswerSchema.parse(body);

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }

    await prisma.question.update({
      where: { id: questionId },
      data: { userAnswer: userInput },
    });

    
    if (!question.answer || question.answer.trim() === "") {
      return NextResponse.json({
        message: "No correct answer set for this question.",
        isCorrect: null,
        percentageSimilar: null,
      });
    }

    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.toLowerCase().trim() === userInput.toLowerCase().trim();

      await prisma.question.update({
        where: { id: questionId },
        data: { isCorrect },
      });

      return NextResponse.json({ isCorrect });
    }

    if (question.questionType === "open_ended") {
      let percentageSimilar = stringSimilarity.compareTwoStrings(
        question.answer.toLowerCase().trim(),
        userInput.toLowerCase().trim()
      );

      percentageSimilar = Math.round(percentageSimilar * 100);

      await prisma.question.update({
        where: { id: questionId },
        data: { percentageCorrect: percentageSimilar },
      });

      return NextResponse.json({ percentageSimilar });
    }

    return NextResponse.json({ message: "Unsupported question type" }, { status: 400 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.issues }, { status: 400 });
    }

    console.error("Error in /api/checkAnswer:", error);
    return NextResponse.json({ message: "Something went wrong" },
       { status: 500 });
  }
}
