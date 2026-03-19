"use client";
import React, { useRef, useState } from "react";
import {
  Zap,
  Plus,
  Sparkles,
  Send,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useParams } from "next/navigation";
import { Spinner } from "./ui/spinner";

interface SidebarProps {
  chatWidth: number;
  isResizing: boolean;
  startResizing: (e: React.MouseEvent) => void;
}

const ProjectSideBar = ({
  chatWidth,
  isResizing,
  startResizing,
}: SidebarProps) => {
  const { projectId } = useParams();

  const sidebarRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");

  // Chat
  const trpc = useTRPC();

  const { data: Chat, isLoading } = useQuery(
    trpc.project.getChatMessages.queryOptions({ projectId: Number(projectId) }),
  );

  const { mutateAsync, isPending } = useMutation(
    trpc.project.sendMessage.mutationOptions({
      onSuccess: () => {
        console.log("fukc you");
      },
    }),
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    mutateAsync({
      text: chatInput,
      role: "User",
      projectId: Number(projectId),
    });

    setChatInput("");
  };
  return (
    <aside
      ref={sidebarRef}
      style={{ width: isChatOpen ? `${chatWidth}px` : "0px" }}
      className={`relative flex flex-col bg-app-surface/80 backdrop-blur-xl border-r border-white/5 transition-[width] duration-300 ease-in-out z-20 ${
        isResizing ? "transition-none" : ""
      }`}
    >
      <div
        className="flex flex-col h-full overflow-hidden"
        style={{ width: `${chatWidth}px` }}
      >
        <header className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap size={16} className="text-white fill-current" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white block">
              OpenClone.ai
            </span>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white">
            <Plus size={20} />
          </button>
        </header>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* <div className="w-8 h-8 rounded-xl bg-linear-to-b from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-indigo-400" />
            </div>
            <div className="text-[14px] leading-relaxed text-zinc-300">
              The sidebar is now resizable! Hover over the right edge to drag,
              or use the toggle to collapse.
            </div> */}
          {isLoading ? (
            <div className='w-full flex items-center justify-center'>
              <Spinner />
            </div>
          ) : (
            Chat?.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${
                  msg.role === "User" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-linear-to-b from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                  {msg.role === "Ai" ? (
                    <Sparkles size={14} className="text-indigo-400" />
                  ) : (
                    <User />
                  )}
                </div>

                <div className="text-[14px] leading-relaxed text-zinc-300">
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="p-6 bg-transparent shrink-0">
          <form onSubmit={handleSendMessage} className="relative group">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Describe your next feature..."
              className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl p-4 pr-14 text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none h-32 transition-all shadow-2xl"
            />
            <button
              type="submit"
              className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition-all shadow-lg active:scale-90 
              ${
                !chatInput.trim()
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
              disabled={!chatInput.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </footer>
      </div>

      {/* Resize Handle (The invisible area that triggers dragging) */}
      {isChatOpen && (
        <div
          onMouseDown={startResizing}
          className={`absolute -right-1 top-0 w-2 h-full cursor-col-resize z-30 group transition-colors ${isResizing ? "bg-indigo-500/50" : "hover:bg-indigo-500/30"}`}
        >
          {/* Visual indicator line */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-px h-full transition-colors ${isResizing ? "bg-indigo-400" : "group-hover:bg-indigo-400/50"}`}
          />
        </div>
      )}

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-14 bg-app-surface border border-white/10 rounded-full flex items-center justify-center hover:text-white hover:border-indigo-500/50 transition-all z-50 shadow-2xl"
      >
        {isChatOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </aside>
  );
};

export default ProjectSideBar;
