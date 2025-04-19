import { db } from "@/lib/firebase";
import { TGetubs } from "@/lib/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const useGetSubscriptions = () => {
    const [subs, setSubs] = useState<TGetubs[]>([]); // Default value is an empty array
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
            // const data = querySnapshot?.docs.map((doc) => ({
            //     id: doc.id,
            //     ...doc?.data(),
            // }));
      const data: TGetubs[] = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
              id: doc.id,
              user_id: docData.user_id,
              sub_name: docData.sub_name,
              categories: docData.categories,
              plan_name: docData.plan_name,
              billing_cycle: docData.billing_cycle,
              trial_start_date: docData.trial_start_date,
              trial_end_date: docData.trial_end_date,
              auto_renew: docData.auto_renew,
              start_date: docData.start_date,
              next_billing_date: docData.next_billing_date,
              is_trial: docData.is_trial,
              amount: docData.amount,
              currency: docData.currency,
              created_at: docData.created_at,
              updated_at: docData.updated_at,
              sub_id: docData.sub_id,
            //   status: docData.status, // ✅ add missing field
            //   categoryts: docData.categoryts, // ✅ add missing field
          };
      });


            if (data !== null) setSubs(data); // ✅ Store in state
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("get subs error", error?.message);
                // toast.error("Subscription not created");
            } else {
                console.error("get subs error", error);
            }
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
