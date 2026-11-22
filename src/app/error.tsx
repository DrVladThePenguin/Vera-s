"use client";

import { useEffect } from "react";
import { LoadingScreen } from "@/components/brand/loading-screen";
import { Button } from "@/components/ui/button";

function isChunkLoadError(error: Error): boolean {
  return /loading chunk|chunkloaderror|failed to fetch dynamically imported module/i.test(error.message);
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const staleBundle = isChunkLoadError(error);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <LoadingScreen message={staleBundle ? "Refreshing after an update…" : "Something went wrong"}>
      <div className="flex w-full flex-col gap-3 pt-2">
        <p className="text-center font-mono text-[11px] leading-5 text-muted-foreground">
          {staleBundle
            ? "The app was rebuilt while this tab was open. Reload once to fetch the latest code."
            : "Try again. If this keeps happening, run npm run dev:clean and hard-refresh the browser."}
        </p>
        <Button
          type="button"
          className="w-full"
          onClick={() => {
            if (staleBundle) {
              window.location.reload();
              return;
            }
            reset();
          }}
        >
          {staleBundle ? "Reload page" : "Try again"}
        </Button>
      </div>
    </LoadingScreen>
  );
}