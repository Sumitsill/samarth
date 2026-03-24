import { User, UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

export const authService = {
    async getUserData(uid: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', uid)
            .single();

        if (error) {
            return null;
        }

        return data as User;
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
                .from('users')
                .upsert({
                    id: data.user.id,
                    name: name,
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

            return {
                id: data.user.id,
                name: data.user.user_metadata?.name || email.split('@')[0],
                phone: data.user.user_metadata?.phone || "",
                role: userRole || role
            };
        }

        throw new Error("Invalid credentials");
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
            
            // Fetch full user data from our 'users' table
            const { data: userData, error: userError } = await supabase
                .from('users')
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
                callback(userData as User);
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
