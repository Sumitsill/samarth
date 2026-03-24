"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import { complaintService } from "@/services/complaintService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ArrowLeft,
    MapPin,
    Camera,
    Loader2,
    CheckCircle2,
    AlertCircle,
    X,
    Plus
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import GradientText from "@/components/GradientText";
import Prism from "@/components/Prism";
import AICircle from "@/components/AICircle";

const complaintSchema = z.object({
    description: z.string().min(10, "Please provide a more detailed description (min 10 chars)"),
    address: z.string().min(5, "Address is required"),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export default function NewComplaintPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [images, setImages] = useState<{file: File, preview: string}[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<ComplaintFormValues>({
        resolver: zodResolver(complaintSchema),
        defaultValues: {
            description: "",
            address: ""
        }
    });

    const description = watch("description");
    const address = watch("address");
    const isFormValid = description.length >= 10 && address.length >= 5 && images.length > 0;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setError(null);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImages(prev => [...prev, { file, preview: reader.result as string }]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: ComplaintFormValues) => {
        if (!user) return;
        
        // Strict Validation Check
        if (images.length === 0) {
            setError("Please upload at least one image to submit the complaint.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await complaintService.fileComplaint(user.id, {
                description: data.description,
                location: {
                    lat: 0,
                    lng: 0,
                    address: data.address
                },
                // For simplicity, we send the first image or modify service to handle multiple
                imageFile: images[0].file 
            });
            setIsSuccess(true);
            setTimeout(() => router.push("/dashboard/civilian/complaints"), 2000);
        } catch (err: any) {
            setError(err.message || "Failed to file complaint. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
                <div className="fixed inset-0 pointer-events-none opacity-40 -z-10">
                    <Prism hueShift={120} animationType="rotate" scale={3} glow={1} />
                </div>
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-4xl font-bold tracking-tight">
                        <GradientText colors={['#10b981', '#34d399', '#10b981']}>Complaint Filed!</GradientText>
                    </h2>
                    <p className="text-slate-400 max-w-sm mx-auto mt-3">
                        Your issue has been logged and our AI is currently categorizing it. Track status in your dashboard.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                        <p className="text-indigo-400 text-sm font-medium">Redirecting to history...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-4 pb-12 relative">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none opacity-10 -z-10">
                <Prism hueShift={220} animationType="3drotate" scale={1.5} glow={0.5} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-6 mb-10"
            >
                <Link href="/dashboard/civilian/complaints">
                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        <GradientText colors={['#ffffff', '#a5b4fc', '#ffffff']} className="ml-0">Report an Issue</GradientText>
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">Help us build a better constituency, one report at a time.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3"
                >
                    <Card className="bg-[#0E0F17]/80 backdrop-blur-2xl border-slate-800 shadow-2xl rounded-[40px] overflow-hidden relative border-t-indigo-500/50">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-2xl font-black">Issue Details</CardTitle>
                            <CardDescription className="text-slate-400 text-base">Accurate data ensures rapid response from our ground teams.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> Description of incident
                                    </label>
                                    <Textarea
                                        {...register("description")}
                                        placeholder="Describe the issue in detail... (e.g. Water main break at Adarsh Nagar Metro Station)"
                                        className={cn(
                                            "bg-[#1A1E2E]/50 border-slate-800 min-h-[160px] focus-visible:ring-indigo-600/50 rounded-3xl resize-none text-lg p-6 transition-all",
                                            errors.description && "border-rose-500/50 bg-rose-500/5"
                                        )}
                                    />
                                    {errors.description && <p className="text-xs text-rose-500 font-bold ml-2">⚠️ {errors.description.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                        <MapPin className="w-3.5 h-3.5" /> Incident Location
                                    </label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                        <Input
                                            {...register("address")}
                                            placeholder="House No, Street, Landmark..."
                                            className={cn(
                                                "bg-[#1A1E2E]/50 border-slate-800 h-16 pl-14 focus-visible:ring-indigo-600/50 rounded-[20px] text-lg font-bold transition-all",
                                                errors.address && "border-rose-500/50 bg-rose-500/5"
                                            )}
                                        />
                                    </div>
                                    {errors.address && <p className="text-xs text-rose-500 font-bold ml-2">⚠️ {errors.address.message}</p>}
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className={cn(
                                            "w-full h-18 text-xl font-black shadow-2xl rounded-[24px] transition-all relative overflow-hidden group",
                                            isFormValid 
                                                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20" 
                                                : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                                        )}
                                        disabled={isLoading || !isFormValid}
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Submit Complaint <CheckCircle2 className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                </>
                                            )}
                                        </span>
                                    </Button>
                                    {!isFormValid && !isLoading && (
                                        <p className="text-[10px] text-center font-black text-rose-400 uppercase tracking-widest mt-4 animate-pulse">
                                            {images.length === 0 ? "Images Required to submit" : "Fill all fields to continue"}
                                        </p>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 space-y-8"
                >
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                <Camera className="w-3.5 h-3.5" /> Media Evidence ({images.length})
                            </label>
                            {images.length > 0 && (
                                <button onClick={() => setImages([])} className="text-[10px] font-black text-rose-400 uppercase hover:underline">Clear All</button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <AnimatePresence>
                                {images.map((img, i) => (
                                    <motion.div
                                        key={img.preview}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="aspect-square rounded-3xl overflow-hidden relative group border-2 border-indigo-500/20"
                                    >
                                        <img src={img.preview} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                onClick={() => removeImage(i)}
                                                className="w-10 h-10 bg-rose-500 text-white rounded-xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-3xl border-2 border-dashed border-slate-800 bg-slate-900/40 hover:bg-indigo-500/5 hover:border-indigo-500/40 transition-all flex flex-col items-center justify-center gap-2 group"
                            >
                                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all">
                                    <Plus className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Add Evidence</span>
                            </button>
                        </div>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[40px] flex flex-col gap-4 relative overflow-hidden group shadow-2xl">
                        <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                            <AICircle size={250} color={images.length > 0 ? "#818cf8" : "#6366f1"} active={images.length > 0} />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-500/20 text-white rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                                <AICircle size={28} color={images.length > 0 ? "#ffffff" : "#818cf8"} active={true} />
                            </div>
                            <h4 className="font-black text-indigo-100 text-lg uppercase tracking-tight">AI Diagnostic Shield</h4>
                        </div>
                        <p className="text-sm text-indigo-200/60 font-medium leading-relaxed relative z-10">
                            Our AI requires visual evidence to authenticate the severity of the issue. Complaints with **Live Photos** are prioritized 3x faster in the resolution queue.
                        </p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[28px] flex gap-4 text-rose-500 font-black uppercase text-xs tracking-widest shadow-2xl"
                            >
                                <AlertCircle className="w-6 h-6 shrink-0" />
                                <p className="leading-5">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}


