import { Session, User } from '@supabase/supabase-js';
import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { ActivityIndicator } from 'react-native';

import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';

type Auth = {
    isAuthenticated: boolean;
    session: Session | null;
    user?: User;
    role?: string;  // Added role to the context
};

const AuthContext = createContext<Auth>({
    isAuthenticated: false,
    session: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<string | null>(null);  // State for the user role
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const fetchUserRole = async (userId: string) => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', userId)
                    .single();
                if (error) throw error;
                setRole(data.role);

            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        if (role === "manager") {
            router.push("/(manager)")
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                fetchUserRole(session.user.id);
            }
            setIsReady(true);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                fetchUserRole(session.user.id);
            }
        });
    }, []);

    console.log(role)

    if (!isReady) {
        return <ActivityIndicator />;
    }

    return (
        <AuthContext.Provider
            value={{
                session,
                user: session?.user,
                isAuthenticated: !!session?.user,
                role,  // Provide the role in the context
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
