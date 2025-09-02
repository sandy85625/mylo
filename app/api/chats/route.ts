import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import Chat from "@/models/Chat";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export async function GET() {
  await dbConnect();

  const now = new Date();

  // cutoff = 21:30 UTC (which is 3:00 AM IST)
  const cutoff = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      21,
      30,
      0,
      0
    )
  );

  // if current UTC time is before 21:30, use yesterday’s 21:30 UTC
  if (now < cutoff) {
    cutoff.setUTCDate(cutoff.getUTCDate() - 1);
  }

  const chats = await Chat.find({
    timestamp: { $gte: cutoff },
  }).sort({ timestamp: 1 });

  return NextResponse.json(chats);
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
    };

    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const chat = await Chat.create({
      userId: decoded.id,
      username: decoded.username,
      text,
    });

    return NextResponse.json(chat);
  } catch (err: unknown) {
    let message = "An unknown error occurred";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json(
      { error: "Server error: " + message },
      { status: 500 }
    );
  }
}
