"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionForm from "./QuestionForm";
import Link from "next/link";
import { Copy, Plus, Save, Trash2, Users, Settings, Clock, Shield, AlertTriangle, Link as LinkIcon, Loader2, BarChart3 } from "lucide-react";

type QuizQuestion = { type?: string; questionText: string; options: { text: string; isCorrect: boolean; image?: string }[]; points?: number; required?: boolean; timeLimit?: number; category?: string; image?: string };

export default function QuizForm({ initialData }: { initialData?: { _id?: string; title?: string; description?: string; questions?: QuizQuestion[]; timeLimit?: number; isPublished?: boolean; showScore?: boolean; shuffleQuestions?: boolean; shuffleOptions?: boolean; maxAttempts?: number; emailResults?: boolean; accessType?: string; registrationFields?: string[]; publicUrl?: string; embedCode?: string } }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialData?.questions || [
    { type: "multiple-choice", questionText: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }], points: 1, required: false, timeLimit: 0, category: "General" }
  ]);
  const [timeLimit, setTimeLimit] = useState(initialData?.timeLimit || 0);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished || false);
  const [showScore, setShowScore] = useState(initialData?.showScore !== false);
  const [shuffleQuestions, setShuffleQuestions] = useState(initialData?.shuffleQuestions || false);
  const [shuffleOptions, setShuffleOptions] = useState(initialData?.shuffleOptions || false);
  const [maxAttempts, setMaxAttempts] = useState(initialData?.maxAttempts || 0);
  const [emailResults, setEmailResults] = useState(initialData?.emailResults || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessType, setAccessType] = useState(initialData?.accessType || "public");
  const [password, setPassword] = useState(""); // We don't show the hashed password
  const [registrationFields, setRegistrationFields] = useState<string[]>(initialData?.registrationFields || ["name", "email"]);
  const [activeTab, setActiveTab] = useState("general");
  const router = useRouter();

  const addQuestion = () => {
    setQuestions([...questions, { type: "multiple-choice", questionText: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }], points: 1, required: false, timeLimit: 0, category: "General" }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, updatedQuestion: QuizQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!title || !description || questions.length === 0) {
      setError("Please fill in all general fields and add at least one question.");
      setLoading(false);
      return;
    }

    // For new quizzes, automatically set isPublished to true when publishing
    const shouldPublish = initialData?._id ? isPublished : true;

    const payload = { 
      title, 
      description, 
      questions, 
      isPublished: shouldPublish, 
      showScore, 
      timeLimit: Number(timeLimit),
      shuffleQuestions,
      shuffleOptions,
      maxAttempts: Number(maxAttempts),
      emailResults,
      accessType,
      password,
      registrationFields
    };

    try {
      const url = initialData?._id ? `/api/quizzes/${initialData._id}` : "/api/quizzes";
      const method = initialData?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save quiz");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tabs Header */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab("general")}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'general' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          General
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Settings
        </button>
        <button 
          onClick={() => setActiveTab("access")}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'access' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Access & Sharing
        </button>
        {initialData?._id && (
          <button 
            onClick={() => setActiveTab("roles")}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'roles' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Collaborators
          </button>
        )}
      </div>

    <form onSubmit={handleSubmit} className="space-y-8 pb-32">
      {activeTab === 'general' && (
        <>
          {/* Quiz Meta Details */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-3" htmlFor="quiz-title">
                  Quiz Title
                </label>
                <input
                  id="quiz-title"
                  type="text"
                  required
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:outline-none transition-all font-bold text-lg"
                  placeholder="e.g. Introduction to Quantum Physics"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground mb-3" htmlFor="quiz-desc">
                  Description
                </label>
                <textarea
                  id="quiz-desc"
                  required
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:outline-none transition-all font-bold"
                  placeholder="Explain what this quiz covers and any instructions for the participants..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* New Question Section Header */}
          <div className="pt-4 pb-2 border-b-2 border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Quiz Content</h2>
            <p className="text-muted-foreground font-medium">Build your assessment by adding questions below.</p>
          </div>

          {/* Questions List Container */}
          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50/50 dark:bg-slate-800/30 px-8 py-5 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <span className="bg-primary/10 text-primary w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm">
                      {index + 1}
                    </span>
                    <h3 className="font-black text-slate-700 dark:text-slate-300">Question {index + 1}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm border border-border/50"
                      onClick={() => {
                        const newQuestions = [...questions];
                        newQuestions.splice(index + 1, 0, JSON.parse(JSON.stringify(question)));
                        setQuestions(newQuestions);
                      }}
                      title="Duplicate question"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button 
                      type="button"
                      className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm border border-border/50"
                      onClick={() => removeQuestion(index)}
                      title="Delete question"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <QuestionForm 
                    question={question} 
                    onChange={(updated) => updateQuestion(index, updated)} 
                  />
                </div>
              </div>
            ))}

            {/* Add Question Button */}
            <button 
              type="button"
              onClick={addQuestion}
              className="w-full py-16 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="bg-slate-100 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white p-5 rounded-3xl transition-all scale-110 shadow-sm">
                <Plus className="w-8 h-8" />
              </div>
              <div className="text-center">
                <span className="font-black text-xl block mb-1">Add New Question</span>
                <span className="text-sm font-bold opacity-60">Multiple choice, true/false, or picture choice</span>
              </div>
            </button>
          </div>
        </>
      )}

      {activeTab === 'settings' && (
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 p-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-primary/10 rounded-2xl">
                <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h2 className="text-2xl font-black">Performance & Logistics</h2>
                <p className="text-muted-foreground font-medium">Control global behavior and scoring.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Global Time Limit (Minutes)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:outline-none transition-all font-bold"
                  placeholder="0 for no limit"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div>
                       <p className="font-black text-sm">Shuffle Questions</p>
                       <p className="text-xs text-muted-foreground">Randomize order per attempt</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={shuffleQuestions}
                        onChange={(e) => setShuffleQuestions(e.target.checked)}
                        className="w-7 h-7 rounded-xl text-primary focus:ring-primary border-slate-200 dark:border-slate-700"
                    />
                </div>
                <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div>
                       <p className="font-black text-sm">Shuffle Options</p>
                       <p className="text-xs text-muted-foreground">Randomize answer choices</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={shuffleOptions}
                        onChange={(e) => setShuffleOptions(e.target.checked)}
                        className="w-7 h-7 rounded-xl text-primary focus:ring-primary border-slate-200 dark:border-slate-700"
                    />
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Max Attempts per Participant</label>
                <input
                    type="number"
                    min={0}
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 0)}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:outline-none transition-all font-bold"
                    placeholder="0 for unlimited"
                />
               </div>

               <div className="space-y-4">
                {initialData?._id && (
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div>
                       <p className="font-black text-sm">Publish Quiz</p>
                       <p className="text-xs text-muted-foreground">Make quiz visible to other users</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="w-7 h-7 rounded-xl text-primary focus:ring-primary border-slate-200 dark:border-slate-700"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div>
                       <p className="font-black text-sm">Show Evaluation</p>
                       <p className="text-xs text-muted-foreground">Display scores after completion</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={showScore}
                        onChange={(e) => setShowScore(e.target.checked)}
                        className="w-7 h-7 rounded-xl text-primary focus:ring-primary border-slate-200 dark:border-slate-700"
                    />
                </div>
                <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div>
                       <p className="font-black text-sm">Email Reports</p>
                       <p className="text-xs text-muted-foreground">Send auto-feedback to students</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={emailResults}
                        onChange={(e) => setEmailResults(e.target.checked)}
                        className="w-7 h-7 rounded-xl text-primary focus:ring-primary border-slate-200 dark:border-slate-700"
                    />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'access' && (
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 p-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                <Shield className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-black">Access & Security</h2>
                <p className="text-muted-foreground font-medium">Control who can take this quiz and how.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Access Method</label>
                <div className="grid grid-cols-1 gap-3">
                  {['public', 'password', 'registration', 'approval'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAccessType(type)}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                        accessType === type 
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' 
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${accessType === type ? 'border-indigo-600' : 'border-slate-300'}`}>
                        {accessType === type && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                      </div>
                      <div>
                        <p className="font-black text-sm capitalize">{type} access</p>
                        <p className="text-xs text-muted-foreground">
                          {type === 'public' && "Anyone with the link can participate."}
                          {type === 'password' && "Requires a shared passcode to enter."}
                          {type === 'registration' && "Collect student info before they start."}
                          {type === 'approval' && "Users must request access. You approve/deny requests."}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {accessType === 'password' && (
                <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Set Quiz Passcode</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-indigo-600 focus:outline-none transition-all font-bold"
                    placeholder="e.g. SESSION-2024"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              {accessType === 'registration' && (
                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Required Registration Fields</label>
                  <div className="flex flex-wrap gap-2">
                    {["name", "email", "studentId", "class", "location"].map((field) => (
                      <button
                        key={field}
                        type="button"
                        onClick={() => {
                          if (registrationFields.includes(field)) {
                            setRegistrationFields(registrationFields.filter(f => f !== field));
                          } else {
                            setRegistrationFields([...registrationFields, field]);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${
                          registrationFields.includes(field)
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-801 text-muted-foreground"
                        }`}
                      >
                        {field}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {accessType === 'approval' && (
                <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                  <p className="text-sm font-black text-amber-700 dark:text-amber-300">Approval required</p>
                  <p className="text-xs font-bold text-amber-700/80 dark:text-amber-300/80 mt-1">
                    Participants must be logged in and will request access. You can grant or deny requests from the Collaborators tab.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {initialData?.publicUrl ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Shareable Quiz Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        className="flex-1 px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-indigo-600 font-bold text-sm"
                        value={`${window.location.origin}${initialData.publicUrl}`}
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}${initialData.publicUrl}`)}
                        className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all font-black"
                      >
                        <Copy className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Embed Code (IFrame)</label>
                    <textarea
                      readOnly
                      rows={4}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-muted-foreground font-mono text-xs leading-relaxed"
                      value={initialData.embedCode}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-center">
                  <LinkIcon className="w-10 h-10 text-slate-200 mb-4" />
                  <p className="font-bold text-slate-400">Share links and embed codes will be generated after your first save.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab !== 'roles' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-40">
          {error && (
            <div className="mb-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-xl text-center">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Status</span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${loading ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`}></span> 
                  {loading ? "Saving..." : "Unsaved Changes"}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
              <div className="flex flex-col">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Questions</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{questions.length} Total</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:translate-y-[-1px] transition-all disabled:opacity-50"
              >
                {initialData?._id ? "Update Quiz" : "Publish Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>

    {activeTab === 'roles' && initialData?._id && (
      <RolesManagement quizId={initialData._id} />
    )}
    </div>
  );
}

function RolesManagement({ quizId }: { quizId: string }) {
  const [collaborators, setCollaborators] = useState<{ _id: string; userId: { _id: string; name: string; email: string }; role: string }[]>([]);
  const [accessRequests, setAccessRequests] = useState<{ _id: string; name?: string; userId: { _id: string; name: string; email: string }; status: string }[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("teacher");
  const [loading, setLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  async function fetchRoles() {
    try {
      const res = await fetch(`/api/quizzes/${quizId}/roles?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        console.log("[RolesManagement] Received roles:", data);
        setCollaborators(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/quizzes/${quizId}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: newRole })
      });
      if (res.ok) {
        setNewEmail("");
        await fetchRoles();
        alert("Success! Collaborator has been added.");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to add collaborator");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while adding the collaborator.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this collaborator?")) return;
    try {
      const res = await fetch(`/api/quizzes/${quizId}/roles?userId=${userId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchRoles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 p-10">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
            <Users className="w-6 h-6" />
        </div>
        <div>
            <h2 className="text-2xl font-black">Team & Collaborators</h2>
            <p className="text-muted-foreground font-medium">Delegate control to Teachers and Monitors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <form onSubmit={handleAddRole} className="space-y-4 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-4">Add Collaborator</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">User Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:outline-none transition-all font-bold text-sm"
                placeholder="colleague@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Privilege Level</label>
              <select
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:outline-none transition-all font-bold text-sm"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="teacher">Teacher (Can Edit & Grade)</option>
                <option value="monitor">Monitor (Read-only Analytics)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-all font-black text-sm disabled:opacity-50 mt-4"
            >
              {loading ? "Adding..." : "Grant Privilege"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-10 p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-indigo-900 dark:text-indigo-100">Access Requests</h3>
                        <p className="text-sm font-medium text-indigo-600/80 dark:text-indigo-300/80">Manage pending requests from students</p>
                    </div>
                </div>
                <Link 
                    href={`/quizzes/${quizId}/access`}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200/50 dark:shadow-none"
                >
                    Manage Requests
                </Link>
             </div>
          </div>

          <div className="rounded-3xl border-2 border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left font-bold text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-muted-foreground border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Collaborator</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {collaborators.length > 0 ? collaborators.map((role) => (
                  <tr key={role._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{role.userId?.name || role.userId?.email || "Unknown User"}</span>
                        <span className="text-xs text-muted-foreground">{role.userId?.email || "Deleted Account"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest ${
                        role.role === 'creator' ? 'bg-indigo-100 text-indigo-600' :
                        role.role === 'teacher' ? 'bg-emerald-100 text-emerald-600' :
                        role.role === 'monitor' ? 'bg-amber-100 text-amber-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {role.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {role.role !== 'creator' && (
                        <button
                          onClick={() => handleRemoveRole(role.userId._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No collaborators found. Add one on the left.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
