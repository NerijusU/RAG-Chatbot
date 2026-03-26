import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Checks whether Supabase is reachable and the rag_chunks table is queryable.
 *
 * @param none - Route handler receives no custom parameters.
 * @returns JSON response containing health status and optional error details.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("rag_chunks").select("id").limit(1);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: "Supabase connected but query failed.",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Supabase connection is working.",
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    return NextResponse.json(
      {
        ok: false,
        message: "Supabase health check failed.",
        error: message,
      },
      { status: 500 },
    );
  }
}
