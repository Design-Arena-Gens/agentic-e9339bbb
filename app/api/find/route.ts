import { NextResponse } from "next/server";
import {
  FinderResponse,
  EmailFinderInput,
  generateEmailHypotheses
} from "@/lib/emailFinder";

function parsePayload(data: unknown): EmailFinderInput {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid payload");
  }

  const payload = data as Partial<EmailFinderInput>;

  return {
    firstName: payload.firstName ?? "",
    lastName: payload.lastName ?? "",
    domain: payload.domain ?? "",
    company: payload.company ?? "",
    clues: payload.clues ?? ""
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const params = parsePayload(body);
    const result: FinderResponse = generateEmailHypotheses(params);

    return NextResponse.json({
      ok: true,
      result
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 400 }
    );
  }
}
