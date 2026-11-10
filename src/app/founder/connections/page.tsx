"use client";

import { useState } from "react";
import { AppShell } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { MOCK_RELATIONS } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { founderStartupId } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function Page() {
  const store = useStore();
  const startupId = store.session ? founderStartupId(store.session.email) : "";
  const live = store.db.actions.filter((action) => action.startupId === startupId && action.type === "connected");
  const people = [
    ...live.map((action) => ({
      id: action.investorEmail,
      name: action.investorName,
      organisation: action.organisation,
      email: action.investorEmail,
    })),
    ...MOCK_RELATIONS.filter((relation) => relation.type === "connected").map((relation) => ({
      id: relation.id,
      name: relation.investorName,
      organisation: relation.organisation,
      email: relation.id,
    })),
  ];
  return (
    <AppShell role="founder" title="Connections" subtitle="People you can write to from this device.">
      {people.length === 0 ? (
        <Empty />
      ) : (
        <div className="flex flex-col gap-4">
          {people.map((person) => (
            <Thread
              key={person.id}
              title={person.name}
              subtitle={person.organisation}
              startupId={startupId}
              investorEmail={person.email}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-border bg-white px-6 py-12 text-center">
      <p className="font-medium">No active connections yet.</p>
      <p className="mt-2 text-sm text-muted-foreground">When an investor connects, the conversation will appear here.</p>
    </div>
  );
}

function Thread({
  title,
  subtitle,
  startupId,
  investorEmail,
}: {
  title: string;
  subtitle: string;
  startupId: string;
  investorEmail: string;
}) {
  const store = useStore();
  const [body, setBody] = useState("");
  const notes = store.db.notes.filter((note) => note.startupId === startupId && note.investorEmail === investorEmail);
  return (
    <article className="rounded-2xl border border-border bg-white p-5">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <ul className="mt-4 flex flex-col gap-3">
        {notes.length === 0 ? <li className="text-sm text-muted-foreground">No notes yet.</li> : null}
        {notes.map((note) => (
          <li key={note.id} className="rounded-xl bg-muted px-4 py-3">
            <p className="text-sm">{note.body}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {note.author === "founder" ? "You" : "Investor"} · {timeAgo(note.at)}
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
