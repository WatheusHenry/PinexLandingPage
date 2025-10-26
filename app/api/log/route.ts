import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, timestamp, ...data } = body;

    // Log no console da Vercel
    console.log(
      JSON.stringify({
        type: "SIDEBAR_EVENT",
        event,
        timestamp,
        data,
        userAgent: request.headers.get("user-agent"),
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar log:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao processar log" },
      { status: 500 }
    );
  }
}
