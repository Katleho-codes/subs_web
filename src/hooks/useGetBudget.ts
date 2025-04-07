import { TGetubs } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";
import moment from "moment";
import { datetimestamp } from "@/lib/datetime";

type TGetBudget = {
    month: string;
    year: string;
    amount: string | number;
    created_at: string;
    // userId: string | undefined;
};
const useGetBudget = () => {
    const [budget, setBudget] = useState<TGetBudget | any>(null); // Ensure initial state is null
    const [budgetLoading, setBudgetLoading] = useState<boolean>(true); // Loading state
    const { user } = useAuth();
    const getData = async () => {
        // If user is undefined or null, stop the fetch

        if (!user) {
            setBudgetLoading(false);
            return;
        }
        try {
            setBudgetLoading(true);
            const q = query(
                collection(db, "budget"),
                where("month", "==", moment(datetimestamp).format("MMMM")),
                where("year", "==", moment(datetimestamp).format("YYYY")),
                where("userId", "==", user?.uid) // ✅ Only check for current user's subscriptions
            );
            const querySnapshot = await getDocs(q);

        
            const data = querySnapshot.docs?.map((doc) => ({
                id: doc?.id,
                ...doc?.data(),
            }));
            if (data) setBudget(data); // ✅ Store in state
        } catch (error: any) {
            console.error("get sub error", error?.message);
            // Alert.alert(error?.message);
        } finally {
            setBudgetLoading(false); // End loading
        }
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return { budget, budgetLoading, getData };
};

export default useGetBudget;
