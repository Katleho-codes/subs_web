import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./useAuth";
type TAddBudget = {
    month: string;
    year: string;
    amount: number | undefined;
    created_at: string;
};

const useAddBudget = () => {
    const [addBudgetLoading, setLoading] = useState(false); // Loading state

    const { user} = useAuth();
    const addBudget = async (values: TAddBudget) => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(
                collection(db, "budget"),
                where("month", "==", values.month),
                where("year", "==", values.year),
                where("userId", "==", user?.uid)
            );

            const querySnapshot = await getDocs(q); 

            if (!querySnapshot.empty) {
                toast.error("Budget exists!");
                setLoading(false);
                return;
            }

            // Remove undefined values
            const filteredValues = Object.fromEntries(
                Object.entries(values).filter(([, v]) => v !== undefined)
            );
            await addDoc(collection(db, "budget"), {
                ...filteredValues, // Use only valid values
                userId: user?.uid, // Ensure userId is always set
            });
            // getData();
            toast.success("Budget created!");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Subscription not created");
            } else {
                console.error("create budget error", error);
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return { addBudget, addBudgetLoading };
};

export default useAddBudget;
