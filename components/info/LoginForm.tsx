"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyPassword } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await verifyPassword(password);
      if (result.success) {
        // Refresh the page so the server component sees the new cookie
        router.refresh();
      } else {
        setError(result.error || "Login failed");
        setShake(true);
        setTimeout(() => setShake(false), 400);
        setPassword("");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-[340px] rounded-xl border border-border/50 bg-card p-8 shadow-xl flex flex-col items-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Lock className="h-6 w-6" />
        </div>
        
        <h1 className="mb-1 text-center font-sans text-2xl font-extrabold uppercase tracking-widest text-foreground" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
          Ducts All Done
        </h1>
        <p className="mb-8 text-center text-xs text-muted-foreground">
          VA Dashboard · Enter password to continue
        </p>

        <form onSubmit={handleLogin} className="w-full">
          <div className="relative mb-3">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "pr-10 font-mono tracking-widest bg-muted/50 transition-all",
                shake && "animate-shake border-destructive focus-visible:ring-destructive"
              )}
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          <Button type="submit" className="w-full font-bold tracking-wide" disabled={loading}>
            {loading ? "Unlocking..." : "Unlock Dashboard"}
          </Button>
          
          <div className="mt-4 min-h-[20px] text-center text-xs text-destructive font-medium">
            {error}
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-7px); }
          75% { transform: translateX(7px); }
        }
        .animate-shake {
          animation: shake 0.35s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
