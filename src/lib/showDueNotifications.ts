import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import moment, { Moment } from "moment";
import calculateDaysBetweenDates from "./calculate_dates_difference";
import { datetimestamp } from "./datetime";
import { TGetubs } from "./types";

async function showNotificationIfLessThanFiveDays(subs: TGetubs[]) {
    try {
        const currentDate = datetimestamp;
        const sentNotifications = JSON.parse(
            (await AsyncStorage.getItem("sentNotifications")) || "{}"
        );
        for (const sub of subs) {
            // console.log(sub)
            let next_billing_date:
                | Moment
                | number
                | string
                | null
                | undefined
                | any = moment(sub?.next_billing_date);

            // Calculate days until next billing date
            const daysUntilNextBilling = calculateDaysBetweenDates(
                currentDate,
                next_billing_date
            );

            // Prevent duplicate notifications on the same day
            const today = moment(currentDate).format("YYYY-MM-DD");
            if (sentNotifications[sub?.sub_name] === today) {
                continue;
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
                await AsyncStorage.setItem(
                    "sentNotifications",
                    JSON.stringify(sentNotifications)
                );
            }

            if (message) {
                await sendNotification(sub, message);
                sentNotifications[sub.sub_name] = today;
                await AsyncStorage.setItem(
                    "sentNotifications",
                    JSON.stringify(sentNotifications)
                );
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
                sub.next_billing_date = next_billing_date.format("YYYY-MM-DD");
            }
        }
    } catch (error) {
        console.log(
            "catch error showNotificationIfLessThanFiveDays function",
            JSON.stringify(error)
        );
    }
}

// Function to send a notification
async function sendNotification(sub: TGetubs, message: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Subscription Reminder",
            body: message,
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
        },
        trigger: null, // Send immediately
    });
}

export { showNotificationIfLessThanFiveDays };
