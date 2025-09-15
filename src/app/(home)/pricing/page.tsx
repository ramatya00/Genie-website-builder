"use client";

import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useCurrentTheme } from "@/hooks/use-current-theme";

export default function PricingPage() {
  const currentTheme = useCurrentTheme();
  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] lg:pt-24">
        <h1 className="text-xl md:text-4xl text-center font-bold">Pricing</h1>
        <p className="text-center text-sm md:text-base text-muted-foreground">
          Choose the plan that best fits your needs.
        </p>
        <PricingTable
          appearance={{
            baseTheme: currentTheme === "dark" ? dark : undefined,
          }}
        />
      </section>
    </div>
  );
}
