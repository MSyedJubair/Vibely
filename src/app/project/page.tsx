export const dynamic = "force-dynamic";

import prisma from "@/lib/db";
import {
  Plus,
  Clock,
  ExternalLink,
  Code2,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";


const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const Projects = async () => {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      author: true, // Fetch author name
    },
  });

  console.log(projects.length)

  return (
    <div className="min-h-screen bg-app-bg text-zinc-300 p-8 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-indigo/10 rounded-full blur-[120px] animate-drift" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-brand-purple/10 rounded-full blur-[120px] animate-drift-slow" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              My Projects
            </h1>
            <p className="text-zinc-500 font-medium">
              Manage and edit your AI-generated applications.
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <Plus size={18} /> New Project
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-app-surface/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 transition-all hover:border-brand-indigo/50 hover:bg-app-surface/80"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-zinc-900 rounded-2xl border border-white/5 group-hover:border-brand-indigo/30">
                  <Code2 size={24} className="text-brand-indigo" />
                </div>
              </div>

              <Link href={`/project/${project.id}`}>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-indigo transition-colors cursor-pointer">
                  {project.name || "Untitled Project"}
                </h3>
              </Link>

              <p className="text-zinc-500 text-sm line-clamp-2 mb-4 h-10">
                {project.description}
              </p>

              {/* Author Section */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                  <UserIcon size={10} className="text-zinc-400" />
                </div>
                <span className="text-xs font-medium text-zinc-400">
                  {project.author.name || "Anonymous"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  <Clock size={12} />
                  <span>{formatDate(project.updatedAt)}</span>
                </div>

                <Link
                  href={`/project/${project.id}`}
                  className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-xs font-bold text-brand-indigo">
                    View
                  </span>
                  <ExternalLink size={14} className="text-brand-indigo" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
