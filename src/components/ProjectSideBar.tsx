"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import Chat from "./Chat";

const ProjectSideBar = () => {
  const { projectId } = useParams();

  const sidebarRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Resizing State
  const [chatWidth, setChatWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  // Resizing Logic
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        // Limit min width to 280 and max to 600
        const newWidth = Math.min(Math.max(280, e.clientX), 800);
        setChatWidth(newWidth);
      }
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <aside
      ref={sidebarRef}
      style={{ width: isChatOpen ? `${chatWidth}px` : "0px" }}
      className={`relative flex flex-col bg-app-surface/80 backdrop-blur-xl border-r border-white/5 transition-[width] duration-300 ease-in-out z-20 ${
        isResizing ? "transition-none" : ""
      }`}
    >
      {isChatOpen && (
        <Chat chatWidth={chatWidth} projectId={projectId?.toString() ?? ""} />
      )}

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
