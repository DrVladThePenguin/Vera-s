"use client";

import { ChevronDown } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { AVATARS } from "@/lib/types";
import { cn, initials } from "@/lib/utils";
import { readImageFile } from "@/lib/images";

export function Field({
  label,
  hint,
  error,
  required,
  counter,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  counter?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2" data-invalid={error ? true : undefined}>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required ? <span className="text-primary"> *</span> : null}
        </label>
        {counter ? <span className="text-xs tabular-nums text-muted-foreground">{counter}</span> : null}
      </div>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm leading-5 text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder = "Select",
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-12 w-full appearance-none rounded-none border-hairline border bg-white px-3.5 pr-10 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15",
          invalid ? "border-destructive" : "border-border",
          value ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export function Chips({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() =>
              onChange(selected ? value.filter((item) => item !== option) : [...value, option])
            }
            className={cn(
              "h-10 rounded-full border px-3.5 text-sm transition",
              selected
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-white text-foreground hover:bg-muted",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function KindToggle({
  value,
  onChange,
}: {
  value: "actual" | "estimate";
  onChange: (value: "actual" | "estimate") => void;
}) {
  return (
    <div className="flex h-10 rounded-none border-hairline border p-1">
      {(["actual", "estimate"] as const).map((kind) => (
        <button
          key={kind}
          type="button"
          aria-pressed={value === kind}
          onClick={() => onChange(kind)}
          className={cn(
            "flex-1 rounded-lg text-sm capitalize",
            value === kind ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {kind}
        </button>
      ))}
    </div>
  );
}

export function PersonMark({
  name,
  photo,
  avatarId,
  size = 48,
}: {
  name: string;
  photo?: string;
  avatarId?: string;
  size?: number;
}) {
  const avatar = AVATARS.find((item) => item.id === avatarId) ?? AVATARS[0];
  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full text-sm font-medium"
      style={{ width: size, height: size, background: avatar.bg, color: avatar.fg }}
    >
      {initials(name)}
    </span>
  );
}

export function PhotoPicker({
  name,
  photo,
  avatarId,
  onPhoto,
  onAvatar,
}: {
  name: string;
  photo: string;
  avatarId: string;
  onPhoto: (value: string) => void;
  onAvatar: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <PersonMark name={name} photo={photo} avatarId={avatarId} size={72} />
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex h-10 cursor-pointer items-center rounded-none border-hairline border px-3.5 text-sm font-medium hover:bg-muted">
            Upload photograph
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                const dataUrl = await readImageFile(file, 480);
                onPhoto(dataUrl);
              }}
            />
          </label>
          {photo ? (
            <button type="button" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => onPhoto("")}>
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {AVATARS.map((avatar) => {
          const selected = !photo && avatarId === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              aria-label={`Sample avatar ${avatar.id}`}
              aria-pressed={selected}
              onClick={() => {
                onAvatar(avatar.id);
                onPhoto("");
              }}
              className={cn(
                "grid size-12 place-items-center rounded-full text-sm font-medium",
                selected ? "ring-2 ring-primary ring-offset-2" : "ring-1 ring-border",
              )}
              style={{ background: avatar.bg, color: avatar.fg }}
            >
              {initials(name)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const { invalid, ...rest } = props;
  return <Input aria-invalid={invalid || undefined} {...rest} />;
}

export function AreaInput(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean },
) {
  const { invalid, ...rest } = props;
  return <Textarea aria-invalid={invalid || undefined} {...rest} />;
}

export function count(value: string, max: number) {
  return `${value.length}/${max}`;
}
