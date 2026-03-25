import { headers } from "next/headers";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  LayoutDashboard,
  MoreVertical,
  ArrowRight,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  Zap,
  CheckCircle2,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import NewProject from "@/components/NewProject";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  // 1. Fetch data safely
  const [projects, projectCount] = await Promise.all([
    user
      ? prisma.project.findMany({
          where: { authorId: user.id },
          orderBy: { createdAt: "desc" },
          take: 3, // Just the most recent for the grid
        })
      : [],
    user ? prisma.project.count({ where: { authorId: user.id } }) : 0,
  ]);

  const lastProject = projects[0];

  // 2. Safely fetch chat/message data only if a project exists
  const recentChat = lastProject
    ? await prisma.chat.findFirst({
        where: { projectId: lastProject.id },
      })
    : null;

  const messageCount = recentChat
    ? await prisma.message.count({
        where: { chatId: recentChat.id },
      })
    : 0;

  return (
    <div className="min-h-screen bg-app-bg text-zinc-400 p-6 md:p-10">
      {/* Header / User Profile */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-zinc-500 mt-1">
            Welcome back, {user?.name?.split(" ")[0] || "User"}
          </p>
        </div>
      </header>
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-app-surface/40 p-8 rounded-4xl border border-white/5 backdrop-blur-xl">
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-tr from-brand-indigo via-brand-purple to-brand-pink rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <Avatar className="h-32 w-32 border-2 border-zinc-900 relative">
            <AvatarImage src={user?.image ?? ""} alt={user?.name} />
            <AvatarFallback className="bg-zinc-800 text-3xl font-bold">
              {user?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              {user?.name}
            </h1>
            {user?.emailVerified && (
              <CheckCircle2 className="text-status-live w-6 h-6" />
            )}
          </div>
          <p className="text-zinc-500 text-lg flex items-center justify-center md:justify-start gap-2 mb-6">
            <Mail size={18} /> {user?.email}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 gap-2"
            >
              <Settings size={16} /> Edit Profile
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl gap-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Projects */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length > 0 ? (
                projects.map((project: Project) => (
                  <Link
                    href={`/project/${project.id}`}
                    key={project.id}
                    className="group bg-app-surface/60 backdrop-blur-md border border-white/5 hover:border-brand-indigo/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-indigo/10 transition-colors">
                        <LayoutDashboard className="w-5 h-5 text-zinc-400 group-hover:text-brand-indigo transition-colors" />
                      </div>
                      <MoreVertical className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-medium text-white mb-1 truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {timeAgo(project.createdAt)}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-zinc-600">
                  <LayoutDashboard className="w-8 h-8 mb-3 opacity-20" />
                  <p>No projects yet</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-100 mb-6">
              Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Card className="bg-app-surface/50 border-white/5 backdrop-blur-md rounded-3xl overflow-hidden group">
                <CardHeader className="pb-2">
                  <CardDescription className="uppercase tracking-widest text-[10px] font-bold text-zinc-500">
                    Workspace
                  </CardDescription>
                  <CardTitle className="text-white flex items-center gap-2">
                    <LayoutGrid size={20} className="text-brand-indigo" />{" "}
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-1">
                    {messageCount}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Total applications built
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-app-surface/50 border-white/5 backdrop-blur-md rounded-3xl overflow-hidden group">
                <CardHeader className="pb-2">
                  <CardDescription className="uppercase tracking-widest text-[10px] font-bold text-zinc-500">
                    Workspace
                  </CardDescription>
                  <CardTitle className="text-white flex items-center gap-2">
                    <LayoutGrid size={20} className="text-brand-indigo" />{" "}
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white mb-1">
                    {projects?.length || 0}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Total applications built
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
        <div className="space-y-6">
          <section className="bg-linear-to-br from-brand-indigo/10 to-transparent p-6 rounded-3xl border border-brand-indigo/20">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-status-token" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <NewProject />
              {lastProject && (
                <Link
                  href={`/project/${lastProject.id}`}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5 group"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-brand-purple" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-zinc-200">
                        Continue Last
                      </p>
                      <p className="text-xs text-zinc-500 truncate max-w-30">
                        {lastProject.name}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </section>
          <div className="p-6 bg-app-surface/20 rounded-2xl border border-white/5 text-xs text-zinc-600 leading-relaxed">
            <p>
              Tip: Use the <strong>More</strong> menu on project cards to
              archive or rename your workspaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
