"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function ProjectsList() {
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  const { user } = useUser();
  return (
    <div>
      {projects?.length !== 0 && user?.id && (
        <div className="w-full dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">
          <h2 className="text-2xl font-bold">
            {user?.firstName}&apos;s generated projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {projects?.length === 0 && (
              <div className="col-span-full text-center">
                <p className="text-sm text-muted-foreground">
                  No projects found
                </p>
              </div>
            )}
            {projects?.map((project) => (
              <Button
                key={project.id}
                variant="outline"
                className="font-normal h-auto justify-start w-full text-start p-4"
                asChild
              >
                <Link href={`/projects/${project.id}`}>
                  <div className="flex items-center gap-x-4">
                    <Image
                      src="/logo.svg"
                      alt="Logo"
                      width={35}
                      height={35}
                      className="object-contain"
                    />
                    <div className="flex flex-col">
                      <h3 className="truncate font-bold">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(project.updatedAt, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
