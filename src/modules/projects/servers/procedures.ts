import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "ID is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
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
  getMany: protectedProcedure
    .input(
      z
        .object({
          // Add optional filters if needed
          limit: z.number().min(1).max(100).default(50).optional(),
          offset: z.number().min(0).default(0).optional(),
        })
        .optional()
    )
    .query(async ({ input = {}, ctx }) => {
      return await prisma.project.findMany({
        where: {
          userId: ctx.auth.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        skip: input.offset,
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, "Prompt is required.")
          .max(5000, "Prompt is too long."),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
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
