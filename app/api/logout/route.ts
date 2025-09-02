import { NextResponse } from "next/server";

export async function POST() {
  // overwrite auth cookie with expired date
  const response = NextResponse.json(
    { message: "Signed out" },
    { status: 200 }
  );
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // expire immediately
  });
  return response;
}
