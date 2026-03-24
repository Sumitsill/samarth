import { supabase } from "@/lib/supabase";
import { User } from "@/types";

export const userService = {
    async updateProfile(userId: string, data: Partial<User & { profile_pic?: string, settings?: any }>) {
        const { error } = await supabase
            .from('users')
            .update(data)
            .eq('id', userId);

        if (error) {
            console.error("Error updating user profile:", error);
            throw new Error(error.message);
        }
    },

    async getUserSettings(userId: string) {
        const { data, error } = await supabase
            .from('users')
            .select('settings')
            .eq('id', userId)
            .single();

        if (error) {
            console.error("Error fetching user settings:", error);
            return null;
        }

        return data?.settings;
    }
};
