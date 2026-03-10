"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useDataStore, Project } from "@/store/useDataStore";
import dynamic from 'next/dynamic';
import { GoogleMap, useJsApiLoader, MarkerF, HeatmapLayerF } from '@react-google-maps/api';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import GradientText from "@/components/GradientText";
import { MapPin, Calendar, IndianRupee, HardHat, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Google Maps Configuration
const GOOGLE_MAPS_API_KEY = "AIzaSyBToEOs4jFNTl_DSDUGqUcUFTFKdDPThAE";
const LIBRARIES: ("visualization" | "places")[] = ["visualization"];

const DARK_MAP_STYLE = [
    { "elementType": "geometry", "stylers": [{ "color": "#0E0F17" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0E0F17" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
    { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181A26" }] },
    { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1C1E2D" }] },
    { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#242A3E" }] },
    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
    { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
    { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0B0C14" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
    { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#0B0C14" }] }
];

const ConstituencyMap = dynamic(() => Promise.resolve(LocalProjectMap), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-900/50 animate-pulse flex items-center justify-center text-slate-500 font-medium border border-slate-800 rounded-3xl">Initializing Map Intelligence...</div>
});

const DELHI_PROJECTS: Project[] = [
    {
        id: "delhi-metro-4",
        title: "Delhi Metro Phase-IV (Janakpuri W - RK Ashram)",
        description: "Construction of 12.3 km corridor to enhance connectivity in North & West Delhi.",
        location: "Janakpuri to RK Ashram",
        coordinates: { lat: 28.6297, lng: 77.0772 },
        status: "in-progress",
        budget: 25000000000,
        completionPercentage: 45,
        contractor: "DMRC / L&T Construction",
        images: ["https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?q=80&w=2070&auto=format&fit=crop"],
        createdAt: new Date().toISOString()
    },
    {
        id: "dwarka-exp-2",
        title: "Dwarka Expressway (Delhi Section)",
        description: "8-lane access-controlled expressway connecting Mahipalpur to Haryana Border.",
        location: "Dwarka, New Delhi",
        coordinates: { lat: 28.5623, lng: 77.0300 },
        status: "in-progress",
        budget: 53600000000,
        completionPercentage: 85,
        contractor: "L&T Infrastructure",
        images: ["https://images.unsplash.com/photo-1545143822-8e444659fca2?q=80&w=2604&auto=format&fit=crop"],
        createdAt: new Date().toISOString()
    },
    {
        id: "barapullah-3",
        title: "Barapullah Phase-III Flyover",
        description: "Elevated corridor project to reduce travel time between East & South Delhi.",
        location: "Mayur Vihar - Sarai Kale Khan",
        coordinates: { lat: 28.5833, lng: 77.2333 },
        status: "in-progress",
        budget: 12600000000,
        completionPercentage: 70,
        contractor: "PWD Delhi",
        images: ["https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=2070&auto=format&fit=crop"],
        createdAt: new Date().toISOString()
    },
    {
        id: "uer-2",
        title: "Urban Extension Road-II (UER-II)",
        description: "Delhi's Third Ring Road project connecting major National Highways.",
        location: "Alipur to Dichaon Kalan",
        coordinates: { lat: 28.7183, lng: 77.1000 },
        status: "in-progress",
        budget: 77000000000,
        completionPercentage: 90,
        contractor: "NHAI",
        images: ["https://images.unsplash.com/photo-1574950578143-858c6fc58922?q=80&w=2070&auto=format&fit=crop"],
        createdAt: new Date().toISOString()
    },
    {
        id: "ndls-redev",
        title: "New Delhi Railway Station Redevelopment",
        description: "Transformation into a multi-modal transport hub with world-class facilities.",
        location: "Ajmeri Gate, New Delhi",
        coordinates: { lat: 28.6415, lng: 77.2208 },
        status: "planned",
        budget: 47000000000,
        completionPercentage: 10,
        contractor: "RLDA / Adani Realty (Proposed)",
        images: ["https://images.unsplash.com/photo-1594993877167-a08f13013dc3?q=80&w=2071&auto=format&fit=crop"],
        createdAt: new Date().toISOString()
    },
    {
        id: "central-vista",
        title: "Central Vista Redevelopment",
        description: "Revamping the Power Corridor of India including the new Parliament building.",
        location: "Rajpath, New Delhi",
        coordinates: { lat: 28.6125, lng: 77.2135 },
        status: "in-progress",
        budget: 134500000000,
        completionPercentage: 65,
        contractor: "Tata Projects",
        images: ["https://images.unsplash.com/photo-1587309605728-1f6cc4af3001?q=80&w=2070&auto=format&fit=crop"],
        createdAt: new Date().toISOString()
    },
    {
        id: "signature-bridge",
        title: "Signature Bridge (Maintenance & Tourism Hub)",
        description: "Iconic bridge maintenance and development of a heritage and tourism hub at the site.",
        location: "Wazirabad, Delhi",
        coordinates: { lat: 28.7050, lng: 77.2280 },
        status: "completed",
        budget: 1518000000,
        completionPercentage: 100,
        contractor: "DTTDC",
        images: ["https://images.unsplash.com/photo-1596460655482-355b9e072b22?q=80&w=2070&auto=format&fit=crop"],
        createdAt: new Date().toISOString()
    }
];

export default function LocalProjectsPage() {
    const { projects, setProjects, selectedProject, setSelectedProject, projectFilters, setProjectFilters } = useDataStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*');

                if (error) throw error;

                if (!data || data.length === 0) {
                    setProjects(DELHI_PROJECTS);
                } else {
                    setProjects(data as Project[]);
                }
            } catch (err: any) {
                console.error("Supabase Error (Projects):", err.message || err);
                setProjects(DELHI_PROJECTS);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();

        const channel = supabase
            .channel('projects-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
                fetchProjects();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [setProjects]);

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const matchStatus = projectFilters.status === 'all' || p.status === projectFilters.status;
            const matchBudget = p.budget >= projectFilters.budgetRange[0] && p.budget <= projectFilters.budgetRange[1];
            return matchStatus && matchBudget;
        });
    }, [projects, projectFilters]);

    // Heatmap points for Google Maps
    const heatmapPoints = useMemo(() => {
        return filteredProjects.map(p => ({
            lat: p.coordinates.lat,
            lng: p.coordinates.lng
        }));
    }, [filteredProjects]);

    return (
        <div className="space-y-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        <GradientText colors={['#ffffff', '#a5b4fc', '#ffffff']} className="ml-0">Local Projects</GradientText>
                    </h1>
                    <p className="text-slate-400 mt-1">Real-time infrastructure developments in your constituency.</p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <Select
                        value={projectFilters.status}
                        onValueChange={(val: string | null) => setProjectFilters({ status: val || 'all' })}
                    >
                        <SelectTrigger className="w-[150px] bg-slate-900 border-slate-800 text-slate-200">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={`${projectFilters.budgetRange[0]}-${projectFilters.budgetRange[1]}`}
                        onValueChange={(val: string | null) => {
                            if (!val) return;
                            const [min, max] = val.split('-').map(Number);
                            setProjectFilters({ budgetRange: [min, max] });
                        }}
                    >
                        <SelectTrigger className="w-[160px] bg-slate-900 border-slate-800 text-slate-200">
                            <SelectValue placeholder="Budget" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            <SelectItem value="0-200000000000">All Budgets</SelectItem>
                            <SelectItem value="0-1000000000">&lt; ₹100 Cr</SelectItem>
                            <SelectItem value="1000000000-50000000000">₹100 Cr - ₹5000 Cr</SelectItem>
                            <SelectItem value="50000000000-200000000000">₹5000 Cr+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Map Area */}
            <Card className="bg-[#0E0F17] border-slate-800 overflow-hidden relative shadow-lg shadow-indigo-500/5 h-[450px] rounded-[32px]">
                {loading ? (
                    <div className="w-full h-full bg-slate-900/40 animate-pulse" />
                ) : (
                    <div className="w-full h-full relative">
                        <ConstituencyMap
                            projects={filteredProjects}
                            heatmapPoints={heatmapPoints}
                            onSelectProject={setSelectedProject}
                        />
                    </div>
                )}
            </Card>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="bg-[#0E0F17] border-slate-800 h-[280px]">
                            <CardContent className="p-6 h-full flex flex-col justify-between">
                                <Skeleton className="h-6 w-3/4 bg-slate-800" />
                                <Skeleton className="h-4 w-1/2 bg-slate-800" />
                                <Skeleton className="h-2 w-full mt-4 bg-slate-800" />
                                <Skeleton className="h-8 w-1/3 mt-auto bg-slate-800" />
                            </CardContent>
                        </Card>
                    ))
                ) : filteredProjects.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-slate-500">
                        No regular projects found matching your criteria.
                    </div>
                ) : (
                    filteredProjects.map(project => (
                        <Card
                            key={project.id}
                            className="bg-[#0E0F17] border-slate-800 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all cursor-pointer flex flex-col"
                            onClick={() => setSelectedProject(project)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={cn(
                                        "uppercase text-[10px] tracking-wider",
                                        project.status === 'completed' ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
                                            project.status === 'in-progress' ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
                                                "text-blue-400 border-blue-500/30 bg-blue-500/10"
                                    )}>
                                        {project.status.replace('-', ' ')}
                                    </Badge>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <IndianRupee className="w-3 h-3" />
                                        {project.budget >= 10000000 ? `${(project.budget / 10000000).toFixed(1)} Cr` : `${(project.budget / 100000).toFixed(1)} L`}
                                    </span>
                                </div>
                                <CardTitle className="text-lg text-white line-clamp-1">{project.title}</CardTitle>
                                <CardDescription className="line-clamp-2 text-slate-400 text-sm mt-1">{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Progress</span>
                                        <span className="text-white font-medium">{project.completionPercentage}%</span>
                                    </div>
                                    <Progress value={project.completionPercentage} className="h-2 bg-slate-800" indicatorClassName={cn(
                                        project.completionPercentage === 100 ? "bg-emerald-500" : "bg-indigo-500"
                                    )} />
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 p-2 rounded-md">
                                    <HardHat className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{project.contractor}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Project Detail Modal */}
            <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
                {selectedProject && (
                    <DialogContent className="bg-[#0E0F17] border-slate-800 text-white max-w-2xl">
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className={cn(
                                    "uppercase tracking-wider",
                                    selectedProject.status === 'completed' ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
                                        selectedProject.status === 'in-progress' ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
                                            "text-blue-400 border-blue-500/30 bg-blue-500/10"
                                )}>
                                    {selectedProject.status.replace('-', ' ')}
                                </Badge>
                            </div>
                            <DialogTitle className="text-2xl font-bold">{selectedProject.title}</DialogTitle>
                            <DialogDescription className="text-slate-400 pt-2">
                                {selectedProject.description}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-4 my-4">
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                                <MapPin className="w-8 h-8 text-indigo-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Location</p>
                                    <p className="text-sm font-medium">{selectedProject.location}</p>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                                <IndianRupee className="w-8 h-8 text-emerald-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Budget Allocated</p>
                                    <p className="text-sm font-medium">₹{selectedProject.budget >= 10000000 ? `${(selectedProject.budget / 10000000).toFixed(2)} Cr` : selectedProject.budget.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                                <Calendar className="w-8 h-8 text-amber-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Sanctioned Date</p>
                                    <p className="text-sm font-medium">{new Date(selectedProject.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                                <HardHat className="w-8 h-8 text-blue-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Contractor</p>
                                    <p className="text-sm font-medium truncate" title={selectedProject.contractor}>{selectedProject.contractor}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Current Progress</span>
                                <span className="text-white font-medium">{selectedProject.completionPercentage}%</span>
                            </div>
                            <Progress value={selectedProject.completionPercentage} className="h-3 bg-slate-800" indicatorClassName={cn(
                                selectedProject.completionPercentage === 100 ? "bg-emerald-500" : "bg-indigo-500"
                            )} />
                        </div>

                        {selectedProject.images && selectedProject.images.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-indigo-400" /> Site Photos
                                </h4>
                                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                    {selectedProject.images.map((img, idx) => (
                                        <img key={idx} src={img} alt={`Site image ${idx}`} className="h-32 w-48 object-cover rounded-md border border-slate-800" />
                                    ))}
                                </div>
                            </div>
                        )}

                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}

// Separate Map Component to isolate lifecycle and fix hydration/reference errors
function LocalProjectMap({ projects, heatmapPoints, onSelectProject }: any) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES
    });

    if (!isLoaded) return <div className="w-full h-full bg-slate-900/50 animate-pulse flex items-center justify-center text-slate-500 font-medium border border-slate-800 rounded-3xl">Initializing Map Intelligence...</div>;

    const heatmapData = heatmapPoints ? heatmapPoints.map((p: any) => new google.maps.LatLng(p.lat, p.lng)) : [];

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%", position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
            center={{ lat: 28.6139, lng: 77.2090 }} // Delhi center
            zoom={11}
            options={{
                styles: DARK_MAP_STYLE,
                disableDefaultUI: true,
                zoomControl: true,
                gestureHandling: "greedy",
            }}
        >
            <HeatmapLayerF
                data={heatmapData}
                options={{
                    radius: 30,
                    opacity: 0.6,
                }}
            />

            {projects.map((p: any) => (
                <MarkerF
                    key={p.id}
                    position={{ lat: p.coordinates.lat, lng: p.coordinates.lng }}
                    onClick={() => onSelectProject(p)}
                    icon={{
                        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z", // Simple pin
                        fillColor: "#6366f1",
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: "#ffffff",
                        scale: 1.5,
                        anchor: new google.maps.Point(12, 22),
                    }}
                />
            ))}
        </GoogleMap>
    );
}
