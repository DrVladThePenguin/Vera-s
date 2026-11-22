"use client";

import { useState } from "react";
import { useCatalog } from "@/components/app/catalog";
import { AppShell } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";

export default function Page() {
  const store = useStore();
  const catalog = useCatalog();
  const email = store.session?.email ?? "";
  const connections = store.db.actions.filter((action) => action.investorEmail === email && action.type === "connected");
  return (
    <AppShell role="investor" title="Connections" subtitle="Founders you have asked to meet.">
      {connections.length === 0 ? (
        <div className="panel px-6 py-12 text-center">
          <p className="font-medium">No connections yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">Connect from a startup profile to start a note.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {connections.map((connection) => {
            const startup = catalog.find((item) => item.id === connection.startupId);
            return (
              <ConnectionCard
                key={connection.id}
                startupId={connection.startupId}
                investorEmail={email}
                title={startup?.name || "Startup"}
                subtitle={startup?.founder.name || ""}
              />
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

function ConnectionCard({
  startupId,
  investorEmail,
  title,
  subtitle,
}: {
  startupId: string;
  investorEmail: string;
  title: string;
  subtitle: string;
}) {
  const store = useStore();
  const [body, setBody] = useState("");
  const notes = store.db.notes.filter((note) => note.startupId === startupId && note.investorEmail === investorEmail);
  return (
    <article className="panel p-5">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <ul className="mt-4 flex flex-col gap-3">
        {notes.map((note) => (
          <li key={note.id} className="rounded-none bg-muted px-4 py-3">
            <p className="text-sm">{note.body}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {note.author === "investor" ? "You" : "Founder"} · {timeAgo(note.at)}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col gap-3">
        <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write a short note" />
        <Button
          className="self-end"
          onClick={() => {
            store.addNote(startupId, investorEmail, body);
            setBody("");
          }}
        >
          Send note
        </Button>
      </div>
    </article>
  );
}
