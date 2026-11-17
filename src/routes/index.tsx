import { createFileRoute } from "@tanstack/react-router";
import page from "@/home/v5.html?raw";

// The home page is a self-contained document, served as is.
export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: () =>
        new Response(page, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=0, must-revalidate",
          },
        }),
    },
  },
});
