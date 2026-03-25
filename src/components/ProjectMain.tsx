"use client";

import { useState } from "react";
import { Code, Play, Rocket, Files, Save } from "lucide-react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackFiles,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import MonacoEditor from "@/components/MonacoEditor";
import { toast } from "sonner";

const Devices = [
  {
    id: "mobile",
    icon: <div className="w-3 h-4 border-2 border-current rounded-[2px]" />,
  },
  {
    id: "tablet",
    icon: <div className="w-4 h-3 border-2 border-current rounded-[2px]" />,
  },
  {
    id: "pc",
    icon: <div className="w-5 h-4 border-2 border-current rounded-[1px]" />,
  },
];
const ProjectMain = ({isAuthor}:{isAuthor:boolean}) => {
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('');
  const { projectId } = useParams();
  const trpc = useTRPC();

  const { data: project, isLoading } = useQuery({
    ...trpc.project.getProject.queryOptions({ projectId: Number(projectId) }),
  });

  const { mutate: saveCode, isPending } = useMutation(
    trpc.project.saveCode.mutationOptions(),
  );

  // @ts-expect-error - hey
  const files = project?.files;

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
                !isEditorVisible
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Play size={14} /> Preview
            </button>
            <button
              onClick={() => setIsEditorVisible(true)}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                isEditorVisible
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Code size={14} /> Code
            </button>
          </div>
        </div>

        {!isEditorVisible && (
          <div className="flex bg-zinc-950 p-1 rounded-lg border border-white/5 ml-4">
            {Devices.map((device) => (
              <button
                key={device.id}
                onClick={() => setPreviewDevice(device.id)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  previewDevice === device.id
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {device.icon}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <button
            disabled={isPending}
            onClick={() => {
              if (!isAuthor){
                toast("You're not the owner of this project.")
                return
              }
              saveCode({
                files: JSON.stringify(files),
                projectId: Number(projectId)
              })
            }}
            className="flex items-center gap-2 px-5 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95"
          >
            {isPending ? <Spinner className="w-3 h-3" /> : <Save size={14} />}
            {isPending ? "Saving..." : "Saved"}
          </button>

          <button className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95">
            <Rocket size={14} /> Deploy
          </button>
        </div>
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
            activeFile: "/App.jsx",
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
                minWidth: 0,
                flexDirection: "column",
                height: "100%",
                background: "#1e1e1e",
                overflow: "hidden",
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
            <div
              style={{
                display: !isEditorVisible ? "flex" : "none",
                flex: 1,
                height: "100%",
                background: "#09090b", // Slightly lighter than pure black to see the device edges
                alignItems: "center",
                justifyContent: "center",
                overflow: "auto", // Allow scrolling if the device is taller than the screen
                padding: "20px",
              }}
            >
              <div
                style={{
                  width:
                    previewDevice === "mobile"
                      ? "375px"
                      : previewDevice === "tablet"
                        ? "768px"
                        : "100%",
                  height: previewDevice === "pc" ? "100%" : "80%", // PC fills height, others stay contained
                  maxWidth: "100%",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  border: previewDevice === "pc" ? "none" : "8px solid #27272a",
                  borderRadius: previewDevice === "pc" ? "0" : "24px",
                  overflow: "hidden",
                }}
              >
                <SandpackPreview
                  showOpenInCodeSandbox={false}
                  showRefreshButton={true}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            </div>
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
