import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
type TAddBudget = {
    month: string;
    year: string;
    amount: string | number;
    created_at: string;
    // userId: string | undefined;
};

const useAddBudget = () => {
    const [addBudgetLoading, setLoading] = useState(false); // Loading state

    const { user, loading, googleLogin, logout } = useAuth();
    const addBudget = async (values: TAddBudget) => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(
                collection(db, "budget"),
                where("month", "==", values?.month),
                where("year", "==", values?.year),
                where("userId", "==", user?.uid) // ✅ Only check for current user's subscriptions
            );

            const querySnapshot = await getDocs(q);
            console.log(
                "Query Snapshot:",
                querySnapshot.docs.map((doc) => doc.data())
            ); // ✅ Log results

            if (!querySnapshot.empty) {
                console.log("Budget exists, stopping execution."); // ✅ Log condition
                toast.error("Budget exists!");
                setLoading(false);
                return;
            }

            // Remove undefined values
            const filteredValues = Object.fromEntries(
                Object.entries(values).filter(([_, v]) => v !== undefined)
            );
            const docRef = await addDoc(collection(db, "budget"), {
                ...filteredValues, // Use only valid values
                userId: user?.uid, // Ensure userId is always set
            });
            // console.log("docRef", docRef);
            // getData();
            toast.success("Budget created!");
        } catch (error: any) {
            console.log("create budget error", error);
            // toast.error("Subscription not created");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return { addBudget, addBudgetLoading };
};

export default useAddBudget;
