import { db } from "@/lib/firebase";
import { TGetubs } from "@/lib/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const useGetSubscriptions = () => {
    const [subs, setSubs] = useState<TGetubs[] | any[]>([]); // Default value is an empty array
    const [subsLoading, setSubsLoading] = useState<boolean>(true); // Loading state
    const { user } = useAuth();
    const getData = async () => {
        try {
            setSubsLoading(true);
            const q = query(
                collection(db, "subscriptions"),
                where("userId", "==", user?.uid)
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot?.docs.map((doc) => ({
                id: doc.id,
                ...doc?.data(),
            }));
            if (data !== null) setSubs(data); // ✅ Store in state
        } catch (error: any) {
            console.error("get subs error", error?.message);
            // Alert.alert(error?.message);
        } finally {
            setSubsLoading(false); // End loading
        }
    };
    useEffect(() => {
        if (user) {
            getData(); // Fetch subscriptions when user is set
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return { subs, subsLoading, getData };
};

export default useGetSubscriptions;
