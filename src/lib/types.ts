export type TGetubs = {
    id: string;

    sub_unique_id: string;
    user_id: string; // Match your field or adjust based on real data (user_unique_id)
    sub_name: string;
    categories: string;
    plan_name: string;
    billing_cycle?: "weekly" | "monthly" | "yearly";
    trial_start_date?: {
        seconds: number;
        nanoseconds: number;
    };
    trial_end_date?: {
        seconds: number;
        nanoseconds: number;
    };
    auto_renew: boolean;
    start_date?: {
        seconds: number;
        nanoseconds: number;
    };
    next_billing_date?: {
        seconds: number;
        nanoseconds: number;
    };
    is_trial?: boolean | null;
    amount: number; // Adjusted to match "total_amount" from data
    currency: string;
    created_at: string;
    updated_at?: string | null; // Optional field with null values allowed
    sub_id: number; // Present in your example but missing in your type
};
