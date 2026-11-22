"use client";

import { useEffect } from "react";

const STORAGE_KEY = "ventureos.chunk-reload";

function isChunkLoadError(reason: unknown): boolean {
  const message =
    reason instanceof Error
      ? reason.message
      : typeof reason === "string"
        ? reason
        : "";
  const name = reason instanceof Error ? reason.name : "";
  return (
    /loading chunk|chunkloaderror|failed to fetch dynamically imported module|importing a module script failed/i.test(
      message,
    ) || name === "ChunkLoadError"
  );
}

/** One automatic reload when dev/build delivers mismatched JS chunks (stale .next). */
export function ChunkRecovery() {
  useEffect(() => {
    const clearFlag = window.setTimeout(() => sessionStorage.removeItem(STORAGE_KEY), 12_000);

    const tryReload = (reason: unknown) => {
      if (!isChunkLoadError(reason)) return;
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      window.location.reload();
    };

    const onError = (event: ErrorEvent) => {
      tryReload(event.error ?? event.message);
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      tryReload(event.reason);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.clearTimeout(clearFlag);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}