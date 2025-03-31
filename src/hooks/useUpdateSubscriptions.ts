import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "./useAuth";

type TUpdateSubscription = {
    sub_name: string;
    category: string;
    plan_name?: string;
    billing_cycle?: string;
    start_date?: string;
    trial_start_date?: string;
    next_billing_date?: string;
    trial_end_date?: string;
    amount: string | number;
    currency: string;
    auto_renew?: boolean;
    created_at: string;
};

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

            // Step 3: Update if there are any changes
            if (Object.keys(updatedFields).length > 0) {
                await updateDoc(docRef, updatedFields);
                console.log(
                    "Document updated successfully with fields:",
                    updatedFields
                );
            } else {
                console.log("No changes detected. No update made.");
            }
        } catch (error: any) {
            console.error(error);
            console.error("Error updating document:", error);
        } finally {
            setLoading(false);
        }
    };

    return { updateSubscription, updateSubscriptionLoading };
};

export default useUpdateSubscription;
