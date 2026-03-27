"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
    LayoutDashboard,
    Briefcase,
    MapPin,
    Users,
    MessageSquare,
    Shield,
    ClipboardCheck,
    BarChart3,
    AlertTriangle,
    Send,
    FileText,
    Lock,
    Globe,
    Share2,
    Calendar,
    Clock,
    CheckCircle2,
    Search,
    ChevronRight,
    Download,
    Eye,
    Bell,
    Megaphone,
    Plus,
    Hammer,
    Zap,
    X,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import GradientText from "@/components/GradientText";
import Prism from "@/components/Prism";
import { cn } from "@/lib/utils";
import AICircle from "@/components/AICircle";

// --- Fallback Mock Data ---
const FALLBACK_TASKS = [
    { id: "TSK-001", title: "Ward Meeting Setup", description: "Arrange 50 chairs and sound system at Adarsh Nagar Community Center for evening rally.", deadline: "Today, 5:00 PM", status: "active", location: "Ward 45, North Delhi", priority: "high" },
    { id: "TSK-002", title: "Voter Slip Distribution", description: "Distribute slips in Block C & D. Target 200 households.", deadline: "Tomorrow, 12:00 PM", status: "active", location: "Karol Bagh", priority: "medium" },
    { id: "TSK-003", title: "Social Media Campaign", description: "Share the latest manifesto highlights on WhatsApp groups.", deadline: "Ongoing", status: "active", location: "Remote", priority: "low" }
];

const FALLBACK_HISTORY = [
    { id: "HST-901", title: "Morning Door-to-Door", completedDate: "2026-03-25", proof: "IMG_9921.jpg", status: "verified", notes: "Target reached. Positive feedback on water issues." },
    { id: "HST-882", title: "Banner Installation", completedDate: "2026-03-24", proof: "Banner_Ward4.png", status: "verified", notes: "Installed at 5 junctions." }
];

const FALLBACK_BOOTHS = [
    { id: "BTH-101", name: "Primary School Room 1", address: "Gali 4, Adarsh Nagar", inCharge: "Rahul Sharma", turnout: "62%" },
    { id: "BTH-102", name: "Community Center Hall", address: "Main Road, Ward 45", inCharge: "Priya Verma", turnout: "58%" },
    { id: "BTH-103", name: "Govt Sr Sec School", address: "Block B, Adarsh Nagar", inCharge: "Amit Kumar", turnout: "71%" },
];

const FALLBACK_ANNOUNCEMENTS = [
    { id: "ANN-01", title: "Urgent: Election Code Update", content: "All workers must follow the revised MCC guidelines from midnight.", time: "2h ago", from: "Central Command" },
    { id: "ANN-02", title: "New Banner Samples Available", content: "Download the latest high-res banner designs from the vault.", time: "5h ago", from: "Design Hub" },
];

export default function PartyWorkerDashboard() {
    const { user, role, logout } = useAuthStore();
    const [activeModule, setActiveModule] = useState("dashboard"); 
    const [activeTaskTab, setActiveTaskTab] = useState("active"); 
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // Dynamic Data States
    const [tasks, setTasks] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [booths, setBooths] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);

    const boothListRef = useRef<HTMLDivElement>(null);

    // Initial Data Fetch
    useEffect(() => {
        let isMounted = true;
        
        async function fetchDashboardData() {
            setLoading(true);
            try {
                // Parallel fetch attempt (Will fallback gracefully assuming tables might not exist yet)
                const [tasksRes, histRes, boothsRes, annRes] = await Promise.all([
                    supabase.from('party_tasks').select('*').eq('status', 'active'),
                    supabase.from('party_tasks').select('*').eq('status', 'completed'),
                    supabase.from('booths').select('*'),
                    supabase.from('announcements').select('*').order('created_at', { ascending: false })
                ]);

                if (!isMounted) return;

                // Fallbacks if data empty or error
                setTasks(tasksRes.data && tasksRes.data.length > 0 ? tasksRes.data : FALLBACK_TASKS);
                setHistory(histRes.data && histRes.data.length > 0 ? histRes.data : FALLBACK_HISTORY);
                setBooths(boothsRes.data && boothsRes.data.length > 0 ? boothsRes.data : FALLBACK_BOOTHS);
                setAnnouncements(annRes.data && annRes.data.length > 0 ? annRes.data : FALLBACK_ANNOUNCEMENTS);

            } catch (error) {
                console.error("Backend sync failed, using intelligence vault fallbacks", error);
                setTasks(FALLBACK_TASKS);
                setHistory(FALLBACK_HISTORY);
                setBooths(FALLBACK_BOOTHS);
                setAnnouncements(FALLBACK_ANNOUNCEMENTS);
            } finally {
                if (isMounted) setTimeout(() => setLoading(false), 800);
            }
        }

        fetchDashboardData();

        return () => { isMounted = false; };
    }, []);

    // GSAP Animation for Booth List
    useEffect(() => {
        if (activeModule === "territory" && !loading && boothListRef.current) {
            const items = boothListRef.current.querySelectorAll(".booth-item");
            if(items.length) {
                gsap.fromTo(items, 
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: "power3.out", clearProps: "all" }
                );
            }
        }
    }, [activeModule, loading, booths]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#030712] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                     <Prism hueShift={220} animationType="3drotate" scale={2} glow={0.5} />
                </div>
                <AICircle size={120} color="#6366f1" active={true} />
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center relative z-10"
                >
                    <h3 className="text-2xl font-black tracking-tighter uppercase text-white drop-shadow-lg">Establishing Secure Command</h3>
                    <p className="text-indigo-400 text-sm mt-2 font-mono flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Synchronizing Backend...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex overflow-hidden bg-[#030712] relative selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0 opacity-20 z-0">
                <Prism hueShift={220} animationType="rotate" scale={1.5} glow={0.5} />
            </div>
            
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full z-0 mixer-multiply pointer-events-none"/>

            <div className="flex w-full h-full p-4 lg:p-6 gap-6 relative z-10">
                {/* Main Command Workspace - Scrollable */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a]/60 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                    {/* Inner Header */}
                    <div className="shrink-0 p-8 lg:px-12 lg:py-10 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                        <div className="flex flex-col gap-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 mb-2"
                            >
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40 border border-indigo-400/50">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1.5 uppercase tracking-widest text-[9px] font-black rounded-lg">
                                    Field Operative Dashboard
                                </Badge>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg ml-auto">
                                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                   <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Live Sync</span>
                                </div>
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter"
                            >
                                <GradientText colors={['#ffffff', '#818cf8', '#ffffff']} className="ml-0">COMMAND CENTER</GradientText>
                            </motion.h1>
                            <p className="text-slate-400 text-sm lg:text-base font-medium">Welcome back, {user?.name || "Operative"}. Operational status: <span className="text-emerald-400 font-bold">READY</span></p>
                        </div>
                    </div>

                    {/* Scrollable Module Content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-12 custom-scrollbar">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeModule}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                {activeModule === "dashboard" && <CommandOverview user={user} tasks={tasks} booths={booths} />}
                                {activeModule === "tasks" && (
                                    <TaskModule 
                                        activeTab={activeTaskTab} 
                                        setActiveTab={setActiveTaskTab} 
                                        tasks={tasks}
                                        history={history}
                                        setTasks={setTasks}
                                    />
                                )}
                                {activeModule === "territory" && (
                                    <TerritoryModule 
                                        listRef={boothListRef} 
                                        booths={booths}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                    />
                                )}
                                {activeModule === "comms" && <CommunicationModule announcements={announcements} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side Sticky Navigation Sidebar */}
                <div className="hidden lg:flex w-80 shrink-0 flex-col gap-6">
                    <div className="bg-[#0f172a]/60 backdrop-blur-3xl border border-white/10 p-6 rounded-[40px] flex flex-col shadow-2xl h-full relative overflow-hidden flex-1 ring-1 ring-white/5">
                        <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />
                        
                        <div className="space-y-1 mb-8">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-4">Navigation</h3>
                        </div>
                        <div className="flex flex-col gap-3 flex-1">
                            {[
                                { id: "dashboard", label: "Overview", icon: LayoutDashboard },
                                { id: "tasks", label: "Workflows", icon: Briefcase },
                                { id: "territory", label: "Jurisdiction", icon: MapPin },
                                { id: "comms", label: "Broadcasts", icon: MessageSquare },
                            ].map((module) => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveModule(module.id)}
                                    className={cn(
                                        "w-full px-5 py-4 rounded-3xl text-sm font-black transition-all flex items-center justify-between group overflow-hidden relative",
                                        activeModule === module.id
                                            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30"
                                            : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5"
                                    )}
                                >
                                    {activeModule === module.id && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />}
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={cn("p-2 rounded-xl transition-colors", activeModule === module.id ? "bg-white/20" : "bg-white/5 group-hover:bg-indigo-500/20")}>
                                            <module.icon className={cn("w-5 h-5", activeModule === module.id ? "text-white" : "text-slate-400 group-hover:text-indigo-400")} /> 
                                        </div>
                                        {module.label}
                                    </div>
                                    {activeModule === module.id && <div className="w-1.5 h-1.5 rounded-full bg-white relative z-10" />}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] mb-6 flex-shrink-0 relative overflow-hidden group hover:border-indigo-500/40 transition-all cursor-default">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/20 pointer-events-none" />
                            <Zap className="w-6 h-6 text-indigo-400 mb-3" />
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">Active Pulse</h4>
                            <p className="text-[10px] text-indigo-300/80 font-bold leading-relaxed mt-1 uppercase tracking-widest">HQ real-time sync active.</p>
                        </div>

                        <div className="pt-6 border-t border-white/10 space-y-4 shrink-0">
                            <div className="flex items-center gap-4 px-2">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-black text-white shadow-lg">
                                    {user?.name?.[0] || "U"}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-black text-white truncate">{user?.name || "Operative"}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">Field Ops</p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => {
                                    logout();
                                    window.location.href = "/login";
                                }}
                                className="w-full justify-start text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 gap-3 h-14 rounded-2xl transition-all font-black"
                            >
                                <Lock className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-widest">Secure Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
             <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(99, 102, 241, 0.5);
                }
            `}} />
        </div>
    );
}

// --- Sub-Components ---

function CommandOverview({ user, tasks, booths }: any) {
    return (
        <div className="space-y-10">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Active Deployments", val: tasks.length < 10 ? `0${tasks.length}` : tasks.length, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", border: "hover:border-amber-400/30" },
                    { label: "Cleared Operations", val: "142", icon: ClipboardCheck, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "hover:border-emerald-400/30" },
                    { label: "Assigned Sector", val: "45-A", icon: MapPin, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "hover:border-indigo-400/30" },
                    { label: "Secured Booths", val: booths.length, icon: Shield, color: "text-sky-400", bg: "bg-sky-400/10", border: "hover:border-sky-400/30" },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        whileHover={{ y: -5 }}
                    >
                        <Card className={cn("bg-white/[0.02] backdrop-blur-3xl border-white/5 transition-all rounded-[32px] overflow-hidden group", stat.border)}>
                            <CardContent className="p-8 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110", stat.bg)}>
                                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                                </div>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                                <h4 className="text-5xl font-black text-white tracking-tighter">{stat.val}</h4>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Territory Snapshot */}
                <Card className="xl:col-span-2 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-3xl border-white/10 rounded-[40px] overflow-hidden group">
                    <CardHeader className="p-10 pb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase">Jurisdiction Status</CardTitle>
                                <CardDescription className="text-slate-400 font-medium mt-2">Critical overview of Sector 45 real-time operations.</CardDescription>
                            </div>
                            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 hidden sm:block">
                                <Globe className="w-8 h-8 text-indigo-400 animate-[spin_10s_linear_infinite]" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between mb-4">
                                        <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Ground Penetration</span>
                                        <span className="text-sm font-black text-emerald-400 text-right">62%</span>
                                    </div>
                                    <Progress value={62} className="h-2 bg-black/50" />
                                </div>
                                <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between mb-4">
                                        <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">Mission Success Rate</span>
                                        <span className="text-sm font-black text-indigo-400 text-right">88%</span>
                                    </div>
                                    <Progress value={88} className="h-2 bg-black/50" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-[32px] border border-indigo-500/20 p-8 flex flex-col justify-center gap-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500 shadow-xl shadow-indigo-500/40 flex items-center justify-center text-white font-black text-xl">45</div>
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-300/80 uppercase tracking-widest mb-1">Active Sector</p>
                                        <p className="text-white font-black text-2xl uppercase tracking-tight">Adarsh Nagar</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-2">Quick Escalate</h3>
                    <Button className="w-full h-[6.5rem] bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-[32px] flex items-center justify-between px-8 group transition-all shadow-xl shadow-rose-900/20 border border-rose-500/50">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-lg font-black tracking-tighter uppercase">Code Red Report</span>
                            <span className="text-xs font-bold text-rose-200">Alert High Command Instantly</span>
                        </div>
                        <AlertTriangle className="w-8 h-8 group-hover:scale-110 group-active:scale-95 transition-transform" />
                    </Button>
                    <Button className="w-full h-[6.5rem] bg-white/[0.05] hover:bg-white/10 text-white rounded-[32px] flex items-center justify-between px-8 group transition-all border border-white/10">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-lg font-black tracking-tighter uppercase">Delegation Hub</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reassign team tasks</span>
                        </div>
                        <Share2 className="w-7 h-7 text-slate-400 group-hover:text-white transition-colors" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function TaskModule({ activeTab, setActiveTab, tasks, history, setTasks }: any) {
    const [executingTask, setExecutingTask] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isCompressed, setIsCompressed] = useState(false);

    const handleExecute = (task: any) => {
        setExecutingTask(task);
        setIsCompressed(false);
    };

    const handleUpload = async () => {
        setIsUploading(true);
        // Simulate compression + upload + DB sync
        setTimeout(() => setIsCompressed(true), 1200);
        setTimeout(async () => {
            // Simulated backend completion update
            try {
               await supabase.from('party_tasks').update({status: 'completed'}).eq('id', executingTask.id);
            } catch(e) { console.log("DB update silently failed on mock"); }
            
            // Optimistic update locally
            setTasks((prev: any) => prev.filter((t: any) => t.id !== executingTask.id));
            setIsUploading(false);
            setExecutingTask(null);
        }, 3000);
    };

    return (
        <div className="space-y-10 max-w-6xl mx-auto">
            <div className="flex font-black text-[10px] uppercase tracking-widest border-b border-white/10">
                <button 
                    onClick={() => setActiveTab("active")}
                    className={cn("px-8 py-5 border-b-2 transition-all relative overflow-hidden", activeTab === "active" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-500 hover:text-white")}
                >
                    {activeTab === "active" && <span className="absolute inset-0 bg-indigo-500/10" />}
                    Active Deployments ({tasks.length})
                </button>
                <button 
                    onClick={() => setActiveTab("history")}
                    className={cn("px-8 py-5 border-b-2 transition-all relative overflow-hidden", activeTab === "history" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-500 hover:text-white")}
                >
                    {activeTab === "history" && <span className="absolute inset-0 bg-emerald-500/10" />}
                    Success Log ({history.length})
                </button>
            </div>

            <AnimatePresence mode="wait">
                {executingTask ? (
                    <motion.div
                        key="execution-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-indigo-900/10 backdrop-blur-md border border-indigo-500/30 rounded-[40px] p-10 space-y-10 relative shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none rounded-r-[40px]"/>
                        
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-3 max-w-2xl">
                                <div className="flex items-center gap-3">
                                   <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Operation</span>
                                </div>
                                <h3 className="text-4xl font-black text-white uppercase tracking-tight leading-none">{executingTask.title}</h3>
                                <p className="text-slate-300 font-medium text-lg pt-2">{executingTask.description}</p>
                            </div>
                            <Button variant="ghost" className="w-14 h-14 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white bg-black/20" onClick={() => setExecutingTask(null)}>
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-2">Action Required: Upload Verification Media</h4>
                                <div className="border border-dashed border-indigo-500/40 rounded-[32px] p-16 bg-black/40 text-center flex flex-col items-center justify-center gap-6 group cursor-pointer hover:border-indigo-400 hover:bg-indigo-950/20 transition-all shadow-inner">
                                    <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all border border-indigo-500/20">
                                        <Plus className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-xl uppercase tracking-tight">Drop intel artifacts here</p>
                                        <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-widest">Auto-optimizes images & docs payload</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-2">System Validation</h4>
                                <div className="p-8 bg-black/40 rounded-[32px] border border-white/5 space-y-6">
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <AlertTriangle className="w-6 h-6 text-orange-400 shrink-0" />
                                        <div>
                                            <p className="text-xs font-black text-white uppercase">Location Stamping Required</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1">Ensure GPS privileges are enabled on device.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <Shield className="w-6 h-6 text-emerald-400 shrink-0" />
                                        <div>
                                            <p className="text-xs font-black text-white uppercase">End-to-End Encryption</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1">Payload fortified for Central Command.</p>
                                        </div>
                                    </div>
                                    <div className="pt-6 space-y-6">
                                        {isUploading && (
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-indigo-400 animate-pulse">{isCompressed ? "Transmitting to HQ DB" : "Compressing Media Array"}</span>
                                                    <span className="text-white">{isCompressed ? "70%" : "30%"}</span>
                                                </div>
                                                <Progress value={isCompressed ? 70 : 30} className={cn("h-2 bg-black", "[&>div]:bg-indigo-500")} />
                                            </div>
                                        )}
                                        <Button 
                                            onClick={handleUpload} 
                                            disabled={isUploading}
                                            className="w-full h-[4.5rem] bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50"
                                        >
                                            {isUploading ? <><Loader2 className="w-5 h-5 animate-spin mr-3" /> Processing...</> : "Submit Verified Report"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {activeTab === "active" && tasks.map((task: any) => (
                            <Card key={task.id} className="bg-white/[0.03] backdrop-blur-sm border-white/5 rounded-[32px] hover:bg-white/[0.05] hover:border-indigo-500/40 transition-all duration-300 flex flex-col h-full overflow-hidden">
                                <CardContent className="p-0 flex flex-col h-full">
                                    <div className="p-8 flex-1 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className={cn(
                                                "border-transparent font-black uppercase tracking-widest text-[9px] px-3 py-1",
                                                task.priority === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'
                                            )}>
                                                {task.priority || "Normal"} Priority
                                            </Badge>
                                            <span className="text-slate-600 font-mono text-[10px] font-bold tracking-widest">{task.id}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white uppercase leading-tight line-clamp-2">{task.title}</h3>
                                            <p className="text-slate-400 font-medium mt-3 text-sm line-clamp-3">{task.description}</p>
                                        </div>
                                        <div className="space-y-2 pt-2 bg-black/20 p-4 rounded-2xl border border-white/5">
                                            <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                                <Calendar className="w-3.5 h-3.5 mr-3 text-indigo-500" /> {task.deadline}
                                            </div>
                                            <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                                <MapPin className="w-3.5 h-3.5 mr-3 text-emerald-500" /> {task.location}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 gap-3 mt-auto border-t border-white/5 bg-black/10">
                                        <Button 
                                            onClick={() => handleExecute(task)}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-14 rounded-[20px] font-black uppercase tracking-widest text-[10px]"
                                        >
                                            Execute <Hammer className="ml-2 w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10 text-slate-300 h-14 rounded-[20px] font-black uppercase tracking-widest text-[10px] bg-white/5">
                                            Issue
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                    {activeTab === "history" && history.map((item: any) => (
                        <Card key={item.id} className="bg-emerald-900/10 border-emerald-500/20 rounded-[32px] group flex flex-col h-full hover:bg-emerald-900/20 transition-colors">
                            <CardContent className="p-8 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                                        <CheckCircle2 className="w-7 h-7" />
                                    </div>
                                    <Badge variant="outline" className="bg-black/40 border-emerald-500/20 text-emerald-400 text-[9px] uppercase tracking-widest font-black">
                                        Verified DB Entry
                                    </Badge>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight">{item.title}</h4>
                                    <p className="text-[10px] text-emerald-500/80 font-black uppercase tracking-widest">Logged: {item.completedDate}</p>
                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 mt-4">
                                        <p className="text-slate-300 text-sm font-medium italic line-clamp-3">"{item.notes}"</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="w-full mt-6 h-12 rounded-[16px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 gap-2 font-black uppercase tracking-widest text-[10px] transition-all">
                                    <Download className="w-3.5 h-3.5" /> Intelligence Report
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TerritoryModule({ listRef, booths, searchQuery, setSearchQuery }: any) {
    // Basic mock resources since we didn't fetch them specifically
    const resources = [
        { id: "DOC-01", name: "Manifesto 2026", type: "PDF", size: "2.4 MB" },
        { id: "DOC-02", name: "Voter Data - Ward 45", type: "XLSX", size: "1.1 MB" },
        { id: "DOC-03", name: "Digital Assets", type: "ZIP", size: "15.8 MB" },
    ];

    return (
        <div className="space-y-16 max-w-6xl mx-auto">
            {/* Booth Directory */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] p-8 rounded-[32px] border border-white/5">
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Jurisdiction Sites</h2>
                        <p className="text-indigo-400 font-bold mt-1 uppercase tracking-widest text-[11px]">Active Polling & Setup Nodes</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Locate sites by ID or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-[20px] h-14 pl-14 pr-6 text-white text-sm font-bold placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {booths.filter((b:any) => typeof b.name === 'string' && b.name.toLowerCase().includes(searchQuery.toLowerCase())).map((booth: any) => (
                        <Card key={booth.id} className="booth-item bg-white/[0.03] backdrop-blur-md border-white/5 rounded-[32px] overflow-hidden group hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                        <MapPin className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">{booth.id}</span>
                                </div>
                                <CardTitle className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase leading-tight line-clamp-1">{booth.name}</CardTitle>
                                <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-wide line-clamp-1">{booth.address}</p>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-5">
                                <div className="p-4 bg-black/30 rounded-2xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Commander</p>
                                        <p className="text-white font-black text-sm uppercase">{booth.inCharge}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs">
                                        {typeof booth.inCharge === 'string' ? booth.inCharge[0] : 'U'}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-0">
                                <Button variant="ghost" className="w-full h-14 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors bg-white/5">
                                    Request Intel <Eye className="ml-2 w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Document Vault */}
            <div className="p-10 bg-indigo-900/20 border border-indigo-500/20 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                    <Lock className="w-48 h-48" />
                </div>
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                            <FileText className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Intelligence Vault</h2>
                            <p className="text-indigo-400/80 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Classified Campaign Resources</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((res: any) => (
                            <div key={res.id} className="bg-black/40 border border-white/5 rounded-3xl p-6 flex flex-col hover:border-indigo-500/50 transition-all cursor-pointer group">
                                <div className="flex justify-between items-center mb-6">
                                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-black text-indigo-400 border-indigo-500/30 bg-indigo-500/10 rounded-lg">{res.type}</Badge>
                                    <Download className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <h4 className="text-lg font-black text-white uppercase tracking-tight">{res.name}</h4>
                                <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">{res.size}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CommunicationModule({ announcements }: any) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center gap-5 bg-white/[0.02] p-8 rounded-[32px] border border-white/5">
                    <div className="w-14 h-14 bg-sky-500/20 rounded-2xl flex items-center justify-center border border-sky-500/30">
                        <Megaphone className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">HQ Broadcasts</h2>
                        <p className="text-sky-400/80 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Encrypted Comms Channel</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {announcements.map((ann: any, i: number) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={ann.id}
                            className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 lg:p-10 group hover:border-sky-500/40 hover:bg-sky-900/10 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute -right-10 -top-10 opacity-[0.03] pointer-events-none transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                <Shield className="w-64 h-64" />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center shrink-0">
                                    <Bell className="w-6 h-6 text-sky-400" />
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <Badge className="bg-sky-500 text-white hover:bg-sky-400 uppercase font-black text-[9px] tracking-widest px-3 py-1 rounded-md">Priority</Badge>
                                        <h4 className="text-2xl font-black text-white group-hover:text-sky-400 transition-colors uppercase leading-tight">{ann.title}</h4>
                                    </div>
                                    <div className="p-5 bg-black/30 rounded-2xl border border-white/5">
                                        <p className="text-slate-300 font-medium text-base lg:text-lg leading-relaxed">{ann.content}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 pt-2">
                                        <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-sky-500" /> {ann.from}</span>
                                        <div className="w-1 h-1 rounded-full bg-slate-700" />
                                        <span>{ann.time}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="p-10 bg-gradient-to-br from-rose-900/30 to-black/40 border border-rose-500/20 rounded-[40px] space-y-8 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-600/20 blur-[60px] pointer-events-none" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center border border-rose-500/30 mb-6">
                            <AlertTriangle className="w-6 h-6 text-rose-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-tight">Emergency Escalation</h3>
                        <p className="text-rose-200/60 font-medium text-sm mt-3 leading-relaxed">Direct line to Central Nerve. Missuse is strictly prohibited and logged.</p>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <select className="w-full bg-black/50 border border-white/10 rounded-[20px] h-14 px-5 text-white text-sm font-bold outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer">
                                <option>Select Threat Level</option>
                                <option>Code Red: Security Breach</option>
                                <option>Code Orange: Logistics Failure</option>
                                <option>Code Yellow: Personnel Issue</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <textarea 
                                className="w-full bg-black/50 border border-white/10 rounded-[24px] p-5 text-white text-sm font-medium outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all min-h-[140px] resize-none"
                                placeholder="Transmit coordinates and intel here..."
                            ></textarea>
                        </div>
                        <Button className="w-full bg-rose-600 hover:bg-rose-500 text-white h-[4rem] rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-rose-900/40 relative overflow-hidden group">
                            <span className="relative z-10 flex items-center justify-center">
                                Dispatch Flare <Send className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
