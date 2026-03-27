"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Loader2,
    Phone,
    User as UserIcon,
    Calendar,
    Users,
    MapPin,
    Building,
    Flag,
    ArrowRight,
    ArrowLeft,
    ShieldAlert,
    Fingerprint,
    Quote,
    Check,
    Globe,
    Lock,
    Sun,
    Moon,
    Languages
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.string().min(1, "Age is required"),
    gender: z.enum(["male", "female", "other"]),
    caste: z.string().min(2, "Caste is required"),
    religion: z.string().min(2, "Religion is required"),
    fathers_name: z.string().min(2, "Father's name is required"),
    area: z.string().min(2, "Area is required"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type Theme = 'dark' | 'light';
type Lang = 'en' | 'hi';

const dict = {
    en: {
        title: "SAMARTH ID",
        protocol: "Protocol v4.0",
        onboarding: "Identity Onboarding.",
        onboardingDesc: "Complete these 4 protocols to unlock your dashboard access.",
        quote: "Transparency is the baseline for national trust.",
        quoteAuthor: "Aatmanirbhar Identity",

        step1: "Personal Profile.",
        step1Desc: "Please verify your primary credentials.",
        fullName: "Full Legal Name",
        age: "Age",
        gender: "Gender",
        male: "Male", female: "Female", other: "Other",

        step2: "Social Context.",
        step2Desc: "Defining demographic identity for specialized services.",
        caste: "Social Category",
        religion: "Religion",
        guardian: "Guardian Name",

        step3: "Location & Contact.",
        step3Desc: "Securing communication and localization.",
        area: "Area Residency",
        contact: "Contact Number",

        step4: "Verification Key.",
        step4Desc: "Sent to",
        enterKey: "Enter 6-Digit Simulated Key",

        prev: "Prev",
        next1: "Continue",
        next2: "Complete Protocol",
        verify: "Verify Identity",

        integrity: "Identity Integrity Verified",
        encryption: "256-bit encryption active",

        stepsArr: [
            { id: 1, title: "Personal", info: "Legal Name & Age", icon: UserIcon },
            { id: 2, title: "Background", info: "Social Context", icon: Fingerprint },
            { id: 3, title: "Residency", info: "Location & Contact", icon: MapPin },
            { id: 4, title: "Security", info: "OTP Verification", icon: ShieldAlert },
        ]
    },
    hi: {
        title: "समर्थ आईडी",
        protocol: "प्रोटोकॉल v4.0",
        onboarding: "पहचान ऑनबोर्डिंग।",
        onboardingDesc: "डैशबोर्ड तक पहुंचने के लिए इन 4 प्रोटोकॉल को पूरा करें।",
        quote: "पारदर्शिता राष्ट्रीय विश्वास का आधार है।",
        quoteAuthor: "आत्मनिर्भर पहचान",

        step1: "व्यक्तिगत प्रोफ़ाइल।",
        step1Desc: "कृपया अपने प्राथमिक क्रेडेंशियल्स सत्यापित करें।",
        fullName: "पूरा कानूनी नाम",
        age: "आयु",
        gender: "लिंग",
        male: "पुरुष", female: "महिला", other: "अन्य",

        step2: "सामाजिक संदर्भ।",
        step2Desc: "विशेष सेवाओं के लिए जनसांख्यिकीय पहचान।",
        caste: "सामाजिक श्रेणी",
        religion: "धर्म",
        guardian: "अभिभावक का नाम",

        step3: "स्थान और संपर्क।",
        step3Desc: "संचार और स्थानीयकरण सुरक्षित करना।",
        area: "निवास क्षेत्र",
        contact: "संपर्क नंबर",

        step4: "सत्यापन कुंजी।",
        step4Desc: "भेजा गया",
        enterKey: "6-अंकीय कुंजी दर्ज करें",

        prev: "पिछला",
        next1: "जारी रखें",
        next2: "प्रोटोकॉल पूरा करें",
        verify: "पहचान सत्यापित करें",

        integrity: "पहचान अखंडता सत्यापित",
        encryption: "256-बिट एन्क्रिप्शन सक्रिय",

        stepsArr: [
            { id: 1, title: "व्यक्तिगत", info: "कानूनी नाम और आयु", icon: UserIcon },
            { id: 2, title: "पृष्ठभूमि", info: "सामाजिक संदर्भ", icon: Fingerprint },
            { id: 3, title: "निवास", info: "स्थान और संपर्क", icon: MapPin },
            { id: 4, title: "सुरक्षा", info: "OTP सत्यापन", icon: ShieldAlert },
        ]
    }
};

export default function ProfileCompletionModal() {
    const { user, setUser } = useAuthStore();
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [sentCode, setSentCode] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('dark');
    const [lang, setLang] = useState<Lang>('en');

    useEffect(() => {
        if (user && !user.isProfileComplete) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            document.body.style.overflow = 'auto';
        }
    }, [user]);

    const getSavedDraft = () => {
        if (typeof window !== "undefined" && user) {
            const draft = localStorage.getItem(`profile_draft_${user.id}`);
            if (draft) {
                try {
                    return JSON.parse(draft);
                } catch (e) { }
            }
        }
        return null;
    };

    const savedDraft = getSavedDraft();

    const { register, handleSubmit, formState: { errors }, watch, setValue, trigger, reset } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: savedDraft?.name || user?.name || "",
            age: savedDraft?.age || "",
            gender: savedDraft?.gender || undefined,
            caste: savedDraft?.caste || "",
            religion: savedDraft?.religion || "",
            fathers_name: savedDraft?.fathers_name || "",
            area: savedDraft?.area || "",
            phone: savedDraft?.phone || user?.phone || "",
        }
    });

    // Save partial progress into a JSON string locally
    useEffect(() => {
        const subscription = watch((value) => {
            if (user && !user.isProfileComplete) {
                localStorage.setItem(`profile_draft_${user.id}`, JSON.stringify(value));
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, user]);

    const nextStep = async () => {
        let fields: (keyof ProfileFormValues)[] = [];
        if (step === 1) fields = ["name", "age", "gender"];
        if (step === 2) fields = ["caste", "religion", "fathers_name"];
        if (step === 3) fields = ["area", "phone"];

        const isValid = await trigger(fields);
        if (isValid) {
            if (step === 3) startVerification();
            else setStep(step + 1);
        }
    };

    const prevStep = () => setStep(step - 1);

    const startVerification = async () => {
        setStep(4);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setSentCode(code);
        console.log("SIMULATED OTP:", code);
        alert(`SIMULATED OTP: ${code}`);
    };

    const verifyAndSave = async () => {
        if (verificationCode !== sentCode) {
            alert(lang === 'en' ? "Invalid verification code. Check console for OTP." : "अमान्य सत्यापन कोड।");
            return;
        }

        setIsLoading(true);
        try {
            const formData = watch();

            const supabasePayload = {
                full_name: formData.name,
                age: parseInt(formData.age, 10),
                gender: formData.gender,
                caste: formData.caste,
                religion: formData.religion,
                fathers_name: formData.fathers_name,
                area: formData.area,
                phone: formData.phone,
                profile_completed: true
            };

            /*const { error: supabaseError } = await supabase
                    .from('profiles')
                    .upsert(supabasePayload)
                    .eq('id', user!.id);
    
                if (supabaseError) throw supabaseError;*/

            const { data, error } = await supabase
                .from('profiles')
                .upsert({
                    id: user!.id,
                    role: "civilian",
                    full_name: formData.name,
                    age: parseInt(formData.age, 10),
                    gender: formData.gender,
                    caste: formData.caste,
                    religion: formData.religion,
                    fathers_name: formData.fathers_name,
                    area: formData.area,
                    phone: formData.phone,
                    profile_completed: true
                })
                .select();

            console.log(data, error);

            if (error) throw error;

            setUser({
                ...user!,
                ...formData,
                age: parseInt(formData.age, 10),
                isProfileComplete: true
            });

            // Persist the completion state locally as a final fallback
            // This is the true lock (istrue equivalent) preventing it from opening again
            if (typeof window !== "undefined") {
                localStorage.setItem(`profile_completed_${user!.id}`, 'true');
                localStorage.removeItem(`profile_draft_${user!.id}`); // Clean up JSON draft
            }

            setIsVisible(false);
        } catch (error) {
            console.error(error);
            alert(lang === 'en' ? "Failed to update profile." : "प्रोफ़ाइल अपडेट करने में विफल।");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isVisible || !user) return null;

    const t = dict[lang];

    // Theme Variables mapped to Tailwind Classes for readability
    const isDark = theme === 'dark';
    const bgApp = isDark ? "bg-slate-950" : "bg-slate-50";
    const bgSidebar = isDark ? "bg-slate-900/30" : "bg-white/80";
    const bgCard = isDark ? "bg-slate-900 border-white/5" : "bg-white border-slate-200 shadow-sm";
    const textMain = isDark ? "text-white" : "text-slate-900";
    const textMuted = isDark ? "text-slate-400" : "text-slate-500";
    const textGhost = isDark ? "text-slate-600" : "text-slate-400";
    const borderApp = isDark ? "border-white/5" : "border-slate-200";
    const stepperActiveBg = isDark ? "bg-indigo-400 border-indigo-400" : "bg-indigo-600 border-indigo-600";
    const stepperDoneBg = isDark ? "bg-emerald-500 border-emerald-500 text-white" : "bg-emerald-500 border-emerald-500 text-white";
    const stepperIdleBg = isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300";
    const lineBg = isDark ? "bg-slate-800" : "bg-slate-200";
    const selectContentBg = isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn("fixed inset-0 z-[100] flex flex-col md:flex-row overflow-hidden font-sans transition-colors duration-500", bgApp)}
        >
            {/* Top Right Controls (Theme & Lang) */}
            <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                    className={cn("rounded-full border transition-all", isDark ? "bg-slate-900/50 border-white/10 text-white hover:bg-slate-800" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600")}
                    title="Toggle Language"
                >
                    <Languages className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className={cn("rounded-full border transition-all", isDark ? "bg-slate-900/50 border-white/10 text-yellow-400 hover:bg-slate-800" : "bg-white border-slate-200 text-indigo-600 hover:bg-slate-100")}
                    title="Toggle Theme"
                >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
            </div>

            {/* Ambient Background Decor */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={cn("absolute top-[-5%] left-[-5%] w-[40%] h-[40%] blur-[120px] rounded-full", isDark ? "bg-indigo-500/10" : "bg-indigo-500/5")} />
                <div className={cn("absolute bottom-[5%] right-[5%] w-[35%] h-[35%] blur-[120px] rounded-full", isDark ? "bg-purple-500/10" : "bg-purple-500/5")} />
            </div>

            {/* LEFT SIDEBAR */}
            <div className={cn("w-full md:w-[28%] lg:w-[25%] backdrop-blur-2xl border-r relative flex flex-col p-10 lg:p-14 transition-colors duration-500", bgSidebar, borderApp)}>
                <div className="relative z-10 flex flex-col h-full">
                    {/* Compact Logo */}
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <ShieldAlert className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn("text-lg font-bold tracking-tight leading-tight", textMain)}>{t.title}</span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.protocol}</span>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className={cn("text-3xl font-bold tracking-tight leading-tight", textMain)}>
                                {t.onboarding.split(' ')[0]} <br /> <span className="text-indigo-500">{t.onboarding.split(' ')[1] || ''}</span>
                            </h2>
                            <p className={cn("text-sm leading-relaxed max-w-[200px]", textMuted)}>
                                {t.onboardingDesc}
                            </p>
                        </div>

                        {/* Minimalist Vertical Stepper */}
                        <div className="space-y-8 relative">
                            {/* Connector Line */}
                            <div className={cn("absolute left-[0.6rem] top-2 bottom-2 w-[1px] transition-colors", lineBg)} />

                            {t.stepsArr.map((s, i) => {
                                const stepNum = i + 1;
                                return (
                                    <div key={s.id} className="flex items-center gap-4 relative group">
                                        <div className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-500",
                                            step === stepNum ? stepperActiveBg :
                                                step > stepNum ? stepperDoneBg : stepperIdleBg
                                        )}>
                                            {step > stepNum && <Check className="w-3 h-3 stroke-[3]" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-widest leading-none mb-1",
                                                step === stepNum ? "text-indigo-500" : textGhost
                                            )}>{s.title}</span>
                                            {step === stepNum && <span className={cn("text-xs font-medium animate-in slide-in-from-left-2 duration-300", textMuted)}>{s.info}</span>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* REFINED QUOTE BOX */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn("mt-auto p-6 rounded-2xl relative transition-colors", isDark ? "bg-white/[0.03] border border-white/5" : "bg-indigo-50/50 border border-indigo-100")}
                    >
                        <Quote className="absolute -top-3 -left-1 w-8 h-8 text-indigo-500/20" />
                        <p className={cn("text-sm italic font-medium leading-relaxed relative z-10", isDark ? "text-slate-300" : "text-indigo-900/80")}>
                            "{t.quote}"
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="w-4 h-[1px] bg-indigo-500/50" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500">{t.quoteAuthor}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* MAIN CONTENT: Re-Scaled Boarding Form (Remaining width) */}
            <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl w-full mx-auto my-auto p-8 lg:p-16">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02, y: -10 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full space-y-10"
                        >
                            {step === 1 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <h3 className={cn("text-3xl font-bold tracking-tight", textMain)}>{t.step1}</h3>
                                        <p className={cn("text-sm", textMuted)}>{t.step1Desc}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-2.5">
                                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest inline-flex items-center gap-2">
                                                <UserIcon className="w-3.5 h-3.5 text-indigo-500" /> {t.fullName}
                                            </Label>
                                            <Input {...register("name")} className={cn("h-12 rounded-xl px-4 focus:border-indigo-500 transition-all font-medium", bgCard, textMain)} placeholder={t.fullName} />
                                            {errors.name && <p className="text-[10px] text-red-500 font-bold px-1">{errors.name.message}</p>}
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest inline-flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {t.age}
                                            </Label>
                                            <Input {...register("age")} type="number" className={cn("h-12 rounded-xl px-4 focus:border-indigo-500 transition-all font-medium", bgCard, textMain)} placeholder="25" />
                                            {errors.age && <p className="text-[10px] text-red-500 font-bold px-1">{errors.age.message}</p>}
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest inline-flex items-center gap-2">
                                                <Globe className="w-3.5 h-3.5 text-indigo-500" /> {t.gender}
                                            </Label>
                                            <div className="flex gap-2">
                                                {['male', 'female', 'other'].map((g) => (
                                                    <button
                                                        key={g}
                                                        type="button"
                                                        onClick={() => setValue("gender", g as any)}
                                                        className={cn(
                                                            "flex-1 h-12 rounded-xl text-sm font-bold transition-all border",
                                                            watch("gender") === g
                                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                                                : cn(bgCard, textMuted, "hover:border-indigo-500/50 hover:text-indigo-500")
                                                        )}
                                                    >
                                                        {g === 'male' ? t.male : g === 'female' ? t.female : t.other}
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.gender && <p className="text-[10px] text-red-500 font-bold px-1">{errors.gender.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <h3 className={cn("text-3xl font-bold tracking-tight", textMain)}>{t.step2}</h3>
                                        <p className={cn("text-sm", textMuted)}>{t.step2Desc}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2.5">
                                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest inline-flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5 text-indigo-500" /> {t.caste}
                                            </Label>
                                            <Input {...register("caste")} className={cn("h-12 rounded-xl px-4 focus:border-indigo-500 transition-all", bgCard, textMain)} placeholder="e.g. Obc/General" />
                                            {errors.caste && <p className="text-[10px] text-red-500 font-bold">{errors.caste.message}</p>}
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest inline-flex items-center gap-2">
                                                <Flag className="w-3.5 h-3.5 text-indigo-500" /> {t.religion}
                                            </Label>
                                            <Input {...register("religion")} className={cn("h-12 rounded-xl px-4 focus:border-indigo-500 transition-all", bgCard, textMain)} placeholder="Hindu/Sikh/etc." />
                                            {errors.religion && <p className="text-[10px] text-red-500 font-bold">{errors.religion.message}</p>}
                                        </div>
                                        <div className="md:col-span-2 space-y-2.5">
                                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest inline-flex items-center gap-2">
                                                <Building className="w-3.5 h-3.5 text-indigo-500" /> {t.guardian}
                                            </Label>
                                            <Input {...register("fathers_name")} className={cn("h-12 rounded-xl px-4 focus:border-indigo-500 transition-all", bgCard, textMain)} placeholder={t.fullName} />
                                            {errors.fathers_name && <p className="text-[10px] text-red-500 font-bold">{errors.fathers_name.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <h3 className={cn("text-3xl font-bold tracking-tight", textMain)}>{t.step3}</h3>
                                        <p className={cn("text-sm", textMuted)}>{t.step3Desc}</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2.5">
                                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest inline-flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {t.area}
                                            </Label>
                                            <Input {...register("area")} className={cn("h-12 rounded-xl px-4 focus:border-indigo-500 transition-all", bgCard, textMain)} placeholder="Town, District, State" />
                                            {errors.area && <p className="text-[10px] text-red-500 font-bold">{errors.area.message}</p>}
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest inline-flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5 text-indigo-500" /> {t.contact}
                                            </Label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">IND +91</div>
                                                <Input {...register("phone")} className={cn("h-12 rounded-xl pl-20 pr-4 focus:border-indigo-500 transition-all", bgCard, textMain)} placeholder="000 000 0000" />
                                            </div>
                                            {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-10 py-6 text-center max-w-sm mx-auto animate-in zoom-in-95 duration-500">
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/20">
                                            <Lock className="w-8 h-8 text-indigo-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className={cn("text-2xl font-bold tracking-tight", textMain)}>{t.step4}</h3>
                                            <p className={cn("text-xs", textMuted)}>{t.step4Desc} <span className="text-indigo-500 font-bold">{watch("phone")}</span></p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Input
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            className={cn("h-16 rounded-xl text-center text-3xl font-bold tracking-[0.5em] focus:border-indigo-500 transition-all", bgCard, textMain)}
                                            maxLength={6}
                                            placeholder="••••••"
                                            autoFocus
                                        />
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t.enterKey}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* MODULAR COMPACT ACTIONS */}
                <div className="max-w-2xl w-full mx-auto pb-12 px-8 flex flex-col gap-6">
                    <div className="flex gap-4">
                        {step > 1 && step < 4 && (
                            <Button
                                onClick={prevStep}
                                variant="outline"
                                className={cn("h-12 px-6 rounded-xl transition-all", isDark ? "border-white/5 bg-white/[0.02] hover:bg-slate-800 text-slate-400" : "border-slate-200 bg-white hover:bg-slate-100 text-slate-700")}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {t.prev}
                            </Button>
                        )}

                        {step < 4 ? (
                            <Button
                                onClick={nextStep}
                                className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 transition-all rounded-xl text-sm font-bold text-white shadow-xl shadow-indigo-600/10 group"
                            >
                                {step === 3 ? t.next2 : t.next1}
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        ) : (
                            <Button
                                onClick={verifyAndSave}
                                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 transition-all rounded-xl text-base font-bold text-white shadow-2xl shadow-indigo-600/20"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.verify}
                            </Button>
                        )}
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                        <span>{t.integrity}</span>
                        <span className={isDark ? "text-slate-700 italic" : "text-slate-400 italic"}>{t.encryption}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
