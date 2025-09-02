"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextAreaAutoSize from "react-textarea-autosize";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "@/modules/home/constants";

const formSchema = z.object({
  value: z
    .string()
    .min(1, "Prompt is required.")
    .max(5000, "Prompt is too long."),
});

export default function ProjectForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        // TODO: Invalidate usage status
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        // TODO: Redirect to pricing page if specific error
        toast.error(error.message);
      },
    })
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({
      value: values.value,
    });
  };

  const onSelect = (content: string) => {
    form.setValue("value", content, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const [isFocused, setIsFocused] = useState(false);
  const isPending = createProject.isPending;
  const isButtonDisabled = createProject.isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <section className="space-y-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
            isFocused && "shadow-xs"
          )}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <TextAreaAutoSize
                {...field}
                disabled={isPending}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={2}
                maxRows={8}
                className="pt-3 resize-none border-none w-full outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all bg-transparent"
                placeholder="What would you like to build?"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            )}
          />
          <div className="flex gap-x-2 justify-between items-end pt-2">
            <div className="text-[12px] text-muted-foreground font-mono">
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium">
                <span>&#8984;</span>
                <span>Enter</span>
              </kbd>
              &nbsp;to submit
            </div>
            <Button
              className={cn(
                "size-8 rounded-full",
                isButtonDisabled && "bg-muted-foreground border"
              )}
              disabled={isButtonDisabled}
            >
              {isPending && <Loader2Icon className="animate-spin" />}
              {!isPending && <ArrowUpIcon />}
            </Button>
          </div>
        </form>

        <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl mx-auto">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.title}
              variant="outline"
              onClick={() => onSelect(template.prompt)}
            >
              {template.emoji} {template.title}
            </Button>
          ))}
        </div>
      </section>
    </Form>
  );
}
