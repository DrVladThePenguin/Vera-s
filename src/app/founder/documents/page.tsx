"use client";

import { X } from "lucide-react";
import { AppShell } from "@/components/app/shell";
import { useStore } from "@/lib/store";
import type { DocCategory } from "@/lib/types";
import { formatBytes, uid } from "@/lib/utils";

const GROUPS: { category: DocCategory; label: string }[] = [
  { category: "pitch", label: "Pitch deck" },
  { category: "financials", label: "Financial statements" },
  { category: "presentation", label: "Company presentation" },
  { category: "other", label: "Additional documents" },
];

export default function Page() {
  const store = useStore();
  const documents = store.founder?.documents ?? [];
  return (
    <AppShell role="founder" title="Documents" subtitle="Files saved with your company profile on this device.">
      <div className="flex flex-col gap-4">
        {GROUPS.map((group) => {
          const files = documents.filter((doc) => doc.category === group.category);
          return (
            <section key={group.category} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-medium">{group.label}</h2>
                <label className="inline-flex h-10 cursor-pointer items-center rounded-xl bg-primary px-3.5 text-sm font-medium text-primary-foreground">
                  Upload
                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(event) => {
                      const picked = Array.from(event.target.files ?? []);
                      event.target.value = "";
                      store.updateFounder((current) => ({
                        ...current,
                        documents: [
                          ...current.documents,
                          ...picked.map((file) => ({
                            id: uid(),
                            name: file.name,
                            type: file.type || "file",
                            size: file.size,
                            category: group.category,
                          })),
                        ],
                      }));
                    }}
                  />
                </label>
              </div>
              {files.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">Nothing uploaded in this section.</p>
              ) : (
                <ul className="mt-4 flex flex-col gap-2">
                  {files.map((file) => (
                    <li key={file.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted px-3 py-2">
                      <span>
                        <span className="block text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {file.type || "File"} · {formatBytes(file.size)}
                        </span>
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        onClick={() =>
                          store.updateFounder((current) => ({
                            ...current,
                            documents: current.documents.filter((item) => item.id !== file.id),
                          }))
                        }
                      >
                        <X className="size-4 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
