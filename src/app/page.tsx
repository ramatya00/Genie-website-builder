"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const router = useRouter();

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => toast.error(error.message),
      onSuccess: (data) => router.push(`/projects/${data.id}`),
    })
  );

  return (
    <main className="">
      <div className="min-h-screen max-w-7xl mx-auto flex items-center justify-center flex-col gap-4">
        <Input
          className="max-w-[700px]"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          disabled={createProject.isPending}
          onClick={() => createProject.mutate({ value: value })}
        >
          Submit
        </Button>
      </div>
    </main>
  );
}
