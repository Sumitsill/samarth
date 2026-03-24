"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { userService } from "@/services/userService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    User, 
    Bell, 
    Shield, 
    Settings, 
    Camera, 
    Save, 
    Smartphone, 
    MessageSquare, 
    AlertCircle, 
    MapPin, 
    Briefcase, 
    Building, 
    LayoutDashboard, 
    Info,
    RotateCcw,
    CheckCircle2,
    Loader2,
    Palette,
    Globe,
    Lock,
    Eye,
    ChevronRight,
    ArrowRight,
    Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GradientText from "@/components/GradientText";
import Prism from "@/components/Prism";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CivilianSettings {
    defaultLocation: string;
    preferredCategories: string[];
    schemePreferences: string[];
}

interface ContractorSettings {
    companyName: string;
    activeProjects: string[];
    tenderNotifications: boolean;
}

interface WorkerSettings {
    assignedBooth: string;
    workerPreferences: string[];
    analyticsControl: string;
}

export default function SettingsPage() {
    const router = useRouter();
    const { user, role, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Profile State
    const [profile, setProfile] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        profile_pic: user?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Samarth"}`
    });

    // Notification State
    const [notifications, setNotifications] = useState({
        app: true,
        whatsapp: false,
        importantOnly: true
    });

    // Privacy State
    const [privacy, setPrivacy] = useState({
        showProfile: true,
        dataSharing: false
    });

    // Role Specific States
    const [civilianSettings, setCivilianSettings] = useState<CivilianSettings>({
        defaultLocation: "Central Delhi",
        preferredCategories: ["Water", "Roads"],
        schemePreferences: ["Women Health", "Skill India"]
    });

    const [contractorSettings, setContractorSettings] = useState<ContractorSettings>({
        companyName: "Indus Infrastructure",
        activeProjects: ["Adarsh Nagar Renovation", "Ring Road Maintenance"],
        tenderNotifications: true
    });

    const [workerSettings, setWorkerSettings] = useState<WorkerSettings>({
        assignedBooth: "Booth 122 - Rohini Sector 16",
        workerPreferences: ["Door-to-Door", "Camps"],
        analyticsControl: "Full Access"
    });

    // Load persisted settings
    useEffect(() => {
        if (user?.settings) {
            const data = user.settings;
            setNotifications(data.notifications || notifications);
            setPrivacy(data.privacy || privacy);
            if (role === 'civilian') setCivilianSettings(prev => ({ ...prev, ...(data.roleData || {}) }));
            if (role === 'contractor') setContractorSettings(prev => ({ ...prev, ...(data.roleData || {}) }));
            if (role === 'worker') setWorkerSettings(prev => ({ ...prev, ...(data.roleData || {}) }));
        }
    }, [user, role]);

    const handleSave = async () => {
        if (!user) return;
        setIsLoading(true);
        
        try {
            const roleData = role === 'civilian' ? civilianSettings : role === 'contractor' ? contractorSettings : workerSettings;
            
            const updatedData = {
                name: profile.name,
                phone: profile.phone,
                profile_pic: profile.profile_pic,
                settings: {
                    notifications,
                    privacy,
                    roleData
                }
            };
            
            await userService.updateProfile(user.id, updatedData);
            
            // Update local store as well
            setUser({
                ...user,
                ...updatedData
            });

            setIsLoading(false);
            setSuccessMsg("System configuration updated successfully.");
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (error: any) {
            console.error("Save error:", error);
            setIsLoading(false);
        }
    };

    const resetTutorial = () => {
        localStorage.removeItem(`dashboard_tutorial_completed_${role}`);
        sessionStorage.removeItem(`dashboard_tutorial_prompted_${role}`);
        setSuccessMsg("Tutorial re-initialized! Restart session to begin.");
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
        <div className="space-y-1 mb-6">
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            {description && <p className="text-sm text-slate-400 font-medium">{description}</p>}
        </div>
    );

    const FormRow = ({ label, description, children, icon: Icon }: any) => (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 py-10 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.012] transition-all duration-300 -mx-8 px-8 rounded-[24px] group/row relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/[0.015] transition-colors" />
            <div className="lg:col-span-5 space-y-3 relative z-10">
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className="p-3 bg-slate-800/80 rounded-2xl border border-white/10 group-hover:border-indigo-500/30 group-hover:bg-slate-800 transition-all shadow-xl group-hover:shadow-indigo-500/10">
                            <Icon className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                        </div>
                    )}
                    <Label className="text-lg font-black text-white tracking-tight">{label}</Label>
                </div>
                {description && <p className="text-[13px] text-slate-400 font-medium leading-relaxed lg:pr-10">{description}</p>}
            </div>
            <div className="lg:col-span-7 flex items-center relative z-10">
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );

    const ControlCard = ({ children, className }: any) => (
        <Card className={cn("bg-slate-900/40 backdrop-blur-2xl border-white/5 rounded-[32px] overflow-hidden shadow-[0_24px_100px_rgba(0,0,0,0.4)] border-t-white/10 relative", className)}>
            <CardContent className="p-8 lg:p-10">
                {children}
            </CardContent>
        </Card>
    );

    const CategoryChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
        <button 
            onClick={onClick}
            className={cn(
                "px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-between group h-full",
                active 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/50" 
                    : "bg-slate-800/50 text-slate-400 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-800"
            )}
        >
            <span className="tracking-tight">{label}</span>
            <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                active ? "bg-white/20 scale-110" : "bg-white/5 group-hover:bg-white/10"
            )}>
                {active && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 pt-8 px-4 md:px-8">
            <AnimatePresence>
                {successMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-28 left-1/2 z-[100] bg-indigo-600 text-white px-10 py-5 rounded-[32px] shadow-[0_40px_80px_rgba(79,70,229,0.4)] flex items-center gap-4 font-black border border-indigo-400/50 backdrop-blur-3xl"
                    >
                        <div className="bg-white/20 p-2 rounded-full shadow-inner">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="tracking-tight">{successMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10 contrast-150 grayscale">
                 <Prism hueShift={260} animationType="3drotate" scale={2.5} glow={0.5} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-5 tracking-tighter">
                        <div className="p-4 bg-indigo-600 text-white rounded-[24px] shadow-2xl shadow-indigo-600/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500 border border-indigo-400/30">
                            <Settings className="w-8 h-8" />
                        </div>
                        <GradientText colors={['#ffffff', '#818cf8', '#ffffff']} className="ml-0">Settings</GradientText>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium max-w-lg leading-relaxed md:ml-2">
                        Configure node preferences and system behavior.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <Button 
                        onClick={handleSave} 
                        className="h-14 px-10 bg-indigo-600 hover:bg-indigo-500 rounded-[20px] shadow-2xl shadow-indigo-600/20 text-md font-bold transition-all group active:scale-95 border-t border-white/20"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="profile" orientation="vertical" className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-16 items-start">
                <div className="w-full space-y-8 flex flex-col group/nav">
                    <div className="p-1.5 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[32px] shadow-2xl overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                        <TabsList className="flex flex-col w-full bg-transparent border-0 gap-1 p-0 h-auto">
                            <TabsTrigger value="profile" className="rounded-[20px] h-16 font-black text-sm px-6 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all flex items-center justify-start gap-4 hover:bg-white/5 group relative overflow-hidden">
                                <User className="w-5 h-5 shrink-0" /> <span className="tracking-tight">Personal Identity</span>
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="rounded-[20px] h-16 font-black text-sm px-6 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all flex items-center justify-start gap-4 hover:bg-white/5 group relative overflow-hidden">
                                <Bell className="w-5 h-5 shrink-0" /> <span className="tracking-tight">Signal Matrix</span>
                            </TabsTrigger>
                            <TabsTrigger value="role" className="rounded-[20px] h-16 font-black text-sm px-6 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all flex items-center justify-start gap-4 hover:bg-white/5 group relative overflow-hidden">
                                <Briefcase className="w-5 h-5 shrink-0" /> <span className="tracking-tight">Professional Proof</span>
                            </TabsTrigger>
                            <TabsTrigger value="system" className="rounded-[20px] h-16 font-black text-sm px-6 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all flex items-center justify-start gap-4 hover:bg-white/5 group relative overflow-hidden">
                                <LayoutDashboard className="w-5 h-5 shrink-0" /> <span className="tracking-tight">Root Node Opts</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-8 rounded-[32px] bg-slate-900/40 border border-white/5 hidden lg:block overflow-hidden relative group/health shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] group-hover/health:bg-indigo-500/20 transition-all duration-700" />
                        <h4 className="font-black text-[10px] text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                           <div className="size-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" /> Node Health Pulse
                        </h4>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                                    <span className="text-slate-500">Node Sync</span>
                                    <span className="text-white">94.2%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                                    <div className="h-full w-[94.2%] bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)] transition-all duration-1000" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                                    <span className="text-slate-500">Latency</span>
                                    <span className="text-emerald-400">12ms</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                                    <div className="h-full w-[15%] bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full">

                {/* Profile Content */}
                <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-4 h-full">
                            <ControlCard className="h-full bg-gradient-to-b from-slate-900/60 to-slate-900/40">
                                <div className="flex flex-col items-center text-center space-y-10">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 opacity-50" />
                                        <div className="w-48 h-48 rounded-[48px] bg-slate-800 border-4 border-white/5 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-500/50 shadow-2xl relative z-10 group-hover:-translate-y-2 group-hover:rotate-1">
                                            <img src={profile.profile_pic} alt="Avatar" className="w-full h-full object-cover p-2" />
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 z-20 bg-indigo-600 text-white p-4 rounded-[20px] shadow-2xl hover:scale-110 active:scale-95 transition-all border border-indigo-400/50 group-hover:rotate-6">
                                            <Camera className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-white tracking-tighter">{profile.name || "Anonymous User"}</h3>
                                        <div className="flex items-center justify-center gap-2">
                                            <Badge variant="outline" className="rounded-full bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 font-bold text-[10px] uppercase tracking-wider">{role} Node</Badge>
                                            <span className="text-slate-500 text-xs font-mono">ID: {user?.id.slice(0, 8)}</span>
                                        </div>
                                    </div>
                                    <Separator className="bg-white/5" />
                                    <p className="text-slate-500 text-[13px] font-medium leading-relaxed max-w-[240px]">
                                        Your avatar is unique to your blockchain node signature.
                                    </p>
                                </div>
                            </ControlCard>
                        </div>

                        <div className="lg:col-span-8">
                            <ControlCard>
                                <SectionHeader title="Public Profile" description="Manage your identity across the platform." />
                                <div className="space-y-2">
                                    <FormRow label="Full Name" description="Used for project coordination and legal signatures." icon={User}>
                                        <Input 
                                            value={profile.name}
                                            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                            className="h-14 bg-white/5 border-white/5 rounded-xl focus-visible:ring-indigo-500 focus-visible:bg-white/10 font-bold px-6 text-md transition-all placeholder:text-slate-600" 
                                            placeholder="Enter your full name"
                                        />
                                    </FormRow>
                                    <FormRow label="Contact Phone" description="Verified number for decentralized two-factor authentication." icon={Smartphone}>
                                        <Input 
                                            value={profile.phone}
                                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                            className="h-14 bg-white/5 border-white/5 rounded-xl focus-visible:ring-indigo-500 focus-visible:bg-white/10 font-bold px-6 text-md transition-all placeholder:text-slate-600" 
                                            placeholder="+91 00000 00000"
                                        />
                                    </FormRow>
                                </div>
                                <div className="mt-10 p-6 rounded-[24px] bg-indigo-600/5 border border-indigo-600/10 flex items-start gap-5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-[0.03] blur-2xl group-hover:opacity-[0.05] transition-opacity" />
                                    <div className="w-12 h-12 rounded-[14px] bg-indigo-600/20 flex items-center justify-center shrink-0 border border-indigo-500/20">
                                        <Shield className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-indigo-100 text-[15px]">Security Compliance</p>
                                        <p className="text-slate-400 text-[13px] font-medium leading-relaxed">Identity updates are validated against our proof-of-humanity network. Some changes may require re-verification.</p>
                                    </div>
                                </div>
                            </ControlCard>
                        </div>
                    </div>
                </TabsContent>

                {/* Notifications Content */}
                <TabsContent value="notifications" className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <ControlCard>
                        <SectionHeader title="Notification Matrix" description="Signal configuration for infrastructure updates." />
                        <div className="space-y-2">
                            <FormRow label="Push Notifications" description="Real-time browser hooks for status transitions." icon={Smartphone}>
                                <div className="flex items-center gap-4 ml-auto lg:ml-0">
                                    <Switch 
                                        checked={notifications.app} 
                                        onCheckedChange={(val: boolean) => setNotifications(prev => ({...prev, app: val}))} 
                                        className="data-[state=checked]:bg-indigo-500"
                                    />
                                    <span className={cn("text-xs font-bold transition-colors lg:hidden", notifications.app ? "text-indigo-400" : "text-slate-600")}>{notifications.app ? "On" : "Off"}</span>
                                </div>
                            </FormRow>
                            <FormRow label="WhatsApp Integration" description="Decentralized alerts for scheme approvals and node updates." icon={MessageSquare}>
                                <div className="flex items-center gap-4 ml-auto lg:ml-0">
                                    <Switch 
                                        checked={notifications.whatsapp} 
                                        onCheckedChange={(val: boolean) => setNotifications(prev => ({...prev, whatsapp: val}))} 
                                        className="data-[state=checked]:bg-indigo-500"
                                    />
                                    <span className={cn("text-xs font-bold transition-colors lg:hidden", notifications.whatsapp ? "text-indigo-400" : "text-slate-600")}>{notifications.whatsapp ? "On" : "Off"}</span>
                                </div>
                            </FormRow>
                            <FormRow label="Priority Filter" description="Suppress secondary signals; only show critical node alerts." icon={AlertCircle}>
                                <div className="flex items-center gap-4 ml-auto lg:ml-0">
                                    <Switch 
                                        checked={notifications.importantOnly} 
                                        onCheckedChange={(val: boolean) => setNotifications(prev => ({...prev, importantOnly: val}))} 
                                        className="data-[state=checked]:bg-indigo-500"
                                    />
                                    <span className={cn("text-xs font-bold transition-colors lg:hidden", notifications.importantOnly ? "text-indigo-400" : "text-slate-600")}>{notifications.importantOnly ? "On" : "Off"}</span>
                                </div>
                            </FormRow>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/[0.03] flex justify-center">
                            <Badge variant="outline" className="rounded-full bg-slate-800/80 text-slate-500 border-white/5 px-6 py-2 text-[11px] font-bold uppercase tracking-[0.1em]">Advanced hooks arriving in Phase 3</Badge>
                        </div>
                    </ControlCard>
                </TabsContent>

                {/* Professional Content */}
                <TabsContent value="role" className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <ControlCard>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-black text-white tracking-tight">Professional Credentials</h3>
                                    <Badge className="rounded-xl px-4 py-1.5 bg-indigo-600 text-white font-black uppercase shadow-lg shadow-indigo-600/20 tracking-widest text-[10px]">{role}</Badge>
                                </div>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">Verified configuration for your infrastructure role.</p>
                            </div>
                        </div>

                        {role === 'civilian' && (
                            <div className="space-y-12">
                                <div className="p-8 rounded-[32px] bg-slate-900/60 border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-[0.02] blur-[80px] group-hover:opacity-[0.04] transition-all" />
                                    <SectionHeader title="Constituency Selection" description="Select your primary jurisdiction for project alerts." />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin className="w-4 h-4 text-indigo-400" />
                                                <span className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.2em]">Root Node Location</span>
                                            </div>
                                            <Select 
                                                value={civilianSettings.defaultLocation}
                                                onValueChange={(val) => setCivilianSettings(prev => ({ ...prev, defaultLocation: val || prev.defaultLocation }))}
                                            >
                                                <SelectTrigger className="h-16 bg-slate-800/50 border-white/5 rounded-2xl font-bold text-lg px-8 transition-all hover:bg-slate-800 hover:border-indigo-500/30">
                                                    <SelectValue placeholder="Locate Node" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-3xl">
                                                    {["Central Delhi", "North West Delhi", "South Delhi", "East Delhi"].map(loc => (
                                                        <SelectItem key={loc} value={loc} className="rounded-xl font-bold py-4 px-4 m-1 transition-all focus:bg-indigo-600 focus:text-white cursor-pointer">{loc} Node</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[11px] text-slate-500 font-medium pl-2 italic">Constituency changes are logged for network stability.</p>
                                        </div>
                                        <div className="hidden md:flex justify-center flex-col items-center">
                                            <div className="w-24 h-24 rounded-full bg-indigo-500/5 flex items-center justify-center border border-indigo-500/10">
                                                <Globe className="w-10 h-10 text-indigo-600/30 animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    <SectionHeader title="Priority Signal Vectors" description="Tailor your feed based on infrastructure categories." />
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {["Water", "Electricity", "Roads", "Waste", "Sanitation", "Lighting", "Health", "Education"].map(cat => (
                                            <CategoryChip 
                                                key={cat}
                                                label={cat}
                                                active={civilianSettings.preferredCategories.includes(cat)}
                                                onClick={() => {
                                                    const current = civilianSettings.preferredCategories;
                                                    const val = !current.includes(cat);
                                                    setCivilianSettings(prev => ({
                                                        ...prev,
                                                        preferredCategories: val ? [...current, cat] : current.filter(c => c !== cat)
                                                    }));
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === 'contractor' && (
                            <div className="space-y-8">
                                <FormRow label="Enterprise Entity" description="Your registered company name for infrastructure tenders." icon={Building}>
                                    <Input 
                                        value={contractorSettings.companyName}
                                        onChange={(e) => setContractorSettings(prev => ({ ...prev, companyName: e.target.value }))}
                                        className="h-16 bg-white/5 border-white/5 rounded-2xl font-bold px-8 text-lg hover:border-indigo-500/30 transition-all" 
                                        placeholder="Enter company name"
                                    />
                                </FormRow>
                                <FormRow label="Opportunity Radar" description="Broadcasts for infrastructure tenders in your sector." icon={Globe}>
                                    <Switch 
                                        checked={contractorSettings.tenderNotifications}
                                        onCheckedChange={(val: boolean) => setContractorSettings(prev => ({...prev, tenderNotifications: val}))}
                                        className="data-[state=checked]:bg-indigo-500"
                                    />
                                </FormRow>
                                <div className="p-8 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-[32px] space-y-6 relative overflow-hidden">
                                    <Label className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.3em] block">Active Projects</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {contractorSettings.activeProjects.map((proj, i) => (
                                            <div key={i} className="flex items-center justify-between p-5 bg-slate-800/40 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all hover:-translate-y-1">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center font-black text-indigo-400 border border-indigo-500/10 transition-colors group-hover:bg-indigo-500/20 group-hover:text-indigo-300">0{i+1}</div>
                                                    <span className="text-slate-200 font-bold tracking-tight">{proj}</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === 'worker' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-12">
                                    <div className="p-10 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between min-h-[240px] shadow-2xl shadow-indigo-600/20 relative overflow-hidden group border border-white/10">
                                        <div className="absolute top-0 right-0 w-[40%] h-[400px] bg-white opacity-[0.08] blur-[100px] -rotate-45 pointer-events-none group-hover:opacity-[0.12] transition-all duration-700" />
                                        <div className="space-y-6 relative z-10">
                                            <div className="flex gap-6 items-center">
                                                <div className="w-20 h-20 bg-white/10 backdrop-blur-2xl rounded-[28px] flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
                                                    <Building className="w-10 h-10 text-white" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[12px] font-black text-white/50 uppercase tracking-[0.2em]">Deployment Zone</p>
                                                    <p className="text-3xl md:text-4xl font-black text-white tracking-tighter">{workerSettings.assignedBooth}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <p className="text-[13px] text-white/70 font-medium max-w-[280px]">Assigned Node ID: <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded-md ml-1">{user?.id.slice(0, 12).toUpperCase()}</span></p>
                                            </div>
                                        </div>
                                        <Button className="mt-8 md:mt-0 h-16 bg-white text-indigo-600 font-black rounded-2xl hover:bg-slate-50 transition-all px-10 group relative z-10 shadow-xl self-start md:self-center">
                                            Request Relocation <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="lg:col-span-12 mt-4">
                                     <SectionHeader title="Protocol Preferences" description="Configure telemetry and visibility for node activity." />
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormRow label="Telemetry Stream" description="Enable automated activity logging to zone hierarchy." icon={Lock}>
                                            <Switch checked={true} className="data-[state=checked]:bg-indigo-500" />
                                        </FormRow>
                                        <FormRow label="Analytics Shield" description="Minimize your presence in global dashboard metrics." icon={Eye}>
                                            <Switch checked={workerSettings.analyticsControl === "Full Access"} className="data-[state=checked]:bg-indigo-500" />
                                        </FormRow>
                                     </div>
                                </div>
                            </div>
                        )}
                    </ControlCard>
                </TabsContent>

                {/* System Content */}
                <TabsContent value="system" className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <ControlCard>
                        <SectionHeader title="Platform Governance" description="System calibration and visibility footprint." />
                        <div className="space-y-2">
                            <FormRow label="Global Node Discovery" description="Allow verified platform users to identify your node profile in the mesh." icon={Shield}>
                                <Switch 
                                    checked={privacy.showProfile}
                                    onCheckedChange={(val: boolean) => setPrivacy(prev => ({...prev, showProfile: val}))}
                                    className="data-[state=checked]:bg-indigo-500"
                                />
                            </FormRow>
                            <FormRow label="Enhanced SFX" description="High-fidelity lighting, micro-animations, and glassmorphism levels." icon={Palette}>
                                <Switch 
                                    checked={privacy.dataSharing}
                                    onCheckedChange={(val: boolean) => setPrivacy(prev => ({...prev, dataSharing: val}))}
                                    className="data-[state=checked]:bg-indigo-500"
                                />
                            </FormRow>
                        </div>

                        <div className="mt-16 p-10 bg-rose-500/[0.02] border border-rose-500/10 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500 opacity-0 group-hover:opacity-[0.03] blur-[80px] transition-opacity" />
                            <div className="space-y-3 relative z-10">
                                <h4 className="font-bold text-rose-500 text-2xl tracking-tight flex items-center gap-4">
                                    <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20 group-hover:rotate-12 transition-transform shadow-sm">
                                        <RotateCcw className="w-6 h-6" />
                                    </div>
                                    Onboarding Reset
                                </h4>
                                <p className="text-slate-500 font-medium max-w-md leading-relaxed">Restart the system walkthrough to familiarize yourself with new protocols.</p>
                            </div>
                            <Button 
                                onClick={resetTutorial}
                                variant="outline"
                                className="border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white font-bold rounded-2xl h-14 px-10 transition-all w-full md:w-auto relative z-10"
                            >
                                Re-initialize Tour
                            </Button>
                        </div>
                    </ControlCard>
                </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
