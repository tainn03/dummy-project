import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "Hello from Task Manager API!",
    message: "This is a client-side only prototype using mock data",
  });
}
