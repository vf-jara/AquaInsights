import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService, UserProfile } from '../services/userService';

interface AuthContextData {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    updateProfileContext: (newProfile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const userProfile = await userService.getUserProfile(currentUser.uid);
                    setProfile(userProfile);
                } catch (error) {
                    console.error("Erro ao carregar perfil do usuário:", error);
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const updateProfileContext = (newProfile: UserProfile) => {
        setProfile(newProfile);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, updateProfileContext }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
