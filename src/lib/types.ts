export type TGetubs = {
    id: string | null | undefined;
    user_id: string | null | undefined; // Match your field or adjust based on real data (user_unique_id)
    sub_name: string | null | undefined;
    categories: string | null | undefined;
    plan_name: string | null | undefined;
    billing_cycle?: "weekly" | "monthly" | "yearly";
    trial_start_date?: {
        seconds: number | null | undefined;
        nanoseconds: number | null | undefined;
    };
    trial_end_date?: {
        seconds: number | null;
        nanoseconds: number | null;
    };
    auto_renew: boolean | null;
    start_date?: string | null | undefined;
    next_billing_date?: string | null | undefined;
    // next_billing_date?: {
    //     seconds: number | null | undefined;
    //     nanoseconds: number | null | undefined;
    // };
    is_trial?: boolean | null;
    amount: string | null | undefined | null | undefined; // Adjusted to match "total_amount" from data
    currency: string | null;
    created_at: string | null;
    updated_at?: string | null; // Optional field with null values allowed
    sub_id: number | null; // Present in your example but missing in your type
};
