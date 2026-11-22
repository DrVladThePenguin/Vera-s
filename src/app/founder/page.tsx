"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BootScreen } from "@/components/brand/logo";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/founder/investors");
  }, [router]);
  return <BootScreen />;
}