import { createServerFn } from "@tanstack/react-start";
import { waitlistSchema } from "./waitlist-schema";

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => waitlistSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("waitlist").insert({ email: data.email });
    if (error && error.code !== "23505")
      return { success: false, error: "We couldn't save your request. Please try again." };
    return { success: true, error: null };
  });
