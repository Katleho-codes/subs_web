import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";
import useAuth from "./useAuth";

const useAuthMethods = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const user = useAuth(); // Get the authenticated user

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    return { user, handleGoogleSignIn, handleSignOut };
};

export default useAuthMethods;
