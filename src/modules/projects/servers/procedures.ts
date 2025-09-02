import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

export const projectsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "ID is required" }),
      })
    )
    .query(async ({ input }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!existingProject)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project Not Found.",
        });
      return existingProject;
    }),

  // Fixed: Now actually returns multiple projects
  getMany: baseProcedure
    .input(
      z
        .object({
          // Add optional filters if needed
          limit: z.number().min(1).max(100).default(50).optional(),
          offset: z.number().min(0).default(0).optional(),
        })
        .optional()
    )
    .query(async ({ input = {} }) => {
      return await prisma.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        skip: input.offset,
      });
    }),

  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, "Prompt is required.")
          .max(5000, "Prompt is too long."),
      })
    )
    .mutation(async ({ input }) => {
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              role: "USER",
              type: "PROMPT",
              content: input.value,
            },
          },
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});
