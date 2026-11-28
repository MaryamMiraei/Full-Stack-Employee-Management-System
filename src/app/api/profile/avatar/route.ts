import { NextResponse } from "next/server";

export const GET = async () =>
  NextResponse.json(
    { message: "Avatar upload is disabled in the demo version." },
    { status: 410 },
  );

export const POST = async () =>
  NextResponse.json(
    { message: "Avatar upload is disabled in the demo version." },
    { status: 410 },
  );
