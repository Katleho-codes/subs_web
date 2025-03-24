"use client";
import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { User, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";

// Define the AuthContext type
interface AuthContextType {
    user: User | null;
    loading: boolean;
    googleLogin: () => Promise<void>;
    logout: () => Promise<void>;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // get the token and check expiration
                const tokenResult = await user?.getIdTokenResult()
                const expirationTime = tokenResult.expirationTime;
                // check if token is expired
                if (new Date(expirationTime).getTime() < Date.now()) {
                    await signOut(auth) // force logout if expired
                    setUser(null)
                } else {
                    setUser(user)
                }
            }
            else {
                setUser(null)
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const googleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google login error:", error);
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, googleLogin, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Custom hook to use AuthContext
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
