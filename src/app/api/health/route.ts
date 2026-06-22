import { NextResponse } from "next/server";

// Lightweight liveness probe (used by deploy checks / uptime monitoring).
// Does not touch the database, so it stays green even if Postgres is down.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "zerubabel.et",
    timestamp: new Date().toISOString(),
  });
}
