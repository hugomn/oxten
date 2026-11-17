import { createFileRoute } from "@tanstack/react-router";
import { waitlistSchema } from "@/lib/waitlist-schema";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const failed = "We couldn't save your request. Try again.";

export const Route = createFileRoute("/api/waitlist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const parsed = waitlistSchema.safeParse(body);
        if (!parsed.success)
          return json(
            {
              success: false,
              error: parsed.error.issues[0]?.message ?? "Enter a valid work email.",
            },
            400,
          );
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin
            .from("waitlist")
            .insert({ email: parsed.data.email });
          // A repeated email is treated as success.
          if (error && error.code !== "23505") return json({ success: false, error: failed }, 500);
          return json({ success: true });
        } catch {
          return json({ success: false, error: failed }, 500);
        }
      },
    },
  },
});
