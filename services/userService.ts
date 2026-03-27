import { supabase } from "@/lib/supabase";
import { User } from "@/types";

export const userService = {
    async updateProfile(userId: string, data: Partial<User & { profile_pic?: string, settings?: any }>) {
        const { name, ...rest } = data;
        const { error } = await supabase
            .from('profiles')
            .update({
                ...rest,
                full_name: name // Map name field to full_name column
            })
            .eq('id', userId);

        if (error) {
            console.error("Error updating user profile:", error);
            throw new Error(error.message);
        }
    },

    async getUserSettings(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
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
