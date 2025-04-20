import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "./useAuth";
import { toast } from "react-hot-toast";

const useDeleteSubscription = () => {
    const [deleteSubscriptionLoading, setLoading] = useState(false);
    const { user } = useAuth();

    const deleteSubscription = async (
        collectionName: string,
        rowId: string
    ) => {
        if (!rowId || !user) return;
        try {
            setLoading(true);

            // Reference to the document
            const docRef = doc(db, collectionName, rowId);

            // Delete the document
            await deleteDoc(docRef);

            toast.success("Subscription deleted!");
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error deleting document:", error.message);
                toast.error("Failed to delete subscription.");
            } else {
                console.error("create sub error", error);
                toast.error("Failed to delete subscription.");
            }
        } finally {
            setLoading(false);
        }
    };

    return { deleteSubscription, deleteSubscriptionLoading };
};

export default useDeleteSubscription;
