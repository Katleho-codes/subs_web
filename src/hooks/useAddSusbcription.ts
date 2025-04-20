import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./useAuth";
type TAddSub = {
    sub_name: string;
    category: string;
    plan_name?: string;
    billing_cycle?: string;
    start_date?: string;
    is_trial?: boolean;
    trial_start_date?: string;
    next_billing_date?: string;
    trial_end_date?: string;
    amount: string | number;
    currency: string;
    auto_renew?: boolean;
    created_at: string;
    // userId: string | undefined;
};

const useAddSubscription = () => {
    const [addSubLoading, setLoading] = useState(false); // Loading state

    const { user } = useAuth();
    const addSub = async (values: TAddSub) => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(
                collection(db, "subscriptions"),
                where("sub_name", "==", values?.sub_name),
                where("userId", "==", user?.uid) // ✅ Only check for current user's subscriptions
            );

            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                
                toast.error("Subscription exists!");
                setLoading(false);
                return;
            }

            // Remove undefined values
            const filteredValues = Object.fromEntries(
                Object.entries(values).filter(([, v]) => v !== undefined)
            );
            await addDoc(collection(db, "subscriptions"), {
                ...filteredValues, // Use only valid values
                userId: user?.uid, // Ensure userId is always set
            });

            toast.success("Subscription created!");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Subscription not created");
            } else {
                console.error("create sub error", error);
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return { addSub, addSubLoading };
};

export default useAddSubscription;
