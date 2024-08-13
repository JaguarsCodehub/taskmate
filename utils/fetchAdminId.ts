import { supabase } from './supabase';


export const fetchAdminUserId = async () => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('role', 'admin')
            .single(); // Use single if you expect only one admin, or handle multiple admins as needed 
        if (error) {
            console.error('Error fetching admin user ID:', error.message);
            return null;
        }

        return data?.id; // Return the admin user ID
    } catch (error: any) {
        console.error('Unexpected error fetching admin user ID:', error.message);
        return null;
    }
}
