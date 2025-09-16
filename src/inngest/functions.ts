import { inngest } from "./client";
import {
  createAgent,
  createTool,
  createNetwork,
  openai,
  Tool,
  type Message,
  createState,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistanceTextMessageContent } from "./utils";
import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/lib/prompt";
import prisma from "@/lib/db";
import { SANDBOX_TIMEOUT } from "@/lib/types";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-next-js-ramatya-3");
      await sandbox.setTimeout(SANDBOX_TIMEOUT);
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];
        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }

        return formattedMessages.reverse();
      }
    );

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      }
    );

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1",
        apiKey: process.env.OPENAI_API_KEY,
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffer = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffer.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffer.stderr += data;
                  },
                });

                return result.stdout;
              } catch (error) {
                console.error(
                  `Command failed: ${error} \nstdout: ${buffer.stdout} \nstderr: ${buffer.stderr} `
                );
                return `Command failed: ${error} \nstdout: ${buffer.stdout} \nstderr: ${buffer.stderr} `;
              }
            });
          },
        }),

        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return updatedFiles;
                } catch (error) {
                  return `Error: ${error}`;
                }
              }
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),

        createTool({
          name: "readFiles",
          description: "Read Files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const fileContent = await sandbox.files.read(file);
                  contents.push({ file, content: fileContent });
                }
                return JSON.stringify(contents);
              } catch (error) {
                return `Error: ${error}`;
              }
            });
          },
        }),
      ],

      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistanceTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 5,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) return;
        return codeAgent;
      },
    });

    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "a fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        model: "gpt-4o",
        apiKey: process.env.OPENAI_API_KEY,
      }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "a response generator",
      system: RESPONSE_PROMPT,
      model: openai({
        model: "gpt-4o",
        apiKey: process.env.OPENAI_API_KEY,
      }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary
    );
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary
    );

    const generateFragmentTitle = () => {
      const textMessages = fragmentTitleOutput.filter(
        (msg) => msg.type === "text"
      );

      if (textMessages.length === 0) return "Fragment";

      const firstTextMessage = textMessages[0];
      if (Array.isArray(firstTextMessage.content)) {
        return firstTextMessage.content.map((txt) => txt).join("");
      } else {
        return firstTextMessage.content;
      }
    };

    const generateResponse = () => {
      const textMessages = responseOutput.filter((msg) => msg.type === "text");

      if (textMessages.length === 0) return "Here you go";

      const firstTextMessage = textMessages[0];
      if (Array.isArray(firstTextMessage.content)) {
        return firstTextMessage.content.map((txt) => txt).join("");
      } else {
        return firstTextMessage.content;
      }
    };

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandbloxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. Please try again",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: generateResponse(),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandbloxUrl,
              title: generateFragmentTitle(),
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandbloxUrl,
      title: generateFragmentTitle(),
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
