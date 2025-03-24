import { TGetubs } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";
// todo: make the userId required
const useGetSubscriptions = (userId?: string) => {
    const [subs, setSubs] = useState<TGetubs[] | any>(null); // Ensure initial state is null
    const [subsLoading, setSubsLoading] = useState<boolean>(true); // Loading state
    const { user } = useAuth();
    const getData = async () => {
        // If userId is undefined or null, stop the fetch

        if (!userId) {
            setSubsLoading(false);
            return;
        }
        try {
            setSubsLoading(true);



             const q = query(
                 collection(db, "subscriptions"),
                 where("userId", "==", user?.uid)
             );
             const querySnapshot = await getDocs(q);
             const data = querySnapshot.docs.map((doc) => ({
                 id: doc.id,
                 ...doc.data(),
             }));
            if (data) setSubs(data); // ✅ Store in state
        } catch (error: any) {
            // console.error("get subs error", error?.message);
            // Alert.alert(error?.message);
        } finally {
            setSubsLoading(false); // End loading
        }
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    // todo: uncomment
    // }, [userId]);
    return { subs, subsLoading, getData };
};

export default useGetSubscriptions;
