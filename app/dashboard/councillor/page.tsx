"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    Users, 
    MapPin, 
    Image as ImageIcon, 
    Search,
    Filter,
    ArrowUpRight,
    TrendingUp,
    PieChart as PieChartIcon,
    Briefcase,
    Activity,
    ChevronRight,
    MessageSquare,
    Eye
} from "lucide-react";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from "recharts";
import GradientText from "@/components/GradientText";
import Prism from "@/components/Prism";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const complaints = [
    {
        id: "CMP-1024",
        title: "Broken Street Light",
        address: "Lane 4, Hauz Khas Village, Delhi",
        status: "Active",
        priority: "High",
        reportedAt: "2 hours ago",
        image: "https://images.unsplash.com/photo-1517420812314-8b17179f32ca?auto=format&fit=crop&q=80&w=800",
        problem: "Main street light non-functional for 3 days, causing safety issues at night.",
        lat: 28.5494,
        lng: 77.1919
    },
    {
        id: "CMP-1025",
        title: "Garbage Pileup",
        address: "Near SDA Market, Opp. Gate 2",
        status: "Critical",
        priority: "Urgent",
        reportedAt: "30 mins ago",
        image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
        problem: "MCD truck hasn't arrived for 2 days. Garbage spilling onto the main road.",
        lat: 28.5454,
        lng: 77.1990
    },
    {
        id: "CMP-1020",
        title: "Pothole Repair",
        address: "Panchsheel Park, Block B",
        status: "Resolved",
        priority: "Medium",
        reportedAt: "Yesterday",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
        problem: "Large pothole fixed after 48 hours of reporting.",
        lat: 28.5384,
        lng: 77.2119
    }
];

const fleetData = [
    { id: "PW-01", name: "Rahul Sharma", role: "Sanitation Lead", status: "On Field", battery: "85%", tasks: 4 },
    { id: "PW-02", name: "Sunil Kumar", role: "Electrician", status: "Idle", battery: "42%", tasks: 1 },
    { id: "PW-03", name: "Amit Verma", role: "Field Inspector", status: "Traveling", battery: "92%", tasks: 6 },
];

const boothIntelligence = {
    religion: [
        { name: "Hindu", value: 68, color: "#f59e0b" },
        { name: "Muslim", value: 18, color: "#10b981" },
        { name: "Sikh", value: 8, color: "#3b82f6" },
        { name: "Others", value: 6, color: "#6366f1" },
    ],
    gender: [
        { name: "Male", value: 52, color: "#2563eb" },
        { name: "Female", value: 47, color: "#db2777" },
        { name: "Other", value: 1, color: "#8b5cf6" },
    ],
    age: [
        { range: "18-25", count: 450 },
        { range: "26-40", count: 890 },
        { range: "41-60", count: 620 },
        { range: "60+", count: 310 },
    ],
    occupation: [
        { type: "Business", count: 540 },
        { type: "Service", count: 720 },
        { type: "Student", count: 320 },
        { type: "Homemaker", count: 410 },
        { type: "Others", count: 280 },
    ]
};

// --- Components ---

function ComplaintModal({ complaint, onClose }: { complaint: any, onClose: () => void }) {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-white/10 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative h-64 w-full">
                    <img src={complaint.image} alt="Issue" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full"
                        onClick={onClose}
                    >
                        ✕
                    </Button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <Badge className={cn(
                                "uppercase text-[10px] font-black tracking-tighter",
                                complaint.status === 'Critical' ? 'bg-rose-500' : 
                                complaint.status === 'Active' ? 'bg-amber-500' : 'bg-emerald-500'
                            )}>
                                {complaint.status}
                            </Badge>
                            <h3 className="text-2xl font-black text-white tracking-tight">{complaint.title}</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Reported At</p>
                            <p className="text-white font-medium">{complaint.reportedAt}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Address Details
                                </p>
                                <p className="text-sm text-slate-300 font-medium leading-relaxed">{complaint.address}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-indigo-400 font-mono">
                                Lat: {complaint.lat} <br /> Lng: {complaint.lng}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                <AlertCircle className="w-3 h-3" /> Problem Description
                            </p>
                            <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                                "{complaint.problem}"
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white h-12 rounded-xl font-bold uppercase tracking-tight">
                            Dispatch Team
                        </Button>
                        <Button variant="outline" className="flex-1 border-white/10 bg-white/5 text-white h-12 rounded-xl font-bold uppercase tracking-tight">
                            Mark as Resolved
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function CouncillorDashboard() {
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');

    const stats = useMemo(() => {
        const active = complaints.filter(c => c.status === 'Active').length;
        const resolved = complaints.filter(c => c.status === 'Resolved').length;
        const critical = complaints.filter(c => c.status === 'Critical').length;
        return { active, resolved, critical, total: complaints.length };
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
            <div className="fixed inset-0 pointer-events-none opacity-[0.1] -z-10">
                <Prism hueShift={220} animationType="rotate" scale={2.5} glow={1.5} noise={0.4} bloom={2} />
            </div>

            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 p-6 xl:px-12">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                                Councillor <span className="text-indigo-500">Command</span>
                            </h1>
                        </div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest pl-1">Ward 74: Chandni Chowk • MCD Central Zone</p>
                    </div>

                    <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5">
                        {['overview', 'booth', 'fleet'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-tighter transition-all",
                                    activeTab === tab ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-[1600px] mx-auto p-6 md:p-10 xl:p-12 space-y-12">
                
                {/* Dashboard: Overview */}
                {activeTab === 'overview' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10"
                    >
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: "Active", value: stats.active, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
                                { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                { label: "Critical", value: stats.critical, icon: Activity, color: "text-rose-500", bg: "bg-rose-500/10" },
                                { label: "Success Rate", value: "92%", icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                            ].map((stat, i) => (
                                <Card key={i} className="bg-slate-900/40 border-white/5 rounded-[32px] overflow-hidden group hover:border-white/10 transition-all">
                                    <CardContent className="p-8 flex items-center justify-between">
                                        <div className="space-y-4">
                                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label} Complaints</p>
                                            <h3 className="text-5xl font-black text-white tracking-tighter">{stat.value}</h3>
                                        </div>
                                        <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center", stat.bg)}>
                                            <stat.icon className={cn("w-8 h-8", stat.color)} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Main Feed Sections */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                            {/* Recent Complaints */}
                            <div className="xl:col-span-2 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 uppercase italic">
                                        <MessageSquare className="w-6 h-6 text-indigo-500" /> Recent Field Reports
                                    </h2>
                                    <Button variant="ghost" className="text-indigo-400 text-xs font-black uppercase">View Archive →</Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {complaints.map((c) => (
                                        <Card key={c.id} className="bg-slate-900/40 border-white/5 rounded-[40px] overflow-hidden group hover:border-indigo-500/50 transition-all cursor-pointer" onClick={() => setSelectedComplaint(c)}>
                                            <div className="relative h-48">
                                                <img src={c.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={c.title} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                                                <Badge className={cn("absolute top-4 right-4", c.status === 'Critical' ? 'bg-rose-500 shadow-lg shadow-rose-900/50' : 'bg-amber-500')}>{c.status}</Badge>
                                            </div>
                                            <CardContent className="p-8 space-y-4">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{c.id}</p>
                                                    <h3 className="text-xl font-bold text-white tracking-tight">{c.title}</h3>
                                                </div>
                                                <div className="flex items-start gap-2 text-slate-400">
                                                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-600" />
                                                    <p className="text-xs leading-relaxed font-medium line-clamp-1">{c.address}</p>
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                        <span className="text-xs text-slate-500 font-bold uppercase">{c.reportedAt}</span>
                                                    </div>
                                                    <Button size="sm" variant="ghost" className="text-indigo-400 text-[10px] font-black p-0 hover:bg-transparent uppercase tracking-tight">View Details • Inspect</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Features */}
                            <div className="space-y-8">
                                {/* Critical Alert Ticker */}
                                <Card className="bg-rose-500/10 border-rose-500/20 rounded-[32px] overflow-hidden">
                                    <div className="bg-rose-500 p-4 flex items-center gap-3">
                                        <Activity className="w-5 h-5 text-white animate-pulse" />
                                        <p className="text-white font-black text-[11px] uppercase tracking-widest">Urgent Escalations</p>
                                    </div>
                                    <CardContent className="p-6 space-y-4">
                                        {complaints.filter(c => c.status === 'Critical').map((c, i) => (
                                            <div key={i} className="flex gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                                                    <img src={c.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-white leading-tight">{c.title}</p>
                                                    <p className="text-[10px] text-rose-400 font-medium uppercase">{c.address}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-700 ml-auto self-center" />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Quick Tools */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="h-28 rounded-3xl bg-slate-900/50 border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-indigo-600 hover:text-white group">
                                        <Users className="w-6 h-6 text-indigo-500 group-hover:text-white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Call Ward CM</span>
                                    </Button>
                                    <Button variant="outline" className="h-28 rounded-3xl bg-slate-900/50 border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-indigo-600 hover:text-white group">
                                        <ImageIcon className="w-6 h-6 text-indigo-500 group-hover:text-white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">CCTV Feed</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Dashboard: Booth Intelligence */}
                {activeTab === 'booth' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-10"
                    >
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-1">
                                <h1 className="text-5xl font-black text-white flex items-center gap-4 tracking-tighter uppercase italic">
                                    <PieChartIcon className="w-12 h-12 text-indigo-500" />
                                    Booth <span className="text-indigo-400">Intelligence</span>
                                </h1>
                                <p className="text-slate-400 font-medium text-lg pl-1">Hyper-local socio-economic & demographic mapping.</p>
                            </div>
                            <Button className="bg-indigo-600 h-14 px-8 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3">
                                Download Ward Report <CheckCircle2 className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {/* Religion Demographics */}
                            <Card className="bg-slate-900/40 border-white/5 rounded-[48px] overflow-hidden p-8 space-y-8">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 uppercase font-black text-[9px]">Socio-Religious</Badge>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">Religion Composition</h3>
                                </div>
                                <div className="h-[250px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={boothIntelligence.religion}
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {boothIntelligence.religion.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {boothIntelligence.religion.map((r, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-500 uppercase">{r.name}</span>
                                                <span className="text-lg font-black text-white">{r.value}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Gender & Age Demographics */}
                            <div className="flex flex-col gap-8 h-full">
                                <Card className="bg-slate-900/40 border-white/5 rounded-[40px] p-8 flex-1">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 uppercase font-black text-[9px]">Gender Distribution</Badge>
                                            <h3 className="text-xl font-black text-white tracking-tight uppercase">Voter Gender Density</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {boothIntelligence.gender.map((g, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-xs font-black text-white uppercase">{g.name}</span>
                                                        <span className="text-xl font-black" style={{ color: g.color }}>{g.value}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${g.value}%` }} 
                                                            className="h-full rounded-full"
                                                            style={{ backgroundColor: g.color }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>

                                <Card className="bg-indigo-600 border-none rounded-[40px] p-8 group overflow-hidden relative">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                                    <div className="relative space-y-4 z-10">
                                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Total Voters (Ward 74)</p>
                                        <h3 className="text-6xl font-black text-white tracking-tighter">42,500</h3>
                                        <div className="flex items-center gap-2 text-white/80 font-bold uppercase text-xs">
                                            <TrendingUp className="w-4 h-4" /> +4.2% Growth vs Last Term
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Occupation & Age Charts */}
                            <Card className="bg-slate-900/40 border-white/5 rounded-[48px] p-8 space-y-8">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 uppercase font-black text-[9px]">Economic Profile</Badge>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">Occupation Trends</h3>
                                </div>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={boothIntelligence.occupation}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis 
                                                dataKey="type" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} 
                                            />
                                            <YAxis hide />
                                            <Tooltip 
                                                cursor={{ fill: '#334155', opacity: 0.4 }}
                                                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }}
                                            />
                                            <Bar dataKey="count" fill="#6366f1" radius={[12, 12, 4, 4]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="p-6 bg-indigo-600/10 rounded-3xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Age Intelligence (Years)</p>
                                    <div className="flex items-end gap-1 h-12">
                                        {boothIntelligence.age.map((a, i) => (
                                            <div key={i} className="flex-1 group relative">
                                                <div 
                                                    className="w-full bg-slate-700/50 rounded-t-lg transition-all group-hover:bg-indigo-500" 
                                                    style={{ height: `${(a.count / 890) * 100}%` }} 
                                                />
                                                <div className="text-[8px] font-black text-slate-600 uppercase mt-2 text-center group-hover:text-indigo-400">{a.range}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {/* Dashboard: Fleet Management */}
                {activeTab === 'fleet' && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <h1 className="text-5xl font-black text-white flex items-center gap-4 tracking-tighter uppercase italic">
                                    <Briefcase className="w-12 h-12 text-indigo-500" />
                                    Fleet <span className="text-indigo-400">Commander</span>
                                </h1>
                                <p className="text-slate-400 font-medium text-lg pl-1">Real-time party worker management & task allocation.</p>
                            </div>
                            <div className="flex gap-4">
                                <Input className="bg-slate-900 border-white/5 h-14 w-64 rounded-2xl pl-12 text-sm font-medium" placeholder="Search Workers..." />
                                <Button className="bg-indigo-600 h-14 px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/30">
                                    Assign Global Task
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                            {/* Live Worker Status */}
                            <Card className="bg-slate-900/40 border-white/5 rounded-[48px] overflow-hidden">
                                <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-2xl font-black text-white uppercase italic">Active Duty Roster</CardTitle>
                                        <Badge className="bg-emerald-500 px-4 py-1.5 uppercase font-black text-[9px] tracking-widest">8 Workers Online</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-white/[0.05]">
                                        {fleetData.map((worker) => (
                                            <div key={worker.id} className="p-8 flex items-center justify-between hover:bg-white/[0.03] transition-colors group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center relative">
                                                        <Users className="w-8 h-8 text-indigo-400" />
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-[#0F172A] rounded-full" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-black text-white tracking-tight">{worker.name}</p>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{worker.role} • {worker.id}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-12">
                                                    <div className="text-center">
                                                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Battery</p>
                                                        <p className="text-xl font-black text-emerald-500">{worker.battery}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Active Tasks</p>
                                                        <p className="text-xl font-black text-white">{worker.tasks}</p>
                                                    </div>
                                                    <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 group-hover:scale-110 transition-all">
                                                        <ArrowUpRight className="w-6 h-6 text-indigo-400" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Duty Stats & Allocation */}
                            <div className="space-y-10">
                                <Card className="bg-indigo-600 border-none rounded-[56px] p-12 overflow-hidden relative group">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
                                    <div className="relative z-10 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                                <Activity className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Performance Matrix</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Avg Response Time</p>
                                                <p className="text-5xl font-black text-white">42<span className="text-xl ml-1 text-white/50">min</span></p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Complaint Resolved</p>
                                                <p className="text-5xl font-black text-white">88%</p>
                                            </div>
                                        </div>
                                        <Button className="w-full h-16 rounded-[28px] bg-white text-indigo-600 font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all shadow-2xl">
                                            Generate Performance Report
                                        </Button>
                                    </div>
                                </Card>

                                <div className="grid grid-cols-2 gap-6">
                                    <Card className="bg-slate-900/40 border-white/5 rounded-[40px] p-8 space-y-4">
                                        <Clock className="w-8 h-8 text-amber-500" />
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-black text-white uppercase tracking-tight">Shift Coverage</h4>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">92% Coverage across ward</p>
                                        </div>
                                    </Card>
                                    <Card className="bg-slate-900/40 border-white/5 rounded-[40px] p-8 space-y-4">
                                        <Filter className="w-8 h-8 text-indigo-500" />
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-black text-white uppercase tracking-tight">Geo Clustering</h4>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">3 High Intensity Areas</p>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* Modal Overlay */}
            <AnimatePresence>
                {selectedComplaint && (
                    <ComplaintModal 
                        complaint={selectedComplaint} 
                        onClose={() => setSelectedComplaint(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
