"use client";

import { useEffect, useState } from "react";
import { 
    Plus, 
    LayoutGrid, 
    ChevronRight,
    Loader2,
    Briefcase,
    X
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Group {
    _id: string;
    name: string;
    description?: string;
    members?: { _id: string; name: string }[];
    trainer?: { name: string };
}

interface User {
    _id: string;
    name: string;
    role: string;
}

export default function GroupsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [groups, setGroups] = useState<Group[]>([]);
    const [trainers, setTrainers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        trainerId: "",
        memberIds: [] as string[]
    });

    useEffect(() => {
        if (session && (session.user as { role: string }).role === 'user') {
            router.push("/dashboard");
        }
        fetchData();
        if ((session?.user as { role: string })?.role === 'admin') {
            fetchAdminData();
        }
    }, [session, router]);

    async function fetchData() {
        try {
            const res = await fetch("/api/groups");
            const data = await res.json();
            if (res.ok) setGroups(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchAdminData() {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (res.ok) {
                setTrainers(data.filter((u: User) => u.role === 'trainer' || u.role === 'admin'));
                setAllUsers(data.filter((u: User) => u.role === 'user'));
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/groups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowCreateModal(false);
                setFormData({ name: "", description: "", trainerId: "", memberIds: [] });
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

    const isAdmin = (session?.user as { role: string })?.role === 'admin';

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900">Groups</h1>
                    <p className="text-muted-foreground font-medium mt-1">Organize participants and assign trainers.</p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-all hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Group
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groups.map((group) => (
                    <div key={group._id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-border shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <LayoutGrid className="w-7 h-7" />
                                </div>
                                <span className="px-4 py-1.5 bg-secondary rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {group.members?.length || 0} Members
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 line-clamp-1">{group.name}</h3>
                                <p className="text-sm text-muted-foreground font-medium mt-2 line-clamp-2">{group.description || "No description provided."}</p>
                            </div>
                            <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-black text-muted-foreground uppercase tracking-widest text-[9px]">Trainer</p>
                                        <p className="font-bold text-slate-900">{group.trainer?.name || "Unassigned"}</p>
                                    </div>
                                </div>
                                <button className="p-2 rounded-xl bg-secondary/50 text-muted-foreground hover:text-primary transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {groups.length === 0 && (
                <div className="py-20 text-center space-y-4">
                    <LayoutGrid className="w-16 h-16 text-muted-foreground/20 mx-auto" />
                    <p className="text-muted-foreground font-bold italic text-lg">No groups found.</p>
                    {isAdmin && <p className="text-sm text-slate-400">Start by creating your first organizational unit.</p>}
                </div>
            )}

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-8 right-8 p-2 rounded-full hover:bg-secondary transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-3xl font-black text-slate-900 mb-8">Create Group</h2>
                        <form onSubmit={handleCreateGroup} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Group Name</label>
                                <input 
                                    required
                                    type="text"
                                    className="w-full px-6 py-4 rounded-2xl bg-secondary/30 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all font-bold text-lg shadow-inner"
                                    placeholder="e.g. Frontend Engineers Q1"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                                <textarea 
                                    className="w-full px-6 py-4 rounded-2xl bg-secondary/30 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all font-bold shadow-inner min-h-[100px]"
                                    placeholder="Tell us about this group..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Assign Trainer</label>
                                    <select 
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-secondary/30 border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all font-bold shadow-inner"
                                        value={formData.trainerId}
                                        onChange={(e) => setFormData({...formData, trainerId: e.target.value})}
                                    >
                                        <option value="">Select a trainer</option>
                                        {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Initial Members</label>
                                    <div className="px-6 py-4 rounded-2xl bg-secondary/30 border border-transparent shadow-inner max-h-32 overflow-y-auto space-y-2">
                                        {allUsers.map(u => (
                                            <label key={u._id} className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded-lg border-2 border-slate-300 text-primary focus:ring-primary"
                                                    checked={formData.memberIds.includes(u._id)}
                                                    onChange={(e) => {
                                                        const newIds = e.target.checked 
                                                            ? [...formData.memberIds, u._id]
                                                            : formData.memberIds.filter(id => id !== u._id);
                                                        setFormData({...formData, memberIds: newIds});
                                                    }}
                                                />
                                                <span className="text-sm font-bold group-hover:text-primary transition-colors">{u.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <button 
                                    type="submit"
                                    className="w-full bg-primary text-primary-foreground py-5 rounded-3xl font-black text-xl shadow-2xl shadow-primary/30 hover:opacity-90 transition-all hover:-translate-y-1"
                                >
                                    Create Group
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
