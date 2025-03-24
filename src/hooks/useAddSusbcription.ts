import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import useGetSubscriptions from "./useGetSubscriptions";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
type TAddSub = {
    subName: string;
    category: string;
    planName?: string;
    billingCycle?: string;
    startDate?: Date;
    is_trial?:boolean;
    trial_start_date?: Date;
    nextBillingDate?: Date;
    trial_end_date?: Date;
    amount: string | number;
    currency: string;
    autoRenew?: boolean;
    created_at: string;
    userId: string;
};

const useAddSubscription = () => {
    const [addSubLoading, setLoading] = useState(false); // Loading state
    const { getData } = useGetSubscriptions();
    const addSub = async (values: TAddSub) => {
        setLoading(true);
        try {
            // check if exists
            const q = query(
                collection(db, "subscriptions"),
                where("sub_name", "==", values?.subName)
            );

            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                toast.error("Subscription exists!");
                // console.error("Subscription name already exists!");
                return;
            }

            const docRef = await addDoc(collection(db, "subscriptions"), {
                sub_name: values?.subName,
                categories: values?.category,
                plan_name: values?.planName,
                billing_cycle: values?.billingCycle,
                start_date: values?.startDate,
                next_billing_date: values?.nextBillingDate,
                total_amount: values?.amount,
                currency: values?.currency,
                auto_renew: values?.autoRenew,
                created_at: values?.created_at,
                // we will use this after setting up the auth
                // user_id: userId
            });
            getData();
            toast.success("Subscription created!");
        } catch (error: any) {
            toast.error("Subscription not created");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return { addSub, addSubLoading };
};

export default useAddSubscription;
