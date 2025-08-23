import { NextResponse } from "next/server";
import { generateOpenEndedQnA, generateMCQs } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";

export async function POST(req: Request) {
  const session = await getAuthSession();

//  if (!session) {
//    return NextResponse.json(
//      {
//         error: "Unauthorized" 
//      },
//      { 
//      status: 401
//    }
//  );
 // }
  try {
    const { amount, topic, type } = await req.json();

    if (!amount || !topic || !type) {
      return NextResponse.json(
        { error: "amount, topic, and type are required" },
        { 
          status: 400
        }
      );
    }

    let data;
    if (type === "open_ended") {
      data = await generateOpenEndedQnA(amount, topic);
    } else if (type === "mcq") {
      data = await generateMCQs(amount, topic);
    } else {
      return NextResponse.json({ error: "Invalid type" }, 
        { status: 400 });
    }

    return NextResponse.json({ type, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate questions" },
       { status: 500 });
  }
}
