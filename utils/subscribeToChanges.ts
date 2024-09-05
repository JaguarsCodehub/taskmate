import { supabase } from "./supabase";

const subscribeToTaskChanges = () => {
    const channel = supabase
        .channel('public:tasks')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, (payload) => {
            console.log('Change received!', payload);
        })
        .subscribe();
    console.log('Subscription created successfully!', channel);


    return () => {
        supabase.removeChannel(channel)
    }
}

const scheduleNotification = async (task: any) => {
    const {data: user, error} = await supabase
        .from('users')
        .select('push_token')
        .eq('id', task.assigned_to)
        .single();

    if (error) {
        console.error('Error fetching assigned user:', error);
        return;
    }

    if(!user.push_token) {
        console.warn(`No push token found for user ${task.assigned_to}`);
        return;
    }
}

