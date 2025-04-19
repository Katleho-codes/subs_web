import { Timestamp } from "firebase/firestore";

export type TGetubs = {
    id: string;
    user_id: string | null;
    sub_name: string;
    categories: string | null;
    plan_name: string | null;
    billing_cycle?: "weekly" | "monthly" | "yearly";
    trial_start_date?: Timestamp;
    trial_end_date?: Timestamp;
    auto_renew: boolean | null;
    start_date?: string | Timestamp;
    next_billing_date?: string | Timestamp;
    is_trial?: boolean | null;
    amount: string | null;
    currency: string | null;
    created_at: string | null;
    updated_at?: string | null;
    sub_id: number | null;
    status?: string; // ✅ Mark these as optional if they might be missing
    category?: string;
    total_amount?: number;
};
