"use client";

import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, Github, Chrome } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignin = async (e?: React.FormEvent) => {
    e?.preventDefault(); // Prevent page reload if called from form

    if (!email || !password) {
      return toast.error("Please enter both email and password");
    }

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
        rememberMe: true,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Welcome back!");
          router.push("/");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message || "Invalid credentials");
        },
      },
    );
  };

  const handleSignInWithGoogle = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };

  const handleSignInWithGithub = async () => {
    const data = await authClient.signIn.social({
      provider: "github",
    });
  };
  // <form onSubmit={handleSignin} className="space-y-5">
  //   {/* Email Input */}
  //   <div className="space-y-2">
  //     <label className="text-sm font-medium text-gray-300 ml-1">
  //       Email Address
  //     </label>
  //     <div className="relative group">
  //       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-brand-indigo transition-colors" />
  //       <input
  //         className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-indigo/50 focus:ring-4 focus:ring-brand-indigo/20 focus:outline-none transition-all placeholder:text-gray-600"
  //         placeholder="name@company.com"
  //         type="email"
  //         value={email}
  //         onChange={(e) => setEmail(e.target.value)}
  //         disabled={isLoading}
  //       />
  //     </div>
  //   </div>

  //   {/* Password Input */}
  //   <div className="space-y-2">
  //     <div className="flex justify-between items-center px-1">
  //       <label className="text-sm font-medium text-gray-300">Password</label>
  //       <a
  //         href="#"
  //         className="text-xs text-brand-purple hover:text-brand-pink transition-colors"
  //       >
  //         Forgot?
  //       </a>
  //     </div>
  //     <div className="relative group">
  //       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-brand-purple transition-colors" />
  //       <input
  //         className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-purple/20 focus:outline-none transition-all placeholder:text-gray-600"
  //         placeholder="••••••••"
  //         type="password"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //         disabled={isLoading}
  //       />
  //     </div>
  //   </div>

  //   <button
  //     type="submit"
  //     disabled={isLoading}
  //     className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white font-bold shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
  //   >
  //     {isLoading ? (
  //       <span className="flex items-center justify-center gap-2">
  //         <Loader2 className="h-5 w-5 animate-spin" />
  //         Authenticating...
  //       </span>
  //     ) : (
  //       "Sign In"
  //     )}
  //   </button>
  // </form>;

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <div className="bg-app-surface/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Sign In
            </h1>
            <p className="text-gray-400">
              Select Sign In method to access your account
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-gray-500">
                Continue with
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
              onClick={handleSignInWithGithub}
            >
              <Github className="h-5 w-5" /> GitHub
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
              onClick={handleSignInWithGoogle}
            >
              <Chrome className="h-5 w-5" /> Google
            </button>
          </div>

          {/* Footer */}
          <p className="text-gray-400 text-sm mt-8 text-center">
            New here?{" "}
            <a
              href="/sign-up"
              className="text-white font-semibold hover:text-brand-pink transition-colors underline underline-offset-4 decoration-brand-purple/50"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
