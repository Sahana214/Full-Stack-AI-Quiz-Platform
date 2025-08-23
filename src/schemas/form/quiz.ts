// src/schemas/form/quiz.ts
import { z } from "zod";

export const quizCreationSchema = z.object({
  topic: z.string().min(1, "Title  must be atleast 4 characters long"),
  //topic: z.string().min(4, "Topic must be atleast 4 characters long"),
  amount: z.coerce.number().min(1).max(10),
  type: z.enum(["mcq", "open_ended"]),
});


export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userInput: z.string().or(z.undefined()),
  answer: z.string().optional(),
}).transform((data) => ({
  questionId: data.questionId,
  userInput: data.userInput ?? data.answer ?? "",
}));

export const endGameSchema = z.object({
  gameId: z.string(),
});
