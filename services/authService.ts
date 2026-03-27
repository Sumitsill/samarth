import { User, UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

const checkIsProfileComplete = (userData: any): boolean => {
    if (!userData) return false;
    // Database check for boolean true or string true
    if (userData.profile_completed === true || userData.profile_completed === 'true' || userData.profile_completed === 1) return true;
    
    if (typeof window !== "undefined") {
        if (localStorage.getItem(`profile_completed_${userData.id}`) === 'true') {
            return true;
        }
    }
    
    // Evaluate mandatory core fields that are guaranteed in the Supabase schema
    if (userData.phone && userData.phone.length > 5) {
        return true;
    }

    return false;
};

export const authService = {
    async getUserData(uid: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', uid)
            .single();

        if (error) {
            return null;
        }

        return {
            id: data.id,
            name: data.full_name || data.name, // Support both potential column names
            phone: data.phone,
            role: data.role as UserRole,
            age: data.age,
            gender: data.gender,
            caste: data.caste,
            religion: data.religion,
            fathers_name: data.fathers_name,
            mothers_name: data.mothers_name || data.settings?.mothers_name,
            occupation: data.occupation || data.settings?.occupation,
            area: data.area,
            constituency: data.constituency || data.settings?.constituency,
            isProfileComplete: checkIsProfileComplete(data),
            profile_pic: data.profile_pic,
            settings: data.settings
        };
    },

    async signup(email: string, pass: string, role: UserRole, name: string): Promise<void> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
                data: {
                    role: role,
                    name: name
                },
                emailRedirectTo: `${window.location.origin}/verify-success`
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        if (data.user) {
            const { error: insertError } = await supabase
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    full_name: name,
                    email: email,
                    role: role,
                    phone: "",
                });
        }
    },

    async login(email: string, pass: string, role: UserRole): Promise<User | null> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: pass
        });

        if (error) {
            throw new Error(error.message);
        }

        if (data.user) {
            const userRole = data.user.user_metadata?.role;
            if (userRole && userRole !== role) {
                await supabase.auth.signOut();
                throw new Error(`User is not registered as a ${role}`);
            }

            const { data: userData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            return {
                id: data.user.id,
                name: userData?.full_name || data.user.user_metadata?.name || email.split('@')[0],
                phone: userData?.phone || data.user.user_metadata?.phone || "",
                role: userRole || role,
                age: userData?.age,
                gender: userData?.gender,
                caste: userData?.caste,
                religion: userData?.religion,
                fathers_name: userData?.fathers_name,
                mothers_name: userData?.mothers_name || userData?.settings?.mothers_name,
                occupation: userData?.occupation || userData?.settings?.occupation,
                area: userData?.area,
                constituency: userData?.constituency || userData?.settings?.constituency,
                isProfileComplete: checkIsProfileComplete(userData),
                settings: userData?.settings
            };
        }

        throw new Error("Invalid credentials");
    },

    async updateProfile(uid: string, profileData: Partial<User>): Promise<void> {
        const { name, ...rest } = profileData;
        const { error } = await supabase
            .from('profiles')
            .update({
                ...rest,
                full_name: name, // Supabase schema uses full_name
                profile_completed: true
            })
            .eq('id', uid);

        if (error) {
            throw new Error(error.message);
        }
    },

    async logout() {
        await supabase.auth.signOut();
    },

    subscribeToAuthChanges(callback: (user: User | null) => void) {
        const fetchAndEmitUser = async (u: any) => {
            if (!u) {
                callback(null);
                return;
            }
            
            // Fetch full user data from our 'profiles' table
            const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', u.id)
                .single();

            if (userError || !userData) {
                callback({
                    id: u.id,
                    name: u.user_metadata?.name || u.email?.split('@')[0] || "User",
                    phone: u.user_metadata?.phone || "",
                    role: (u.user_metadata?.role as UserRole) || "civilian"
                });
            } else {
                callback({
                    id: userData.id,
                    name: userData.full_name || userData.name || "",
                    phone: userData.phone || "",
                    role: userData.role as UserRole,
                    age: userData.age,
                    gender: userData.gender,
                    caste: userData.caste,
                    religion: userData.religion,
                    fathers_name: userData.fathers_name,
                    mothers_name: userData.mothers_name || userData.settings?.mothers_name,
                    occupation: userData.occupation || userData.settings?.occupation,
                    area: userData.area,
                    constituency: userData.constituency || userData.settings?.constituency,
                    isProfileComplete: checkIsProfileComplete(userData),
                    profile_pic: userData.profile_pic,
                    settings: userData.settings
                });
            }
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            fetchAndEmitUser(session?.user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchAndEmitUser(session?.user);
        });

        return () => {
            subscription.unsubscribe();
        };
    }
};
