"use client";
import { useState } from "react"; // Added useState
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus, Bell, LogIn, Loader2 } from "lucide-react"; // Added Loader2 for variety
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NewProject = () => {
  const trpc = useTRPC();
  const router = useRouter();
  
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: User, isLoading: isUserLoading } = useQuery(
    trpc.user.getUser.queryOptions()
  );

  const { mutateAsync: createProject, isPending } = useMutation(
    trpc.project.newProject.mutationOptions()
  );

  const handleCreateProject = async () => {
    try {
      const project = await createProject({
        name: "New Project",
        description: "Freshly created project",
      });

      if (project?.id) {
        // Start redirection state
        setIsRedirecting(true);
        toast.success("Project created! Redirecting...");
        router.push(`/project/${project.id}`);
      }
    } catch (error) {
      toast.error("Failed to create project.");
      setIsRedirecting(false);
    }
  };

  const handleLoginRedirect = () => {
    setIsRedirecting(true);
    router.push("/sign-in");
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center gap-6">
        <Spinner className="w-5 h-5 text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <button className="text-zinc-400 hover:text-white transition-colors">
        <Bell className="w-5 h-5" />
      </button>

      {User ? (
        <button
          className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-200 hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-70 disabled:hover:scale-100"
          onClick={handleCreateProject}
          disabled={isPending || isRedirecting}
        >
          {isPending ? (
            <>
              <Spinner />
              <span>Creating...</span>
            </>
          ) : isRedirecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Moving to Project...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </>
          )}
        </button>
      ) : (
        <button
          className="bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
          onClick={handleLoginRedirect}
          disabled={isRedirecting}
        >
          {isRedirecting ? (
             <Spinner />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Login to Create
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default NewProject;