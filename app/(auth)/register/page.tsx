"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, User, Mail, Lock, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-card p-8 rounded-3xl shadow-xl border border-border">
      <div className="text-center mb-8">
        <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Brain className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-black text-foreground">Create Account</h1>
        <p className="text-muted-foreground mt-2 font-medium">Join thousands of learners today</p>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Full Name</label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              required
              className="w-full pl-11 pr-4 py-3 bg-secondary/20 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              required
              className="w-full pl-11 pr-4 py-3 bg-secondary/20 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              required
              minLength={6}
              className="w-full pl-11 pr-4 py-3 bg-secondary/20 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-card outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-primary/10 mt-2"
        >
          {loading ? "Creating Account..." : "Join Now"}
        </button>
      </form>

      <p className="text-center mt-8 text-muted-foreground text-sm font-semibold">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-black hover:underline">
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
