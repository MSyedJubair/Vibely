import { LayoutDashboard, Zap, Clock, MoreVertical } from "lucide-react";
import PromptInput from "@/components/PromptInput";
import NewProject from "@/components/NewProject";
import prisma from "@/lib/db";
import Link from "next/link";
import { headers } from "next/headers";
import { timeAgo } from "@/lib/utils";
import { auth } from "@/lib/auth";

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const recentProjects = user
    ? await prisma.project.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
      })
    : [];

  return (
    <>
      <style>{`
        @keyframes drift {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-drift {
          animation: drift 15s infinite ease-in-out;
        }
        .animate-drift-slow {
          animation: drift 25s infinite ease-in-out reverse;
        }
      `}</style>

      <div className="flex h-screen bg-app-bg text-zinc-100 font-sans overflow-hidden relative z-0">
        {/* Animated Wavy Background */}
        <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-drift"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-drift-slow"></div>
        </div>

        {/* Main Content */}
        <main className="w-full flex flex-col relative overflow-y-auto">
          {/* Top Header */}
          <header className="flex items-center justify-between p-8 sticky top-0 z-10 border-b border-transparent">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm font-medium text-zinc-300 backdrop-blur-md">
              <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
              <span>120,400 tokens remaining</span>
            </div>

            <NewProject />
          </header>

          <div className="w-full mx-auto px-8 py-20 flex-1 flex flex-col">
            {/* Hero Prompt Section */}
            <div className="flex flex-col items-center justify-center mt-12 mb-24">
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-center mb-10 leading-tight">
                What do you want to <br />
                <span className="bg-clip-text text-transparent bg-linear-to-tr from-indigo-400 via-purple-400 to-pink-400">
                  build today?
                </span>
              </h1>
              <PromptInput />
            </div>

            {/* Recent Projects Section */}
            <div className="mt-auto pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                  Recent Projects
                </h2>
                <Link
                  href="/project"
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View all projects
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentProjects ? (recentProjects.map((project) => (
                  <Link
                    href={`/project/${project.id}`}
                    key={project.id}
                    className="group bg-app-surface/60 backdrop-blur-md border border-white/5 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10_30px_rgba(99,102,241,0.15)] cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                        <LayoutDashboard className="w-6 h-6 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    <h3 className="font-semibold text-lg text-white mb-2 truncate">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-zinc-500 mt-4">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />{" "}
                        {timeAgo(project.createdAt)}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                      {/* <span
                        className={`font-medium ${project.status === "Live" ? "text-emerald-400" : "text-amber-400"}`}
                      >
                        {project.status}
                      </span> */}
                    </div>
                  </Link>
                ))): (
                  <div>
                    No Projects
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
