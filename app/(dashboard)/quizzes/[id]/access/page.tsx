"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Shield, Loader2, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AccessRequest {
  _id: string;
  userId: { _id: string; name: string; email: string; image?: string };
  name: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
}

export default function AccessManagementPage({ params }: { params: { id: string } }) {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [authStatus, router]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [quizRes, requestsRes] = await Promise.all([
          fetch(`/api/quizzes/${params.id}`),
          fetch(`/api/quizzes/${params.id}/access-requests?t=${Date.now()}`)
      ]);

      if (quizRes.ok) {
          const quiz = await quizRes.json();
          setQuizTitle(quiz.title);
      }

      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setRequests(Array.isArray(data) ? data : []);
      } else {
        setError("Failed to load requests");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === "authenticated") {
        fetchRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, authStatus]);

  const handleDecision = async (requestId: string, action: "approve" | "deny") => {
    try {
      const res = await fetch(`/api/quizzes/${params.id}/access-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        // Refresh list
        fetchRequests();
      } else {
        alert("Failed to update request");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Loading access requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <Link 
        href={`/quizzes/${params.id}`} 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Quiz
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Shield className="w-6 h-6" />
        </div>
        <div>
            <h1 className="text-3xl font-black text-foreground">Access Requests</h1>
            <p className="text-muted-foreground font-medium">Manage permissions for <span className="text-foreground font-bold">&quot;{quizTitle}&quot;</span></p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {requests.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-3xl">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <User className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-bold text-foreground">No pending requests</p>
            <p className="text-muted-foreground">When users request access, they will appear here.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div 
              key={req._id} 
              className="group p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden relative border border-border">
                    {req.userId.image ? (
                         <Image src={req.userId.image} alt={req.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold">
                            {req.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground">{req.name}</p>
                  <p className="text-sm text-muted-foreground">{req.userId.email}</p>
                  <p className="text-xs text-muted-foreground mt-1 opacity-70">Requested {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleDecision(req._id, "deny")}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Deny
                </button>
                <button
                  onClick={() => handleDecision(req._id, "approve")}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200/50 dark:shadow-none flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
