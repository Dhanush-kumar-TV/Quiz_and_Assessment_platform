import { NextResponse } from "next/server";

export async function GET() {
  const vars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "Set" : "Missing",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Missing",
    MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Missing",
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json(vars);
}
