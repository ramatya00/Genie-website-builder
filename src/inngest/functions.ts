import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system:
        "You are an expert next.js developer. You write readable, maintainable, and performant code.",
      model: gemini({ model: "gemini-2.0-flash" }),
    });
    const output = await codeAgent.run(
      `Write the following snippets: ${event.data.value}`
    );
    return { output };
  }
);
