"use client";

import { LoadingScreen } from "@/components/brand/loading-screen";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LoadingScreen message="VentureOS could not start">
          <div className="flex w-full flex-col gap-3 pt-2">
            <p className="text-center font-mono text-[11px] leading-5 text-muted-foreground">
              {error.message || "A critical error occurred."}
            </p>
            <Button type="button" className="w-full" onClick={() => reset()}>
              Try again
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => window.location.assign("/")}
            >
              Go to sign in
            </Button>
          </div>
        </LoadingScreen>
      </body>
    </html>
  );
}