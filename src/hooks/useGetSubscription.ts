import { db } from "@/lib/firebase";
import { TGetubs } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const useGetSubscription = () => {
    const [subs, setSubs] = useState<TGetubs | any>(null); // Ensure initial state is null
    const [subsLoading, setSubsLoading] = useState<boolean>(true); // Loading state
    const { user } = useAuth();
    const getData = async () => {
        // If user is undefined or null, stop the fetch

        if (!user) {
            setSubsLoading(false);
            return;
        }
        try {
            setSubsLoading(true);
            const querySnapshot = await getDocs(
                collection(db, "subscriptions")
            );
            // querySnapshot.forEach((doc) => {
            //     console.log(`${doc.id} => ${doc.data()}`);
            // });
            const data = querySnapshot.docs?.map((doc) => ({
                id: doc?.id,
                ...doc?.data(),
            }));
            if (data) setSubs(data); // ✅ Store in state
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("get sub error", error?.message);
                // toast.error("Subscription not created");
            } else {
                console.error("get sub error", error);
            }
        } finally {
            setSubsLoading(false); // End loading
        }
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return { subs, subsLoading, getData };
};

export default useGetSubscription;
