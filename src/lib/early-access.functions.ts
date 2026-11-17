import { createServerFn } from "@tanstack/react-start";
import { earlyAccessSchema } from "./early-access";

// Public write-only intake: validation precedes privileged access; no rows are returned.
export const requestEarlyAccess = createServerFn({ method: "POST" })
  .inputValidator(earlyAccessSchema)
  .handler(async ({ data }) => {
    if (data.website) return { success: true };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("early_access_requests").upsert(
      { email: data.email },
      { onConflict: "email", ignoreDuplicates: true },
    );
    if (error) {
      console.error("Early access submission failed", error.code);
      return { success: false };
    }
    return { success: true };
  });