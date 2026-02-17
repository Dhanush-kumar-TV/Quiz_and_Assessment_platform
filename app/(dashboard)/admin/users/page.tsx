"use client";

import { useEffect, useState } from "react";
import { 
    Users, 
    Shield, 
    UserPlus, 
    Search, 
    MoreVertical, 
    UserX, 
    UserCheck, 
    Briefcase,
    Loader2,
    Filter,
    Upload,
    CheckCircle,
    X
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<any>(null);

    useEffect(() => {
        if (session && (session.user as any).role !== 'admin') {
            router.push("/dashboard");
        }
        fetchUsers();
    }, [session, router]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (res.ok) setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadStatus(null);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/users/bulk", {
                method: "POST",
                body: formData
            });
            const result = await res.json();
            if (res.ok) {
                setUploadStatus(result);
                fetchUsers();
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const updateUser = async (userId: string, update: any) => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, ...update })
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setUsers(users.map(u => u._id === userId ? updatedUser : u));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "all" || u.role === filter || (filter === "suspended" && u.status === "inactive");
        return matchesSearch && matchesFilter;
    });

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900">User Management</h1>
                    <p className="text-muted-foreground font-medium mt-1">Control access, roles, and suspension platform-wide.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                     <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-border/50 shadow-sm">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Find user..." 
                            className="bg-transparent border-none focus:ring-0 text-sm font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                     <select 
                        className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-border/50 shadow-sm font-bold text-sm focus:ring-primary"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                     >
                        <option value="all">All Users</option>
                        <option value="admin">Admins</option>
                        <option value="trainer">Trainers</option>
                        <option value="user">Participants</option>
                        <option value="suspended">Suspended</option>
                     </select>
                     
                     <div className="relative">
                        <input 
                            type="file" 
                            id="bulk-upload" 
                            className="hidden" 
                            accept=".xlsx, .xls, .csv"
                            onChange={handleBulkUpload}
                            disabled={uploading}
                        />
                        <label 
                            htmlFor="bulk-upload"
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all cursor-pointer shadow-lg hover:-translate-y-0.5 ${
                                uploading 
                                ? "bg-secondary text-muted-foreground cursor-wait" 
                                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                            }`}
                        >
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {uploading ? "Uploading..." : "Bulk Upload"}
                        </label>
                     </div>
                </div>
            </div>

            {uploadStatus && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-emerald-900 text-lg">Bulk Upload Complete</p>
                            <p className="text-emerald-700 font-medium">
                                Successfully created <span className="font-bold">{uploadStatus.success}</span> users. 
                                {uploadStatus.errors > 0 && ` Encountered ${uploadStatus.errors} errors.`}
                            </p>
                        </div>
                    </div>
                    {uploadStatus.errors > 0 && (
                        <div className="max-w-md bg-white/50 backdrop-blur-sm rounded-xl p-3 text-[10px] font-bold text-red-600 max-h-24 overflow-y-auto">
                            {uploadStatus.details.map((d: string, i: number) => <p key={i}>{d}</p>)}
                        </div>
                    )}
                    <button onClick={() => setUploadStatus(null)} className="p-2 hover:bg-emerald-100 rounded-full transition-colors text-emerald-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-secondary/20 border-b border-border/50">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="group hover:bg-secondary/10 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-lg border border-primary/10">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <select 
                                            value={user.role}
                                            onChange={(e) => updateUser(user._id, { role: e.target.value })}
                                            className="bg-secondary/30 border-none rounded-xl text-xs font-black uppercase tracking-widest px-3 py-1.5 focus:ring-1 focus:ring-primary"
                                        >
                                            <option value="user">User</option>
                                            <option value="trainer">Trainer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        user.status === 'active' 
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                        : 'bg-red-50 text-red-600 border-red-100'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {user.status === 'active' ? (
                                            <button 
                                                onClick={() => updateUser(user._id, { status: 'inactive' })}
                                                className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                                                title="Suspend Account"
                                            >
                                                <UserX className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => updateUser(user._id, { status: 'active' })}
                                                className="p-2 rounded-xl text-emerald-500 hover:bg-emerald-50 transition-colors"
                                                title="Activate Account"
                                            >
                                                <UserCheck className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                        <p className="text-muted-foreground font-bold italic">No users found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
