"use client";

import { useEffect, useState } from "react";
import { Code, Play, Rocket } from "lucide-react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFiles,
} from "@codesandbox/sandpack-react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { autocompletion } from "@codemirror/autocomplete";
import { Spinner } from "./ui/spinner";

type FileStructure = {
  [key: string]: string | FileStructure | null;
};

const ProjectMain = () => {
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const { projectId } = useParams();
  const trpc = useTRPC();

  const { data: project, isLoading, isFetching } = useQuery(
    trpc.project.getProject.queryOptions({ projectId: Number(projectId) })
  );

  // Initialize with null/undefined to check if we are ready
  const [files, setFiles] = useState<FileStructure | null>(null);

  useEffect(() => {
    if (project?.files) {
      setFiles(project.files as unknown as FileStructure);
    }
  }, [project?.id, project?.files]); // Watch files content too

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-app-bg relative z-10">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-app-bg/50 backdrop-blur-md">
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setIsEditorVisible(false)}
            className={`flex items-center gap-2 px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${
              !isEditorVisible ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Play size={14} /> Preview
          </button>
          <button
            onClick={() => setIsEditorVisible(true)}
            className={`flex items-center gap-2 px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${
              isEditorVisible ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Code size={14} /> Code
          </button>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_0_25px_rgba(79,70,229,0.3)] active:scale-95">
          <Rocket size={14} /> Deploy
        </button>
      </header>

      {isLoading || isFetching || !files ? (
        <div className="flex-1 w-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex-1 w-full overflow-hidden">
          <SandpackProvider
            template="react"
            // The key forces a total refresh when the project changes
            key={project?.id} 
            theme="dark"
            files={files as unknown as SandpackFiles}
            options={{ 
              externalResources: ["https://cdn.tailwindcss.com"],
              // Force the entry file if your DB doesn't use /App.js
              activeFile: "/App.js", 
            }}
            style={{ height: "100%" }}
          >
            <SandpackLayout className="h-full! rounded-none! border-none!">
              <div className={`${isEditorVisible ? "hidden" : "block"} w-full h-full`}>
                <SandpackPreview
                  showOpenInCodeSandbox={false}
                  showRefreshButton={true}
                  style={{ height: "100%" }}
                  className="bg-black!"
                />
              </div>

              <div className={`${isEditorVisible ? "" : "hidden"} w-full h-full`}>
                <SandpackCodeEditor
                  showTabs
                  showLineNumbers
                  style={{ height: "100%" }}
                  extensions={[autocompletion()]}
                  className="bg-app-bg!"
                />
              </div>
            </SandpackLayout>
          </SandpackProvider>
        </div>
      )}
    </main>
  );
};

export default ProjectMain;