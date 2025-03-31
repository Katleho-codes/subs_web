import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import moment, { Moment } from "moment";
import calculateDaysBetweenDates from "./calculate_dates_difference";
import { datetimestamp } from "./datetime";
import { TGetubs } from "./types";

async function showNotificationIfTrialAboutToEnd(subs: TGetubs[]) {
    try {
        const currentDate = datetimestamp;
        const sentNotifications = JSON.parse(
            (await AsyncStorage.getItem("sentNotifications")) || "{}"
        );
        const trials = [...subs]?.filter((x) => x?.is_trial === true);
        for (const sub of trials) {
            // console.log(sub)
            let trial_start_date:
                | Moment
                | number
                | string
                | null
                | undefined
                | any = moment(sub?.start_date);

            // Calculate days until next billing date
            const daysUntilTrialEnds = calculateDaysBetweenDates(
                currentDate,
                trial_start_date
            );

            // Prevent duplicate notifications on the same day
            const today = moment(currentDate).format("YYYY-MM-DD");
            if (sentNotifications[sub.sub_name] === today) {
                continue;
            }

            let message = null;
            if (daysUntilTrialEnds < 0) {
                message = `Your ${sub?.sub_name} trial subscription has passed.`;
            } else if (daysUntilTrialEnds === 0) {
                message = `Your ${sub?.sub_name} trial subscription is due today.`;
            } else if (daysUntilTrialEnds <= 5) {
                message = `Your ${sub?.sub_name} trial subscription is due in ${daysUntilTrialEnds} days.`;
            }

            if (message) {
                await sendNotification(sub, message);
                sentNotifications[sub.sub_name] = today;
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

export { showNotificationIfTrialAboutToEnd };
