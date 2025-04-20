import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "./useAuth";
import { toast } from "react-hot-toast";

const useUpdateSubscription = () => {
    const [updateSubscriptionLoading, setLoading] = useState(false); // Loading state
    const { user } = useAuth();
    const updateSubscription = async (
        collectionName: string | number | any,
        rowId: string | number | any,
        values: Record<string, any>
    ) => {
        if (!rowId || !user) return;
        try {
            setLoading(true);
            // Reference to the document
            const docRef = doc(db, collectionName, rowId);

            // Step 1: Fetch the current document
            const docSnapshot = await getDoc(docRef);
            console.log("docSnapshot", docSnapshot);

            if (!docSnapshot.exists()) {
                console.error("Document not found!");
                return;
            }

            const currentData = docSnapshot.data() as Record<string, any>;

            // Step 2: Compare fields and build the update object
            const updatedFields: Record<string, any> = {};
            for (const key in values) {
                if (currentData[key] !== values[key]) {
                    updatedFields[key] = values[key];
                }
            }
            // Remove undefined values
            const filteredValues = Object.fromEntries(
                Object.entries(values).filter(([, v]) => v !== undefined)
            );
            // Step 3: Update if there are any changes
            if (Object.keys(filteredValues).length > 0) {
                await updateDoc(docRef, filteredValues);
                toast.success("Subscription updated!");
            } else {
                console.log("No changes detected. No update made.");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error updating document:", error?.message);
                // toast.error("Subscription not created");
            } else {
                console.error("Error updating document:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return { updateSubscription, updateSubscriptionLoading };
};

export default useUpdateSubscription;
