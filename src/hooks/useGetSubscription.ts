import { TGetubs } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

// todo: make the userId required
const useGetSubscription = (userId?: string) => {
    const [subs, setSubs] = useState<TGetubs | any>(null); // Ensure initial state is null
    const [subsLoading, setSubsLoading] = useState<boolean>(true); // Loading state
    const { user } = useAuth();
    const getData = async () => {
        // If user is undefined or null, stop the fetch
        // todo: uncomment
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
        } catch (error: any) {
            console.error("get sub error", error?.message);
            // Alert.alert(error?.message);
        } finally {
            setSubsLoading(false); // End loading
        }
    };
    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // todo: uncomment
    // }, [userId]);
    return { subs, subsLoading, getData };
};

export default useGetSubscription;
