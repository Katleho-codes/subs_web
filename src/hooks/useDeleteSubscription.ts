import { useState } from "react";

import { deleteDoc, doc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { toast } from "sonner";
import useGetSubscriptions from "./useGetSubscriptions";
import { useAuth } from "./useAuth";
const useDeleteSubscription = () => {
    const [deleteSubLoading, setLoading] = useState(false); // Loading state
    const { getData } = useGetSubscriptions();
    const { user } = useAuth();
    const deleteSub = async (subId: string | string[]) => {
        if (!subId || !user) return;
        setLoading(true);
        try {
            await deleteDoc(doc(db, "subscriptions", `${subId}`));
            toast.success("Successfully deleted");
            getData();
        } catch (error: any) {
            console.error("Error deleting subscriptions:", error?.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return { deleteSub, deleteSubLoading };
};

export default useDeleteSubscription;
