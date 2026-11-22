"use client";

import Link from "next/link";
import { AppShell } from "@/components/app/shell";
import { PersonMark } from "@/components/onboarding/widgets";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

export default function Page() {
  const { investor } = useStore();
  if (!investor) return <AppShell role="investor" title="Profile" />;
  return (
    <AppShell role="investor" title="Investor profile" subtitle="Founders see this when you connect.">
      <section className="panel p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-4">
            <PersonMark name={investor.fullName} photo={investor.photoDataUrl} avatarId={investor.avatarId} size={72} />
            <div>
              <h2 className="text-xl font-semibold">{investor.fullName}</h2>
              <p className="text-sm text-muted-foreground">
                {[investor.jobTitle, investor.organisation, investor.location].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
          <Link href="/onboarding/investor?edit=2" className="text-sm font-medium text-primary">
            Edit profile
          </Link>
        </div>
        <p className="mt-6 text-sm leading-6 text-muted-foreground">{investor.bio}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone="primary">{investor.investorType}</Badge>
          {investor.industries.map((item) => (
            <Badge key={item} tone="soft">{item}</Badge>
          ))}
          {investor.stages.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          Ticket {investor.ticketMin} – {investor.ticketMax}
          {investor.geographies.length ? ` · ${investor.geographies.join(", ")}` : ""}
        </p>
        {investor.history ? <p className="mt-4 text-sm leading-6">{investor.history}</p> : null}
      </section>
    </AppShell>
  );
}
