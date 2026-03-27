"use client";

import React from "react";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
    Activity,
    CheckCircle2,
    AlertCircle,
    Info,
    Users,
    ChevronRight,
    ExternalLink,
    Filter,
    Download,
    Search,
    UserPlus,
    BarChart3,
    PieChart as PieChartIcon
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Treemap,
} from "recharts";
import { motion } from "framer-motion";

// --- MOCK DATA ---

const kpiData = [
    { title: "Active Complaints", value: "1,284", trend: "+5.2%", icon: Activity, color: "text-blue-600", bg: "bg-blue-100", motif: "blue" },
    { title: "Resolved Cases", value: "8,942", trend: "+12.4%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100", motif: "emerald" },
    { title: "Critical Issues", value: "42", trend: "-2.1%", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-100", motif: "rose" },
    { title: "Needs Attention", value: "156", trend: "+0.8%", icon: Info, color: "text-amber-600", bg: "bg-amber-100", motif: "amber" },
];

const councillorData = [
    { ward: "Ward 01", name: "Sunita Sharma", status: "Active", pending: 24, contact: "Available" },
    { ward: "Ward 04", name: "Rajesh Kumar", status: "In-Meeting", pending: 18, contact: "Busy" },
    { ward: "Ward 07", name: "Amit Goel", status: "On-Field", pending: 42, contact: "Available" },
    { ward: "Ward 12", name: "Priya Singh", status: "Active", pending: 15, contact: "Available" },
    { ward: "Ward 15", name: "Vikram Malhotra", status: "Offline", pending: 31, contact: "Away" },
];

const genderData = [
    { name: 'Male', value: 5240, color: '#2563eb' },
    { name: 'Female', value: 4890, color: '#db2777' },
    { name: 'Other', value: 210, color: '#0f172a' },
];

const ageData = [
    { age: '18-25', count: 2400 },
    { age: '26-40', count: 4800 },
    { age: '41-60', count: 3200 },
    { age: '60+', count: 1200 },
];

const religionData = [
    { name: 'Hinduism', value: 6500 },
    { name: 'Islam', value: 2100 },
    { name: 'Sikhism', value: 800 },
    { name: 'Christianity', value: 400 },
    { name: 'Others', value: 200 },
];

const casteData = [
    { name: 'General', value: 4500, color: '#0f172a' },
    { name: 'OBC', value: 3200, color: '#334155' },
    { name: 'SC', value: 1800, color: '#64748b' },
    { name: 'ST', value: 700, color: '#94a3b8' },
];

const occupationData = [
    { name: 'Government', size: 2400 },
    { name: 'Private Sector', size: 3800 },
    { name: 'Self-Employed', size: 1800 },
    { name: 'Student', size: 1200 },
    { name: 'Retired', size: 800 },
    { name: 'Others', size: 500 },
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// --- COMPONENTS ---

const SectionHeading = ({ children, icon: Icon }: { children: string, icon: any }) => (
    <div className="flex items-center gap-2 mb-6 mt-10">
        <div className="p-2 bg-slate-100 rounded-lg">
            <Icon className="w-5 h-5 text-slate-700" />
        </div>
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">{children}</h2>
    </div>
);

export default function MayorsDashboard() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[1600px] mx-auto space-y-8"
            >
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mayor's Command Center</h1>
                        <p className="text-slate-500 mt-1">Real-time governance dashboard & demographic intelligence portal.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="gap-2 bg-white">
                            <Download className="w-4 h-4" /> Export Data
                        </Button>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                            <Search className="w-4 h-4" /> Global Search
                        </Button>
                    </div>
                </div>

                {/* 1. TOP KPI SUMMARY CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpiData.map((stat, i) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                            <stat.icon className="w-6 h-6 border-slate-200" />
                                        </div>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold text-[10px]">
                                            {stat.trend}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">{stat.title}</p>
                                        <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">vs last month</span>
                                        <ChevronRight className="w-3 h-3 text-slate-300" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* 2. COUNCILLOR MANAGEMENT QUICK VIEW */}
                <div className="space-y-6">
                    <SectionHeading icon={Users}>Councillor Management</SectionHeading>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-50 mb-4 p-6">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Ward Performance Overview</CardTitle>
                                <CardDescription>Tracking real-time status and pending workload across wards.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Filter className="w-4 h-4" /> Filter Wards
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-900 px-6 uppercase text-[10px] tracking-widest">Ward Number</TableHead>
                                        <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Councillor Name</TableHead>
                                        <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Field Status</TableHead>
                                        <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Pending Issues</TableHead>
                                        <TableHead className="text-right px-6 font-bold text-slate-900 uppercase text-[10px] tracking-widest">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {councillorData.map((item) => (
                                        <TableRow key={item.ward} className="hover:bg-slate-50/50">
                                            <TableCell className="px-6 font-bold text-slate-700">{item.ward}</TableCell>
                                            <TableCell className="font-bold text-slate-900">{item.name}</TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant="secondary" 
                                                    className={cn(
                                                        "font-bold text-[10px] px-2 py-0.5 rounded-full border-none",
                                                        item.contact === "Available" ? "bg-emerald-100 text-emerald-700" : 
                                                        item.contact === "Busy" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                                                    )}
                                                >
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[80px]">
                                                        <div 
                                                            className="h-full bg-blue-500" 
                                                            style={{ width: `${Math.min(item.pending * 2, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700">{item.pending} Cases</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <Button variant="ghost" size="sm" className="text-blue-600 font-bold gap-2">
                                                    Details <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="p-6 border-t border-slate-100 text-center">
                                <Button className="bg-blue-600 hover:bg-blue-700 gap-2 w-full sm:w-auto">
                                    <UserPlus className="w-4 h-4" /> Manage All Councillors
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. BOOTH INTELLIGENCE (DEMOGRAPHICS ANALYTICS) */}
                <div className="space-y-6">
                    <SectionHeading icon={BarChart3}>Booth Intelligence (Demographic Analytics)</SectionHeading>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        {/* Gender Demographics */}
                        <Card className="border-slate-200 shadow-sm flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600 flex items-center justify-between">
                                    Gender Distribution
                                    <PieChartIcon className="w-4 h-4 text-slate-400" />
                                </CardTitle>
                                <CardDescription>Consolidated voter record breakdown.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center items-center h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={genderData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {genderData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Age Demographics */}
                        <Card className="border-slate-200 shadow-sm flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600">Age Bracket Audit</CardTitle>
                                <CardDescription>Demographic segmentation for youth policy targeting.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ageData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} />
                                        <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Caste Demographics */}
                        <Card className="border-slate-200 shadow-sm flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600">Social Category Distribution</CardTitle>
                                <CardDescription>Equitable resource distribution mapping.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center items-center h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={casteData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {casteData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Religion Demographics */}
                        <Card className="md:col-span-2 border-slate-200 shadow-sm flex flex-col">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600">Religious Demographics Audit</CardTitle>
                                    <CardDescription>Note: This data is utilized strictly for ensuring equitable resource distribution per ward guidelines.</CardDescription>
                                </div>
                                <Info className="w-5 h-5 text-slate-300" />
                            </CardHeader>
                            <CardContent className="flex-1 h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={religionData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" axisLine={false} tickLine={false} hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} width={100} />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} />
                                        <Bar dataKey="value" fill="#64748b" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Occupation Demographics */}
                        <Card className="border-slate-200 shadow-sm flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600">Employment Sector Analysis</CardTitle>
                                <CardDescription>Tracking economic activity centers across municipal zones.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 h-[320px] p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={occupationData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} interval={0} angle={-20} textAnchor="end" height={60} />
                                        <YAxis axisLine={false} tickLine={false} hide />
                                        <Tooltip />
                                        <Bar dataKey="size" fill="#334155" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8 flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <Info className="w-5 h-5 text-blue-500 shrink-0" />
                        <p className="text-xs text-blue-700 font-medium">
                            <span className="font-black uppercase tracking-wider mr-2">Official Protocol:</span> 
                            All demographic data is anonymized and utilized solely for infrastructure planning and service optimization in accordance with Municipal Data Sovereignty Laws.
                        </p>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="pt-12 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400">
                    <p className="text-xs font-bold uppercase tracking-widest">© 2026 Municipal Command Portal v4.2.0</p>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-xs font-bold gap-2">
                            Security Audit <ExternalLink className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs font-bold gap-2">
                            System Logs <ExternalLink className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

