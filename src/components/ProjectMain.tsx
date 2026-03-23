"use client";

import { useEffect, useState } from "react";
import { Code, Play, Rocket, Files } from "lucide-react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackFiles,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import MonacoEditor from "@/components/MonacoEditor";

type FileStructure = {
  [key: string]: string | FileStructure | null;
};

const ProjectMain = () => {
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const { projectId } = useParams();
  const trpc = useTRPC();

  const { data: project, isLoading } = useQuery({
    ...trpc.project.getProject.queryOptions({ projectId: Number(projectId) }),
  });

  const [files, setFiles] = useState<FileStructure | null>(null);

  useEffect(() => {
    if (project?.files) {
      setFiles(project.files as unknown as FileStructure);
    }
  }, [project?.id, project?.files]);

  if (isLoading || !files) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-950">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-screen bg-zinc-950 overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-900/50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-950 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setIsEditorVisible(false)}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                !isEditorVisible ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Play size={14} /> Preview
            </button>
            <button
              onClick={() => setIsEditorVisible(true)}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                isEditorVisible ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Code size={14} /> Code
            </button>
          </div>
        </div>

        <button className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95">
          <Rocket size={14} /> Deploy
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 w-full relative">
        <SandpackProvider
          template="react"
          key={project?.id}
          theme="dark"
          files={files as unknown as SandpackFiles}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            activeFile: "/App.js",
          }}
          style={{ height: "100%", width: "100%" }}
        >
          <SandpackLayout
            style={{
              height: "100%",
              border: "none",
              borderRadius: 0,
              display: "flex",
              flexDirection: "row",
              background: "transparent",
            }}
          >
            {/* File Explorer - Only visible in Code mode */}
            <SandpackFileExplorer
              style={{
                display: isEditorVisible ? "block" : "none",
                width: "260px",
                minWidth: "260px",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                height: "100%",
                background: "rgba(18, 18, 18, 0.5)",
              }}
            />

            {/* Monaco Editor Wrapper - Only visible in Code mode */}
            <div
              style={{
                display: isEditorVisible ? "flex" : "none",
                flex: 1,
                flexDirection: "column",
                height: "100%",
                background: "#1e1e1e",
              }}
            >
              <div className="h-9 border-b border-white/5 bg-zinc-900/80 flex items-center px-4 shrink-0">
                <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 flex items-center gap-2">
                  <Files size={12} /> Editor
                </span>
              </div>
              <div className="flex-1 w-full overflow-hidden">
                <MonacoEditor />
              </div>
            </div>

            {/* Preview - Only visible in Preview mode */}
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
              style={{
                display: !isEditorVisible ? "flex" : "none",
                flex: 1,
                height: "100%",
                background: "black",
              }}
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>

      {/* Footer */}
      <footer className="h-6 border-t border-white/5 bg-zinc-900 shrink-0 flex items-center px-4 justify-between text-[10px] text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            System Ready
          </span>
        </div>
        <span>React Project v1.0</span>
      </footer>
    </main>
  );
};

export default ProjectMain;