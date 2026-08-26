import { NextResponse } from "next/server";
import { notifyReporter } from "@/lib/notify";

export async function GET() {
  await notifyReporter("91XXXXXXXXXX", {
    caseId: "test-case-123",
    ngoName: "Test NGO",
  });

  return NextResponse.json({ success: true });
}