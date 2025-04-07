import { messaging, getToken, onMessage } from "@/lib/firebase";
import { useEffect, useState } from "react";

const useSubscriptionNotifications = () => {
    const [token, setToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<any>(null);

    useEffect(() => {
      const requestPermission = async () => {
          try {
              if (typeof window !== "undefined" && messaging) {
                  const permission = await Notification?.requestPermission();

                  if (permission === "granted") {
                      // ✅ Properly register service worker and wait for it
                      const registration =
                          await navigator.serviceWorker.register(
                              "/firebase-messaging-sw.js"
                          );

                      // ✅ Ensure it's active before proceeding
                      await navigator.serviceWorker.ready;

                      // ✅ Now it's safe to call getToken with the registration
                      const fcmToken = await getToken(messaging, {
                          vapidKey: process.env.NEXT_PUBLIC_VAPID,
                          serviceWorkerRegistration: registration,
                      });

                      setToken(fcmToken);
                      console.log("FCM Token:", fcmToken);
                  } else {
                      console.warn("Notification permission denied");
                  }
              }
          } catch (error) {
              console.error("Error getting notification permission:", error);
          }
      };


        requestPermission();

        if (messaging) {
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log("Notification received: ", payload);
                setNotification(payload);
            });

            return () => unsubscribe();
        }
    }, []);

    return { token, notification };
};

export default useSubscriptionNotifications;
