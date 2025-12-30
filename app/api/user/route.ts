import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data },
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
