import React, { createContext, useState, useEffect, useContext } from 'react';
import type { Profile } from '../types';
import { deleteProfileData } from '../lib/storage';

interface IAuthContext {
    profiles: Profile[];
    currentProfile: Profile | null;
    login: (profileId: string, password?: string) => void;
    logout: () => void;
    createProfile: (name: string, password?: string) => void;
    deleteProfile: (profileId: string) => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const PROFILES_KEY = 'dominoScorekeeperProfiles';
const CURRENT_PROFILE_ID_KEY = 'dominoScorekeeperCurrentProfileId';

// Simple hashing function (for obfuscation, not security)
const simpleHash = async (text: string) => {
    const buffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

    useEffect(() => {
        // Load profiles from localStorage
        try {
            const profilesJson = localStorage.getItem(PROFILES_KEY);
            const loadedProfiles = profilesJson ? JSON.parse(profilesJson) : [];
            setProfiles(loadedProfiles);
            
            // Check for a session-persisted profile ID
            const currentProfileId = sessionStorage.getItem(CURRENT_PROFILE_ID_KEY);
            if (currentProfileId) {
                const profileToLoad = loadedProfiles.find((p: Profile) => p.id === currentProfileId);
                if (profileToLoad && !profileToLoad.passwordHash) { // Auto-login if no password
                    setCurrentProfile(profileToLoad);
                }
            }

        } catch (error) {
            console.error("Failed to load profiles from localStorage", error);
        }
    }, []);

    const saveProfiles = (updatedProfiles: Profile[]) => {
        setProfiles(updatedProfiles);
        localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));
    };

    const login = async (profileId: string, password?: string) => {
        const profile = profiles.find(p => p.id === profileId);
        if (!profile) {
            alert("پروفایل یافت نشد.");
            return;
        }

        if (profile.passwordHash) {
            if (!password) {
                alert("رمز عبور لازم است.");
                return;
            }
            const hashedInput = await simpleHash(password);
            if (hashedInput !== profile.passwordHash) {
                alert("رمز عبور اشتباه است.");
                return;
            }
        }
        
        setCurrentProfile(profile);
        sessionStorage.setItem(CURRENT_PROFILE_ID_KEY, profile.id);
    };

    const logout = () => {
        setCurrentProfile(null);
        sessionStorage.removeItem(CURRENT_PROFILE_ID_KEY);
    };

    const createProfile = async (name: string, password?: string) => {
        const newProfile: Profile = {
            id: Date.now().toString(),
            name,
        };
        if (password) {
            newProfile.passwordHash = await simpleHash(password);
        }
        const updatedProfiles = [...profiles, newProfile];
        saveProfiles(updatedProfiles);
    };

    const deleteProfile = (profileId: string) => {
        const updatedProfiles = profiles.filter(p => p.id !== profileId);
        saveProfiles(updatedProfiles);
        deleteProfileData(profileId); // Clear associated game/player data
        if (currentProfile?.id === profileId) {
            logout();
        }
    };
    
    return (
        <AuthContext.Provider value={{ profiles, currentProfile, login, logout, createProfile, deleteProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};