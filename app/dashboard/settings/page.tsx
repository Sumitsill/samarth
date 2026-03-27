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
    User as UserIcon, 
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
    Info,
    CheckCircle2,
    Loader2,
    Lock,
    Eye,
    ChevronRight,
    Users as UsersIcon, 
    Flag, 
    Calendar,
    Edit3,
    X,
    BriefcaseBusiness,
    Globe
} from "lucide-react";
import { User } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
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

interface CouncillorSettings {
    ward: string;
    zone: string;
    autoAssignWorkers: boolean;
}

export default function SettingsPage() {
    const router = useRouter();
    const { user, role, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Profile State including new requested fields
    const [profile, setProfile] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        profile_pic: user?.profile_pic || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}`,
        age: user?.age ? user.age.toString() : "",
        gender: user?.gender || "",
        caste: user?.caste || "",
        religion: user?.religion || "",
        fathers_name: user?.fathers_name || "",
        // Look for new fields in top-level or within settings
        mothers_name: user?.mothers_name || (user?.settings as any)?.mothers_name || "", 
        occupation: user?.occupation || (user?.settings as any)?.occupation || "",     
        area: user?.area || "",
        constituency: user?.constituency || (user?.settings as any)?.constituency || ""  
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

    const [councillorSettings, setCouncillorSettings] = useState<CouncillorSettings>({
        ward: "Ward 74: Chandni Chowk",
        zone: "MCD Central Zone",
        autoAssignWorkers: true
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
            if (role === 'councillor') setCouncillorSettings(prev => ({ ...prev, ...(data.roleData || {}) }));
        }
    }, [user, role]);

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        
        try {
            const roleData = role === 'civilian' ? civilianSettings : role === 'contractor' ? contractorSettings : role === 'worker' ? workerSettings : role === 'councillor' ? councillorSettings : undefined;
            
            const updatedData = {
                name: profile.name,
                phone: profile.phone,
                profile_pic: profile.profile_pic,
                age: profile.age ? parseInt(profile.age, 10) : undefined,
                gender: (profile.gender || undefined) as User['gender'],
                caste: profile.caste,
                religion: profile.religion,
                fathers_name: profile.fathers_name,
                area: profile.area,
                settings: {
                    notifications,
                    privacy,
                    roleData,
                    // Store new fields in settings if columns are not yet added to DB
                    mothers_name: profile.mothers_name,
                    occupation: profile.occupation,
                    constituency: profile.constituency,
                }
            };
            
            await userService.updateProfile(user.id, updatedData as any);
            
            setUser({
                ...user,
                ...updatedData
            });

            setIsEditing(false); // Close edit mode on save
            setIsLoading(false);
            setSuccessMsg("Profile information updated successfully.");
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (error: any) {
            console.error("Save error:", error);
            setIsLoading(false);
        }
    };

    const maskPhone = (phone: string) => {
        if (!phone || phone.length < 4) return "Not Provided";
        return `******${phone.slice(-4)}`;
    };

    const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
        <div className="space-y-1 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
            {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
    );

    // Reusable row for displaying or editing data
    const FormRow = ({ label, icon: Icon, value, children, required = false }: any) => (
        <div className="flex flex-col sm:grid sm:grid-cols-12 gap-4 py-4 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
            <div className="sm:col-span-4 flex items-center gap-3">
                {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {label} {required && isEditing && <span className="text-red-500">*</span>}
                </Label>
            </div>
            <div className="sm:col-span-8 flex items-center">
                <div className="w-full max-w-md">
                    {isEditing ? (
                        children
                    ) : (
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {value || <span className="text-slate-400 italic">Not Provided</span>}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    const ControlCard = ({ children, className }: any) => (
        <Card className={cn("bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden", className)}>
            <CardContent className="p-6 sm:p-8">
                {children}
            </CardContent>
        </Card>
    );

    return (
        <form onSubmit={handleSave} className="max-w-6xl mx-auto space-y-8 pb-24 pt-8 px-4 sm:px-6 lg:px-8">
            {/* Success Toast */}
            <AnimatePresence>
                {successMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-24 left-1/2 z-[100] bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 font-medium"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{successMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Settings className="w-7 h-7 text-blue-600" />
                        Account Settings
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Manage your profile, preferences, and system notifications.
                    </p>
                </div>
                
                {isEditing && (
                    <div className="flex gap-3">
                        <Button 
                            type="button"
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                            className="rounded-lg"
                            disabled={isLoading}
                        >
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                        <Button 
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>

            <Tabs defaultValue="profile" className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-8 items-start">
                
                {/* Sidebar Navigation */}
                <div className="w-full space-y-6">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <TabsList className="flex flex-col w-full bg-transparent border-0 gap-1 p-2 h-auto">
                            <TabsTrigger value="profile" className="w-full justify-start h-11 px-4 rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400 transition-colors">
                                <UserIcon className="w-4 h-4 mr-3" /> Citizen Profile
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="w-full justify-start h-11 px-4 rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400 transition-colors">
                                <Bell className="w-4 h-4 mr-3" /> Communications
                            </TabsTrigger>
                            <TabsTrigger value="role" className="w-full justify-start h-11 px-4 rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400 transition-colors">
                                <Briefcase className="w-4 h-4 mr-3" /> Role Specifics
                            </TabsTrigger>
                            <TabsTrigger value="system" className="w-full justify-start h-11 px-4 rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400 transition-colors">
                                <Shield className="w-4 h-4 mr-3" /> Privacy & Security
                            </TabsTrigger>
                        </TabsList>
                    </Card>

                    {/* Simple Profile Summary Card */}
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm hidden lg:block">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden mb-4">
                                <img src={profile.profile_pic} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{profile.name || "Anonymous User"}</h3>
                            <Badge variant="secondary" className="mt-2 capitalize bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                                {role} Portal
                            </Badge>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="w-full">

                    {/* --- PROFILE TAB --- */}
                    <TabsContent value="profile" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <ControlCard>
                            <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Demographic Details</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your official information registered with the system.</p>
                                </div>
                                {!isEditing && (
                                    <Button type="button" onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2">
                                        <Edit3 className="w-4 h-4" /> Edit Details
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-1">
                                <FormRow label="Full Name" icon={UserIcon} value={profile.name} required>
                                    <Input value={profile.name} onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))} className="bg-slate-50 dark:bg-slate-900/50" />
                                </FormRow>

                                <FormRow label="Mobile Number" icon={Smartphone} value={isEditing ? profile.phone : maskPhone(profile.phone)} required>
                                    <Input value={profile.phone} onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))} placeholder="+91 00000 00000" className="bg-slate-50 dark:bg-slate-900/50" />
                                </FormRow>

                                <FormRow label="Father's Name" icon={UsersIcon} value={profile.fathers_name}>
                                    <Input value={profile.fathers_name} onChange={(e) => setProfile(prev => ({ ...prev, fathers_name: e.target.value }))} className="bg-slate-50 dark:bg-slate-900/50" />
                                </FormRow>

                                <FormRow label="Mother's Name" icon={UsersIcon} value={profile.mothers_name}>
                                    <Input value={profile.mothers_name} onChange={(e) => setProfile(prev => ({ ...prev, mothers_name: e.target.value }))} className="bg-slate-50 dark:bg-slate-900/50" />
                                </FormRow>

                                <FormRow label="Gender" icon={UserIcon} value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : ""}>
                                    <Select value={profile.gender} onValueChange={(val) => setProfile(prev => ({ ...prev, gender: val ?? "" }))}>
                                        <SelectTrigger className="bg-slate-50 dark:bg-slate-900/50">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="transgender">Transgender</SelectItem>
                                            <SelectItem value="other">Other / Prefer not to say</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormRow>

                                <FormRow label="Age" icon={Calendar} value={profile.age ? `${profile.age} Years` : ""}>
                                    <Input type="number" value={profile.age} onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))} className="bg-slate-50 dark:bg-slate-900/50" />
                                </FormRow>

                                <FormRow label="Religion" icon={Flag} value={profile.religion}>
                                    <Select value={profile.religion} onValueChange={(val) => setProfile(prev => ({ ...prev, religion: val ?? "" }))}>
                                        <SelectTrigger className="bg-slate-50 dark:bg-slate-900/50">
                                            <SelectValue placeholder="Select Religion (Optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hinduism">Hinduism</SelectItem>
                                            <SelectItem value="islam">Islam</SelectItem>
                                            <SelectItem value="christianity">Christianity</SelectItem>
                                            <SelectItem value="sikhism">Sikhism</SelectItem>
                                            <SelectItem value="buddhism">Buddhism</SelectItem>
                                            <SelectItem value="jainism">Jainism</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                            <SelectItem value="undisclosed">Prefer not to disclose</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormRow>

                                <FormRow label="Social Category (Caste)" icon={Shield} value={profile.caste}>
                                    <Select value={profile.caste} onValueChange={(val) => setProfile(prev => ({ ...prev, caste: val ?? "" }))}>
                                        <SelectTrigger className="bg-slate-50 dark:bg-slate-900/50">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General</SelectItem>
                                            <SelectItem value="obc">OBC</SelectItem>
                                            <SelectItem value="sc">SC</SelectItem>
                                            <SelectItem value="st">ST</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormRow>

                                <FormRow label="Occupation (Optional)" icon={BriefcaseBusiness} value={profile.occupation}>
                                    <Input value={profile.occupation} onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))} placeholder="E.g. Government Employee, Student, Business" className="bg-slate-50 dark:bg-slate-900/50" />
                                </FormRow>

                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                                    <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-4">Residential Information</h4>
                                    <div className="space-y-1">
                                        <FormRow label="Full Address" icon={MapPin} value={profile.area}>
                                            <Input value={profile.area} onChange={(e) => setProfile(prev => ({ ...prev, area: e.target.value }))} placeholder="House/Flat No., Street, City, Pincode" className="bg-slate-50 dark:bg-slate-900/50" />
                                        </FormRow>
                                        
                                        <FormRow label="Constituency" icon={Building} value={profile.constituency}>
                                            <Input value={profile.constituency} onChange={(e) => setProfile(prev => ({ ...prev, constituency: e.target.value }))} placeholder="E.g. New Delhi" className="bg-slate-50 dark:bg-slate-900/50" />
                                        </FormRow>
                                    </div>
                                </div>
                            </div>
                        </ControlCard>
                    </TabsContent>

                    {/* --- NOTIFICATIONS TAB --- */}
                    <TabsContent value="notifications" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <ControlCard>
                            <SectionHeader title="Communication Preferences" description="Manage how the portal communicates updates and alerts to you." />
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">SMS Alerts</Label>
                                        <p className="text-sm text-slate-500">Receive critical updates via direct SMS.</p>
                                    </div>
                                    <Switch 
                                        checked={notifications.app} 
                                        onCheckedChange={(val) => {
                                            if (isEditing) setNotifications(prev => ({...prev, app: val}));
                                        }} 
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">WhatsApp Services</Label>
                                        <p className="text-sm text-slate-500">Get scheme updates and document status on WhatsApp.</p>
                                    </div>
                                    <Switch 
                                        checked={notifications.whatsapp} 
                                        onCheckedChange={(val) => {
                                            if (isEditing) setNotifications(prev => ({...prev, whatsapp: val}));
                                        }} 
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Important Announcements Only</Label>
                                        <p className="text-sm text-slate-500">Mute general news and only receive urgent notifications.</p>
                                    </div>
                                    <Switch 
                                        checked={notifications.importantOnly} 
                                        onCheckedChange={(val) => {
                                            if (isEditing) setNotifications(prev => ({...prev, importantOnly: val}));
                                        }} 
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </ControlCard>
                    </TabsContent>

                    {/* --- ROLE TAB --- */}
                    <TabsContent value="role" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <ControlCard>
                            <SectionHeader title={`${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard Settings`} description="Configuration specific to your portal access level." />
                            
                            {role === 'civilian' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Interest Categories</Label>
                                        <p className="text-sm text-slate-500">Select topics you wish to see updates for on your dashboard.</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {["Water Supply", "Electricity", "Roads & Transport", "Waste Management", "Sanitation", "Healthcare", "Education"].map(cat => (
                                                <Badge 
                                                    key={cat}
                                                    variant={civilianSettings.preferredCategories.includes(cat) ? "default" : "outline"}
                                                    className={cn("cursor-pointer py-1.5 px-3", civilianSettings.preferredCategories.includes(cat) ? "bg-blue-600 hover:bg-blue-700" : "")}
                                                    onClick={() => {
                                                        if (!isEditing) return;
                                                        const current = civilianSettings.preferredCategories;
                                                        setCivilianSettings(prev => ({
                                                            ...prev,
                                                            preferredCategories: current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat]
                                                        }));
                                                    }}
                                                >
                                                    {cat}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {role === 'contractor' && (
                                <div className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label>Registered Agency / Company Name</Label>
                                        {isEditing ? (
                                            <Input 
                                                value={contractorSettings.companyName}
                                                onChange={(e) => setContractorSettings(prev => ({ ...prev, companyName: e.target.value }))}
                                                placeholder="Enter registered entity name"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{contractorSettings.companyName}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div className="space-y-0.5">
                                            <Label>Tender Broadcasts</Label>
                                            <p className="text-sm text-slate-500">Receive alerts for new tenders matching your profile.</p>
                                        </div>
                                        <Switch 
                                            checked={contractorSettings.tenderNotifications}
                                            onCheckedChange={(val) => {
                                                if (isEditing) setContractorSettings(prev => ({...prev, tenderNotifications: val}));
                                            }}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            )}

                            {role === 'worker' && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <Label className="text-slate-500 text-xs uppercase tracking-wider">Current Deployment</Label>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{workerSettings.assignedBooth}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div className="space-y-0.5">
                                            <Label>Activity Logging</Label>
                                            <p className="text-sm text-slate-500">Share anonymous task metrics with department heads.</p>
                                        </div>
                                        <Switch 
                                            checked={workerSettings.analyticsControl === "Full Access"}
                                            onCheckedChange={(val) => {
                                                if (isEditing) setWorkerSettings(prev => ({...prev, analyticsControl: val ? "Full Access" : "Restricted"}));
                                            }}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            )}

                            {role === 'councillor' && (
                                <div className="space-y-6">
                                    <FormRow label="Official Ward Assignment" icon={MapPin} value={councillorSettings.ward}>
                                        <Input 
                                            value={councillorSettings.ward}
                                            onChange={(e) => setCouncillorSettings(prev => ({ ...prev, ward: e.target.value }))}
                                            placeholder="E.g. Ward 74: Chandni Chowk"
                                        />
                                    </FormRow>
                                    <FormRow label="Administrative Zone" icon={Building} value={councillorSettings.zone}>
                                        <Input 
                                            value={councillorSettings.zone}
                                            onChange={(e) => setCouncillorSettings(prev => ({ ...prev, zone: e.target.value }))}
                                            placeholder="E.g. MCD Central Zone"
                                        />
                                    </FormRow>
                                    <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-slate-400" />
                                            <div className="space-y-0.5">
                                                <Label>Auto-Dispatch Protocol</Label>
                                                <p className="text-sm text-slate-500">Automatically assign critical complaints to idle workers.</p>
                                            </div>
                                        </div>
                                        <Switch 
                                            checked={councillorSettings.autoAssignWorkers}
                                            onCheckedChange={(val) => {
                                                if (isEditing) setCouncillorSettings(prev => ({...prev, autoAssignWorkers: val}));
                                            }}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            )}
                        </ControlCard>
                    </TabsContent>

                    {/* --- SYSTEM TAB --- */}
                    <TabsContent value="system" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <ControlCard>
                            <SectionHeader title="Privacy & Security" description="Manage your data sharing and security settings." />
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Public Directory</Label>
                                        <p className="text-sm text-slate-500">Allow your basic profile to be visible in the citizen directory.</p>
                                    </div>
                                    <Switch 
                                        checked={privacy.showProfile}
                                        onCheckedChange={(val) => {
                                            if (isEditing) setPrivacy(prev => ({...prev, showProfile: val}));
                                        }}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Data Sharing for Schemes</Label>
                                        <p className="text-sm text-slate-500">Automatically pre-fill forms for applicable government schemes.</p>
                                    </div>
                                    <Switch 
                                        checked={privacy.dataSharing}
                                        onCheckedChange={(val) => {
                                            if (isEditing) setPrivacy(prev => ({...prev, dataSharing: val}));
                                        }}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </ControlCard>
                    </TabsContent>

                </div>
            </Tabs>
        </form>
    );
}
