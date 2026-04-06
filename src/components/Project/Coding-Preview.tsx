"use client";

import { useState } from "react";
import { Code, Play, Rocket, Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import WebPreview from "../WebPreview";
import CodeEditor, { WebContainerTemplate } from "./CodeEditor";

const Devices = [
  {
    id: "mobile",
    icon: <div className="w-3 h-4 border-2 border-current rounded-xs" />,
  },
  {
    id: "tablet",
    icon: <div className="w-4 h-3 border-2 border-current rounded-xs" />,
  },
  {
    id: "pc",
    icon: <div className="w-5 h-4 border-2 border-current rounded-[1px]" />,
  },
];
const ProjectMain = ({ isAuthor }: { isAuthor: boolean }) => {
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [previewDevice, setPreviewDevice] = useState("");
  const { projectId } = useParams();
  const trpc = useTRPC();

  const { data: project, isLoading } = useQuery({
    ...trpc.project.getProject.queryOptions({ projectId: Number(projectId) }),
  });

  // @ts-expect-error - hey
  const files = project?.files;

  if (isLoading || !files) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-zinc-950">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden">
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
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 w-full relative">
        <div className={`${isEditorVisible ? "flex" : "hidden"}`}>
          <CodeEditor code={files as unknown as WebContainerTemplate} projectId={Number(projectId)} />
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
            <WebPreview files={files} />
          </div>
        </div>
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
