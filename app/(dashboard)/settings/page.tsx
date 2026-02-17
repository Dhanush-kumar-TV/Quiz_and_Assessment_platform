"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Image as ImageIcon, Palette, Save, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState((session?.user as any)?.image || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Size limit check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image, theme }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local session
        await update({
          name: data.name,
          image: data.image,
          theme: data.theme,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-bold mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-foreground">Account Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your profile, theme, and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-xl shadow-slate-100/40 dark:shadow-none transition-all text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-[2rem] bg-primary/5 flex items-center justify-center text-primary overflow-hidden border-4 border-background shadow-lg transition-transform group-hover:scale-105 duration-300">
                  {image ? (
                    <img src={image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{name || "Your Name"}</h2>
                <p className="text-sm font-medium text-muted-foreground mb-4">{session?.user?.email}</p>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
                >
                  Change Photo
                </button>
              </div>
            </div>
          </div>

          <div className="bg-primary rounded-[2.5rem] p-8 text-primary-foreground shadow-xl shadow-slate-100/50 dark:shadow-none">
            <h3 className="font-black text-lg mb-2">Profile Image</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed font-medium">
              Images are stored directly in your profile. For best results, use a square image up to 2MB.
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-card rounded-[2.5rem] border border-border p-10 shadow-xl shadow-slate-100/40 dark:shadow-none space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-secondary bg-secondary/50 text-foreground font-bold focus:border-primary focus:outline-none transition-all text-lg"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    Theme Preference
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTheme(t)}
                        className={`px-4 py-4 rounded-2xl font-black capitalize transition-all border-2 flex flex-col items-center gap-2 ${
                          theme === t 
                            ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-slate-100/40 dark:shadow-none" 
                            : "bg-secondary border-secondary text-muted-foreground hover:border-primary"
                        }`}
                      >
                        <span className="text-xs uppercase tracking-tighter">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-grow md:flex-none flex items-center justify-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-slate-100/50 dark:shadow-none disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    Save Changes
                  </>
                )}
              </button>

              {success && (
                <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in slide-in-from-left-4 duration-300">
                  <CheckCircle2 className="w-5 h-5" />
                  Profile Updated!
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
