"use client";

import { GrainientCard } from "@/components/ui/grainient-card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BLUE = ["#0066FF", "#3385FF", "#66A3FF", "#99C2FF", "#CCE0FF", "#171717"];

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GrainientCard as="section" className="p-5" tint="subtle">
      <h2 className="text-meta mb-4 text-foreground normal-case">{title}</h2>
      <div className="relative z-[1] h-64">{children}</div>
    </GrainientCard>
  );
}

export function ViewsChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid stroke="#E8EAF0" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#0066FF" fill="#0066FF" fillOpacity={0.12} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function InterestChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid stroke="#E8EAF0" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#0066FF" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RatioChart({ interested, passed }: { interested: number; passed: number }) {
  const data = [
    { name: "Interested", value: interested },
    { name: "Passed", value: passed },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={3}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={BLUE[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function DistributionChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid stroke="#E8EAF0" horizontal={false} />
        <XAxis type="number" tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
        <Tooltip />
        <Bar dataKey="value" fill="#0066FF" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DualChart({ data }: { data: { label: string; viewed: number; interested: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid stroke="#E8EAF0" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="viewed" fill="#99C2FF" radius={[6, 6, 0, 0]} />
        <Bar dataKey="interested" fill="#0066FF" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
