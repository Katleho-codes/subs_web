export type TGetubs = {
    id: string;
    sub_unique_id: string;
    user_id: string; // Match your field or adjust based on real data (user_unique_id)
    sub_name: string;
    categories: string;
    plan_name: string;
    billing_cycle?: "weekly" | "monthly" | "yearly";
    trial_start_date?: string | null;
    trial_end_date?: string | null;
    auto_renew: boolean;
    start_date?: string;
    next_billing_date?: string;
    is_trial?: boolean | null;
    total_amount: number; // Adjusted to match "total_amount" from data
    currency: string;
    created_at: string;
    updated_at?: string | null; // Optional field with null values allowed
    sub_id: number; // Present in your example but missing in your type
};
