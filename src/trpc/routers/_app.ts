import { messagesRouter } from "@/modules/messages/servers/procedures";
import { projectsRouter } from "@/modules/projects/servers/procedures";
import { createTRPCRouter } from "../init";
import { usageRouter } from "@/modules/usage/server/procedures";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
  usage: usageRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
