"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, ShieldCheck, Home } from "lucide-react";
import FloatingLines from "@/components/FloatingLines";
import GradientText from "@/components/GradientText";
import { Button } from "@/components/ui/button";
import Prism from "@/components/Prism";

export default function VerifySuccessPage() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0B0914] overflow-hidden font-sans">
            {/* Background Decorative Element */}
            <div className="absolute inset-0 z-0">
                <FloatingLines />
            </div>

            {/* 3D Prism Accent */}
            <div className="absolute top-0 right-0 w-full h-[600px] opacity-30 pointer-events-none">
                <Prism 
                    height={4} 
                    baseWidth={6} 
                    animationType="3drotate" 
                    scale={4} 
                    hueShift={280} 
                    glow={1.5}
                />
            </div>

            {/* Content Container */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-8 text-center"
            >
                {/* Home Button */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 xs:left-0 xs:translate-x-0 xs:top-0">
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-400 hover:text-white flex items-center gap-1.5 hover:bg-slate-800/50 h-9 px-3">
                            <Home className="w-4 h-4" />
                            <span className="text-[10px] font-semibold tracking-wider">PORTAL</span>
                        </Button>
                    </Link>
                </div>

                {/* Logo Section */}
                <div className="mb-12 mt-8 xs:mt-0 flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-600/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                            <ShieldCheck className="w-6 h-6 text-indigo-500" />
                        </div>
                        <h1 className="text-xl font-bold tracking-[0.2em] uppercase">
                            <GradientText colors={['#E2E8F0', '#94a3b8', '#E2E8F0']}>SAMARTH</GradientText>
                        </h1>
                    </div>
                </div>

                <div className="mb-8 flex justify-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                            delay: 0.3, 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 20 
                        }}
                        className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)] backdrop-blur-sm"
                    >
                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    </motion.div>
                </div>

                <div className="space-y-4">
                    <GradientText 
                        colors={['#ffffff', '#a5b4fc', '#ffffff']}
                        className="text-3xl font-bold tracking-tight"
                    >
                        Email Verified Successfully!
                    </GradientText>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto"
                    >
                        Your identity has been confirmed. You can now access the portal with your credentials.
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12"
                >
                    <Link href="/login" className="w-full">
                        <Button className="w-full bg-[#3f21f1] hover:bg-[#3217d8] text-white font-semibold h-[52px] text-sm rounded-xl transition-all shadow-xl shadow-indigo-500/10 group">
                            Continue to Login
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </motion.div>

                {/* Subtle Footer */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1.2 }}
                    className="mt-16 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold"
                >
                    <div className="h-[1px] w-8 bg-slate-800" />
                    <span>Access Granted</span>
                    <div className="h-[1px] w-8 bg-slate-800" />
                </motion.div>
            </motion.div>

            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full pointer-events-none" />
        </div>
    );
}
