import { datetimestamp } from "@/lib/datetime";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

type TGetBudget = {
    month: string;
    year: string;
    amount: string | number;
    created_at: string;
    // userId: string | undefined;
};
const useGetBudget = () => {
    const [budget, setBudget] = useState<TGetBudget | null>(null);
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

            // const data = querySnapshot.docs?.map((doc) => ({
            //     id: doc?.id,
            //     ...doc?.data(),
            // }));
            const data: (TGetBudget & { id: string })[] =
                querySnapshot.docs.map((doc) => {
                    const docData = doc.data();
                    return {
                        id: doc.id,
                        month: docData.month,
                        year: docData.year,
                        amount: docData.amount,
                        created_at: docData.created_at,
                    };
                });

            if (data && data.length > 0) setBudget(data[0]);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("get sub error", error?.message);
                // toast.error("Subscription not created");
            } else {
                console.error("get sub error", error);
            }
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
