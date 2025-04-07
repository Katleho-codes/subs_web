import { Timestamp } from "firebase/firestore";
import moment from "moment";
import calculateDaysBetweenDates from "./date_difference";
import { datetimestamp } from "./datetime";
import { TGetubs } from "./types";

async function showNotificationIfLessThanFiveDays(subs: TGetubs[]) {
    try {
        const currentDate = datetimestamp;
        const sentNotifications = JSON.parse(
            localStorage.getItem("sentNotifications") || "{}"
        );
        for (const sub of subs) {
            // console.log(sub)
            // const next_billing_date = moment(sub?.next_billing_date);
            // Example of setting next_billing_date to a Firebase Timestamp
            const next_billing_date = moment(sub?.next_billing_date); // Assuming sub.next_billing_date is a moment object
            const firebaseTimestamp = Timestamp.fromDate(
                next_billing_date?.toDate()
            ); // Convert to Firebase Timestamp

            // Calculate days until next billing date
            const daysUntilNextBilling = calculateDaysBetweenDates(
                currentDate,
                next_billing_date
            );

            // Prevent duplicate notifications on the same day
            const today = moment(currentDate).format("YYYY-MM-DD");
            if (sentNotifications[sub?.sub_name] === today) {
                continue; // Skip if the notification for today has already been sent
            }

            let message = null;
            if (daysUntilNextBilling < 0) {
                message = `Your ${sub?.sub_name} subscription has passed.`;
            } else if (daysUntilNextBilling === 0) {
                message = `Your ${sub?.sub_name} subscription is due today.`;
            } else if (daysUntilNextBilling <= 5) {
                message = `Your ${sub?.sub_name} subscription is due in ${daysUntilNextBilling} days.`;
            }

            if (message) {
                await sendNotification(sub, message);
                sentNotifications[sub?.sub_name] = today;
                localStorage.setItem(
                    "sentNotifications",
                    JSON.stringify(sentNotifications)
                ); // Save the sent notification
            }

            // Handle auto-renew
            if (sub?.auto_renew) {
                if (sub?.billing_cycle === "monthly") {
                    next_billing_date.add(1, "month");
                } else if (sub?.billing_cycle === "weekly") {
                    next_billing_date.add(1, "week");
                } else if (sub?.billing_cycle === "yearly") {
                    next_billing_date.add(1, "year");
                }
                // Save updated next billing date
                sub?.next_billing_date = firebaseTimestamp;
            }
        }
    } catch (error) {
        console.log(
            "catch error showNotificationIfLessThanFiveDays function",
            JSON.stringify(error)
        );
    }  
}
// Function to send a browser notification
async function sendNotification(sub: TGetubs, message: string) {
    // Check if Notification permission is granted
    if (Notification.permission === "granted") {
        new Notification("Subscription Reminder", {
            body: message,
            icon: "/logo192.png", // Example icon
            data: {
                sub_name: sub?.sub_name,
                subId: sub.id,
                categories: sub?.categories,
                plan_name: sub?.plan_name,
                billing_cycle: sub?.billing_cycle,
                start_date: sub?.start_date,
                next_billing_date: sub?.next_billing_date,
                total_amount: sub?.total_amount,
                currency: sub?.currency,
                auto_renew: sub?.auto_renew,
                created_at: sub?.created_at,
            },
        });
    }
}



export { showNotificationIfLessThanFiveDays };

