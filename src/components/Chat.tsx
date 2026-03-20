import { Zap, Plus, Sparkles, Send, User } from "lucide-react";
import React, { useState, KeyboardEvent } from "react";
import { Spinner } from "./ui/spinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useScrollToBottom } from "@/hooks/useScrollBottom";

type ChatProps = {
  chatWidth: number;
  projectId: string;
}

const Chat = ({ chatWidth, projectId,
}: ChatProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  const [chatInput, setChatInput] = useState("");

  // Chat
  const { data: Chat, isLoading } = useQuery(
    trpc.project.getChatMessages.queryOptions({ projectId: Number(projectId) }),
  );
  const messagesEndRef = useScrollToBottom<HTMLDivElement>([Chat?.length || 0]);

  // Project
  const { data: project } = useQuery(
    trpc.project.getProject.queryOptions({ projectId: Number(projectId) })
  );

  // Ai - two is better than one 😉
  const { mutateAsync: generate, isPending: isAiGenerating } = useMutation(
    trpc.Ai.getSummary.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.project.getProject.queryKey({
            projectId: Number(projectId),
          }),
        });
      },
    }),
  );

  const { mutateAsync: editCode, isPending: isCodeEditing } = useMutation(
    trpc.Ai.editCode.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.project.getProject.queryKey({
            projectId: Number(projectId),
          }),
        });
      },
    }),
  );

  // Send Msg - with optimistic update bruh
  const { mutateAsync: sendMessage } = useMutation(
    trpc.project.sendMessage.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.project.getChatMessages.queryKey({
            projectId: Number(projectId),
          }),
        });
      },
      onMutate: async (newMessage) => {
        const queryKey = trpc.project.getChatMessages.queryKey({
          projectId: Number(projectId),
        });
        await queryClient.cancelQueries({ queryKey });
        const previousMessages = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(queryKey, (old) => [
          ...(old ?? []),
          {
            id: Math.random(),
            text: newMessage.text,
            role: newMessage.role,
            chatId: Number(projectId),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
        return { previousMessages };
      },
      onError: (err, newMessage, context) => {
        const queryKey = trpc.project.getChatMessages.queryKey({
          projectId: Number(projectId),
        });
        queryClient.setQueryData(queryKey, context?.previousMessages);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.project.getChatMessages.queryKey({
            projectId: Number(projectId),
          }),
        });
      },
    }),
  );

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAiGenerating) return;

    const input = chatInput;
    setChatInput("");

    await sendMessage({
      text: input,
      role: "User",
      projectId: Number(projectId),
    });

    if (Chat!.length > 1) {
      // @ts-expect-error: Its JSON so its showing all types
      const res = await editCode({ prevCode: JSON.stringify(project!.files), userReq: input, projectId: projectId });
      await sendMessage({
        text: res.summary,
        role: "Ai",
        projectId: Number(projectId),
      });
    } else {
      const res = await generate({ userReq: input, projectId });

      await sendMessage({
        text: res.description,
        role: "Ai",
        projectId: Number(projectId),
      });
    }
  };

  // Handle Enter Key
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden bg-zinc-950 border-r border-white/5"
      style={{ width: `${chatWidth}px` }}
    >
      <header className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-zinc-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap size={14} className="text-white fill-current" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">
            OpenClone.ai
          </span>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white">
          <Plus size={18} />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            {Chat?.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "User" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                    msg.role === "Ai"
                      ? "bg-zinc-900 border-white/10"
                      : "bg-indigo-600 border-indigo-400/30"
                  }`}
                >
                  {msg.role === "Ai" ? (
                    <Sparkles size={14} className="text-indigo-400" />
                  ) : (
                    <User size={14} className="text-white" />
                  )}
                </div>

                <div
                  className={`flex flex-col max-w-[80%] ${msg.role === "User" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                      msg.role === "User"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-zinc-900 text-zinc-200 border border-white/5 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {isAiGenerating || isCodeEditing && (
              <div className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center">
                  <Sparkles size={14} className="text-indigo-400" />
                </div>
                <div className="bg-zinc-900/50 border border-white/5 px-4 py-2.5 rounded-2xl rounded-tl-none">
                  <Spinner />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
          </>
        )}
      </div>

      {/* Input */}
      <footer className="p-4 bg-zinc-950 shrink-0">
        <div className="relative group max-w-4xl mx-auto">
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your next feature..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 pr-12 text-[14px] focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none h-24 transition-all placeholder:text-zinc-500 text-zinc-200"
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || isAiGenerating}
            className={`absolute right-2 bottom-2 p-2 rounded-lg transition-all active:scale-95 
              ${
                !chatInput.trim() || isAiGenerating
                  ? "text-zinc-600 cursor-not-allowed"
                  : "text-white bg-indigo-600 hover:bg-indigo-500"
              }`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-zinc-500 text-center mt-3">
          AI may generate inaccurate code. Review before deploying.
        </p>
      </footer>
    </div>
  );
};

export default Chat;
