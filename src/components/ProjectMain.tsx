"use client";

import { useEffect, useState } from "react";
import { Code, Play, Rocket } from "lucide-react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFiles,
  // SandpackFileExplorer,
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
  console.log("projectId:", projectId);

  const trpc = useTRPC();
  const { data: project, isLoading } = useQuery(
    trpc.project.getProject.queryOptions(
      { projectId: Number(projectId) },
      { enabled: !!projectId && !isNaN(Number(projectId)) },
    ),
  );

  const [files, setFiles] = useState<FileStructure>({
    "/App.js": `export default function App() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white p-4">
        <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25"></div>
            <h1 className="relative text-5xl font-bold mb-4 tracking-tighter">lovable.ai</h1>
        </div>
        <p className="text-zinc-400 font-medium">Resizable & Collapsible Sidebar Ready.</p>
        </div>
    );
}`,
  });
 
  useEffect(() => {
    if (project?.files) {
      setFiles(project.files as unknown as FileStructure);
    }
  }, [project?.id]);

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-app-bg relative z-10">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-app-bg/50 backdrop-blur-md">
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setIsEditorVisible(false)}
            className={`flex items-center gap-2 px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${
              !isEditorVisible
                ? "bg-zinc-800 text-white shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Play size={14} /> Preview
          </button>
          <button
            onClick={() => setIsEditorVisible(true)}
            className={`flex items-center gap-2 px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${
              isEditorVisible
                ? "bg-zinc-800 text-white shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Code size={14} /> Code
          </button>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_0_25px_rgba(79,70,229,0.3)] active:scale-95">
          <Rocket size={14} /> Deploy
        </button>
      </header>

      {/* Editor */}
      {!isLoading ? (
        <div className="flex-1 w-full overflow-hidden">
        <SandpackProvider
          template="react"
          key={project?.id || "loading"}
          theme="dark"
          files={files as unknown as SandpackFiles}
          options={{ externalResources: ["https://cdn.tailwindcss.com"] }}
          style={{ height: "100%" }}
        >
          <SandpackLayout className="h-full! rounded-none! border-none!">
            <div className={`${isEditorVisible ? "hidden" : "block"} w-full`}>
              <SandpackPreview
                showOpenInCodeSandbox={false}
                showRefreshButton={true}
                style={{ height: "100%" }}
                className="bg-black!"
              />
            </div>

            <div className={`${isEditorVisible ? "" : "hidden"} w-full`}>
              {/* <SandpackFileExplorer className="h-full! border-r border-white/5 bg-app-bg!" /> */}
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
      </div>) : (<div className="w-full flex items-center justify-center">
      <Spinner/>
    </div>)}
    </main>
  );
};

export default ProjectMain;
