"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronRight, 
    ChevronLeft, 
    X, 
    Play, 
    CheckCircle2, 
    Info 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import GradientText from "./GradientText";
import { UserRole } from "@/types";

interface Step {
    targetId: string;
    title: { en: string; hi: string };
    content: { en: string; hi: string };
    position?: "top" | "bottom" | "left" | "right";
    roleLimit?: UserRole[];
}

const UI_STRINGS = {
    stepOf: { en: "Step", hi: "चरण" },
    of: { en: "of", hi: "का" },
    back: { en: "Back", hi: "पीछे" },
    next: { en: "Next", hi: "आगे" },
    finish: { en: "Finish", hi: "समाप्त" },
    skip: { en: "Skip", hi: "छोड़ें" },
    dismiss: { en: "Dismiss", hi: "खारिज करें" },
    startTour: { en: "Start Tour", hi: "दौरा शुरू करें" },
    welcomeTitle: { en: "Welcome to SAMARTH", hi: "समर्थ में आपका स्वागत है" },
    welcomeDesc: { en: "First time here? Let us give you a quick guided tour of the platform features.", hi: "यहाँ पहली बार आए हैं? चलिए हम आपको इस प्लेटफ़ॉर्म की सुविधाओं का एक त्वरित निर्देशित दौरा कराते हैं।" },
    welcomeRefresher: { en: "Would you like a quick refresher tour of the dashboard layouts and features?", hi: "क्या आप डैशबोर्ड लेआउट और सुविधाओं का एक त्वरित रिफ्रेशर दौरा चाहेंगे?" },
};

const STEPS: Step[] = [
    {
        targetId: "sidebar-tutorial",
        title: { en: "Navigation Panel", hi: "नेविगेशन पैनल" },
        content: { en: "This is your main navigation panel. From here you can access all key sections.", hi: "यह आपका मुख्य नेविगेशन पैनल है। यहाँ से आप सभी प्रमुख अनुभागों तक पहुँच सकते हैं।" },
        position: "right"
    },
    {
        targetId: "nav-dashboard",
        title: { en: "Main Dashboard", hi: "मुख्य डैशबोर्ड" },
        content: { en: "This is your overview screen where you can quickly see stats and recent activity.", hi: "यह आपकी अवलोकन स्क्रीन है जहाँ आप जल्दी से आँकड़े और हाल की गतिविधियाँ देख सकते हैं।" },
        position: "right"
    },
    {
        targetId: "nav-my-complaints",
        title: { en: "My Complaints", hi: "मेरी शिकायतें" },
        content: { en: "Here you can view all complaints you have submitted and track their status in real-time.", hi: "यहाँ आप अपनी सभी दर्ज की गई शिकायतें देख सकते हैं और वास्तविक समय में उनकी स्थिति को ट्रैक कर सकते हैं।" },
        position: "right",
        roleLimit: ["civilian"]
    },
    {
        targetId: "nav-tender-approvals",
        title: { en: "Tender Approvals", hi: "निविदा अनुमोदन" },
        content: { en: "Review and approve pending tenders directly from this section.", hi: "इस अनुभाग से सीधे लंबित निविदाओं की समीक्षा और अनुमोदन करें।" },
        position: "right",
        roleLimit: ["worker"]
    },
    {
        targetId: "nav-workers",
        title: { en: "Worker Management", hi: "श्रमिक प्रबंधन" },
        content: { en: "Manage and track your workforce across different projects.", hi: "विभिन्न परियोजनाओं में अपने कार्यबल का प्रबंधन और ट्रैक करें।" },
        position: "right",
        roleLimit: ["contractor"]
    },
    {
        targetId: "nav-local-projects",
        title: { en: "Local Projects", hi: "स्थानीय परियोजनाएं" },
        content: { en: "View progress and details of development projects happening near you.", hi: "अपने आस-पास हो रही विकास परियोजनाओं की प्रगति और विवरण देखें।" },
        position: "right",
        roleLimit: ["civilian"]
    },
    {
        targetId: "nav-progress-tracking",
        title: { en: "Progress Tracking", hi: "प्रगति ट्रैकिंग" },
        content: { en: "Monitor the real-time progress of all ongoing local developments.", hi: "सभी चल रहे स्थानीय विकासों की वास्तविक समय की प्रगति की निगरानी करें।" },
        position: "right",
        roleLimit: ["worker"]
    },
    {
        targetId: "nav-schemes",
        title: { en: "Government Schemes", hi: "सरकारी योजनाएं" },
        content: { en: "Explore government schemes, check eligibility, and apply directly.", hi: "सरकारी योजनाओं का अन्वेषण करें, पात्रता की जांच करें और सीधे आवेदन करें।" },
        position: "right",
        roleLimit: ["civilian"]
    },
    {
        targetId: "nav-analytics",
        title: { en: "Analytics Dashboard", hi: "एनालिटिक्स डैशबोर्ड" },
        content: { en: "Comprehensive data visualization and reporting for making informed decisions.", hi: "सूचित निर्णय लेने के लिए व्यापक डेटा विज़ुअलाइज़ेशन और रिपोर्टिंग।" },
        position: "right",
        roleLimit: ["worker", "contractor"]
    },
    {
        targetId: "nav-notifications",
        title: { en: "Alerts & Notifications", hi: "अलर्ट और सूचनाएं" },
        content: { en: "Stay updated with important alerts and announcements.", hi: "महत्वपूर्ण अलर्ट और घोषणाओं के साथ अपडेट रहें।" },
        position: "right"
    },
    {
        targetId: "file-complaint-btn",
        title: { en: "Quick Action", hi: "त्वरित कार्रवाई" },
        content: { en: "Report any issue in your area with location tagging and images.", hi: "स्थान टैगिंग और छवियों के साथ अपने क्षेत्र की किसी भी समस्या की रिपोर्ट करें।" },
        position: "left",
        roleLimit: ["civilian"]
    },
    {
        targetId: "dashboard-stats",
        title: { en: "Key Metrics", hi: "मुख्य मेट्रिक्स" },
        content: { en: "View mission-critical summary stats for your current role.", hi: "अपनी वर्तमान भूमिका के लिए महत्वपूर्ण सारांश आँकड़े देखें।" },
        position: "bottom"
    },
    {
        targetId: "dashboard-charts",
        title: { en: "Data Trends", hi: "डेटा रुझान" },
        content: { en: "Visualize trends and volume patterns using interactive charts.", hi: "इंटरैक्टिव चार्ट का उपयोग करके रुझानों और मात्रा पैटर्न की कल्पना करें।" },
        position: "top"
    }
];

export function DashboardTutorial({ role }: { role: UserRole }) {
    const [currentStep, setCurrentStep] = useState(-1);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);
    const [lang, setLang] = useState<"en" | "hi">("en");

    // Detect language from cookie
    useEffect(() => {
        const checkLang = () => {
            const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
            if (match && match[2] === '/en/hi') {
                setLang('hi');
            } else {
                setLang('en');
            }
        };
        
        checkLang();
        const interval = setInterval(checkLang, 2000);
        return () => clearInterval(interval);
    }, []);

    const filteredSteps = useMemo(() => {
        return STEPS.filter(step => !step.roleLimit || step.roleLimit.includes(role));
    }, [role]);

    useEffect(() => {
        const completed = localStorage.getItem(`dashboard_tutorial_completed_${role}`);
        const promptedThisSession = sessionStorage.getItem(`dashboard_tutorial_prompted_${role}`);
        
        if (completed) {
            setHasCompleted(true);
            // Returning user: Show prompt if not already prompted this session
            if (!promptedThisSession) {
                setTimeout(() => {
                    setCurrentStep(-2);
                    sessionStorage.setItem(`dashboard_tutorial_prompted_${role}`, "true");
                }, 2000);
            }
        } else {
            // First-time user: Automatically start the tutorial
            setTimeout(() => {
                setCurrentStep(0);
                sessionStorage.setItem(`dashboard_tutorial_prompted_${role}`, "true");
            }, 1000);
        }
    }, [role]);

    const updateTargetRect = useCallback(() => {
        if (currentStep >= 0 && currentStep < filteredSteps.length) {
            const step = filteredSteps[currentStep];
            const element = document.getElementById(step.targetId);
            if (element) {
                setTargetRect(element.getBoundingClientRect());
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        } else {
            setIsVisible(false);
        }
    }, [currentStep, filteredSteps]);

    useEffect(() => {
        updateTargetRect();
        window.addEventListener("resize", updateTargetRect);
        window.addEventListener("scroll", updateTargetRect, true);
        return () => {
            window.removeEventListener("resize", updateTargetRect);
            window.removeEventListener("scroll", updateTargetRect, true);
        };
    }, [updateTargetRect]);

    const handleNext = () => {
        if (currentStep < filteredSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinish();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        setCurrentStep(-1);
        localStorage.setItem(`dashboard_tutorial_completed_${role}`, "true");
        setHasCompleted(true);
    };

    const handleFinish = () => {
        setCurrentStep(-1);
        localStorage.setItem(`dashboard_tutorial_completed_${role}`, "true");
        setHasCompleted(true);
    };

    const handleExit = () => {
        setCurrentStep(-1);
        // Does not set completed=true, allowing resume later
    };

    const handleStart = () => {
        setCurrentStep(0);
    };

    const tooltipStyle = useMemo(() => {
        if (!targetRect || currentStep < 0 || currentStep >= filteredSteps.length) return {};
        const step = filteredSteps[currentStep];
        const padding = 20;

        switch (step?.position) {
            case "right":
                return {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.right + padding,
                    transform: "translateY(-50%)"
                };
            case "left":
                return {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.left - padding,
                    transform: "translate(-100%, -50%)"
                };
            case "top":
                return {
                    top: targetRect.top - padding,
                    left: targetRect.left + targetRect.width / 2,
                    transform: "translate(-50%, -100%)"
                };
            case "bottom":
            default:
                return {
                    top: targetRect.bottom + padding,
                    left: targetRect.left + targetRect.width / 2,
                    transform: "translateX(-50%)"
                };
        }
    }, [targetRect, currentStep, filteredSteps]);

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            {/* Spotlight Overlay */}
            <AnimatePresence>
                {isVisible && targetRect && currentStep >= 0 && currentStep < filteredSteps.length && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 pointer-events-auto"
                        style={{
                            clipPath: `polygon(
                                0% 0%, 
                                0% 100%, 
                                ${targetRect.left}px 100%, 
                                ${targetRect.left}px ${targetRect.top}px, 
                                ${targetRect.right}px ${targetRect.top}px, 
                                ${targetRect.right}px ${targetRect.bottom}px, 
                                ${targetRect.left}px ${targetRect.bottom}px, 
                                ${targetRect.left}px 100%, 
                                100% 100%, 
                                100% 0%
                            )`
                        }}
                        onClick={handleSkip}
                    >
                        <motion.div 
                            layoutId="spotlight-border"
                            className="absolute border-2 border-indigo-500 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.5)] bg-indigo-500/5"
                            style={{
                                top: targetRect.top - 4,
                                left: targetRect.left - 4,
                                width: targetRect.width + 8,
                                height: targetRect.height + 8,
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Step Tooltip */}
            <AnimatePresence>
                {isVisible && targetRect && currentStep >= 0 && currentStep < filteredSteps.length && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl w-[320px] pointer-events-auto"
                        style={tooltipStyle}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-1 rounded">
                                {UI_STRINGS.stepOf[lang]} {currentStep + 1} {UI_STRINGS.of[lang]} {filteredSteps.length}
                            </span>
                            <button onClick={handleExit} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <h3 className="text-lg font-bold mb-2 text-white">{filteredSteps[currentStep]?.title[lang]}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            {filteredSteps[currentStep]?.content[lang]}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleBack} 
                                disabled={currentStep === 0}
                                className="text-slate-400 hover:text-white h-9"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> {UI_STRINGS.back[lang]}
                            </Button>
                            
                            <Button 
                                size="sm" 
                                onClick={handleNext}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white h-9"
                            >
                                {currentStep === filteredSteps.length - 1 ? UI_STRINGS.finish[lang] : UI_STRINGS.next[lang]} 
                                {currentStep < filteredSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Start Prompt Dialog */}
            <AnimatePresence>
                {currentStep === -2 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border border-slate-700 p-10 rounded-3xl shadow-2xl max-w-md text-center"
                        >
                            <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-600/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/20">
                                <Info className="w-10 h-10 text-indigo-400" />
                            </div>
                            
                            <h2 className="text-2xl font-bold mb-3">
                                <GradientText colors={['#ffffff', '#a5b4fc', '#ffffff']}>{UI_STRINGS.welcomeTitle[lang]}</GradientText>
                            </h2>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                {hasCompleted 
                                    ? UI_STRINGS.welcomeRefresher[lang]
                                    : UI_STRINGS.welcomeDesc[lang]}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <Button 
                                    variant="outline" 
                                    className="border-slate-700 bg-slate-800 hover:bg-slate-700 h-12 rounded-xl"
                                    onClick={handleExit}
                                >
                                    {UI_STRINGS.dismiss[lang]}
                                </Button>
                                <Button 
                                    className="bg-indigo-600 hover:bg-indigo-500 h-12 rounded-xl group"
                                    onClick={handleStart}
                                >
                                    {UI_STRINGS.startTour[lang]} <Play className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-6 right-6 pointer-events-auto">
                 <Button 
                    variant="ghost" 
                    className="bg-slate-800/80 hover:bg-slate-700 rounded-full w-12 h-12 p-0 border border-slate-700/50 shadow-xl backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                    onClick={() => setCurrentStep(-2)}
                    title={lang === 'en' ? "Dashboard Help Tour" : "डैशबोर्ड सहायता दौरा"}
                 >
                    <Info className="w-5 h-5 text-indigo-400" />
                 </Button>
            </div>
        </div>
    );
}

export default DashboardTutorial;
