import { generateText, Output } from "ai";
import { z } from "zod";
import { NextRequest } from "next/server";

const SuggestionsSchema = z.object({
  suggestions: z.array(
    z.object({
      text: z.string().describe("The task description"),
      priority: z.enum(["low", "medium", "high"]).describe("Task priority"),
      reason: z.string().describe("Why this task is suggested"),
    })
  ),
});

export async function POST(request: NextRequest) {
  let body: { existingTodos?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { existingTodos, locale } = body;

  // Validate inputs
  if (!Array.isArray(existingTodos)) {
    return Response.json({ error: "existingTodos must be an array" }, { status: 400 });
  }

  const lang = locale === "zh" ? "Chinese (Simplified)" : "English";
  const existingList =
    existingTodos.length > 0
      ? existingTodos
          .filter((t): t is { text: string } => typeof t?.text === "string")
          .map((t) => `- ${t.text}`)
          .join("\n")
      : "(none yet)";

  try {
    const { output } = await generateText({
      model: "anthropic/claude-sonnet-4.6",
      output: Output.object({ schema: SuggestionsSchema }),
      system: `You are a helpful productivity assistant. Analyze the user's existing todo list and suggest 3 new, actionable tasks that complement what they are working on. Respond in ${lang}. Keep task text concise (under 60 characters). Vary the priorities.`,
      prompt: `The user's current todo list:\n${existingList}\n\nSuggest 3 new tasks that would be helpful and complementary.`,
    });

    return Response.json(output);
  } catch (err) {
    console.error("[/api/suggest] AI generation failed:", err);
    return Response.json(
      { error: "Failed to generate suggestions" },
      { status: 502 }
    );
  }
}
