import ProjectForm from "@/modules/home/ui/components/project-form";
import Image from "next/image";
import ProjectsList from "@/modules/home/ui/components/projects-list";

export default function Home() {
  return (
    <div className="flex flex-col max-w-7xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center ">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={70}
            height={70}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-2xl md:text-5xl text-center font-bold">
          Build something with Genie
        </h1>
        <p className="text-center text-lg md:text-xl text-muted-foreground">
          Create Apps & Websites by chatting with AI
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>
      <ProjectsList />
    </div>
  );
}
