import { Zap, Plus, Sparkles, Send, User } from "lucide-react";
import React, { useState } from "react";
import { Spinner } from "./ui/spinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useScrollToBottom } from "@/hooks/useScrollBottom";

const Chat = ({ chatWidth, projectId}: {chatWidth: number, projectId:string}) => {
  const [chatInput, setChatInput] = useState("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: Chat, isLoading } = useQuery(
    trpc.project.getChatMessages.queryOptions({ projectId: Number(projectId) }),
  );

  const messagesEndRef = useScrollToBottom<HTMLDivElement>([Chat?.length || 0]);

  // Ai
  const { mutateAsync: generate, isPending: isAiGenerating, isError } = useMutation(trpc.Ai.getSummary.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: trpc.project.getProject.queryKey({
          projectId: Number(projectId)
        })
      })
    }
  }))

  const { mutateAsync } = useMutation(
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

        queryClient.setQueryData(queryKey, (old) => {
          const optimisticUpdate = [
            ...(old ?? []),
            {
              id: Math.random(),
              text: newMessage.text,
              role: newMessage.role,
              chatId: Number(projectId), // Mocking required field
              createdAt: new Date().toISOString(), // Match string type
              updatedAt: new Date().toISOString(), // Match string type
            },
          ];
          // Cast to the expected type to satisfy the compiler
          return optimisticUpdate as typeof previousMessages;
        });

        return { previousMessages };
      },

      onError: (err, newMessage, context) => {
        const queryKey = trpc.project.getChatMessages.queryKey({
          projectId: Number(projectId),
        });
        queryClient.setQueryData(queryKey, context?.previousMessages);
      },
      // 3. Always refetch after error or success to sync with server
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.project.getChatMessages.queryKey({
            projectId: Number(projectId),
          }),
        });
      },
    }),
  );

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const inpt = await mutateAsync({
      text: chatInput,
      role: "User",
      projectId: Number(projectId),
    });

    setChatInput("");

    if (!inpt) return
    
    // Ai response
    // Run if its the first time - generate code

    const res = await generate({ userReq: inpt?.text, projectId })

    await mutateAsync({
      text: res.description,
      role: "Ai",
      projectId: Number(projectId),
    }); 

    // If not first time edit code
    
  };

  return (
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
          <div className="w-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div ref={messagesEndRef}>
            {Chat?.map((msg) => (
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
          ))}
          <div>
            {isAiGenerating && <Spinner/>}
          </div>
          </div>
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
  );
};

export default Chat;
