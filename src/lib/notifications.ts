import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from '@capacitor/local-notifications';

export const initPushNotifications = async () => {
  try {
    // Request permission
    const permissionStatus = await PushNotifications.requestPermissions();

    if (permissionStatus.receive === "granted") {
      // Register with FCM
      await PushNotifications.register();

      // Add listeners
      await PushNotifications.addListener("registration", (token) => {
        console.log("Push registration success:", token.value);
      });

      await PushNotifications.addListener("registrationError", (err) => {
        console.error("Push registration failed:", err.error);
      });

      await PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {
          console.log("Push notification received:", notification);
        },
      );

      await PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {
          console.log("Push notification action performed:", notification);
        },
      );
    }
  } catch (error) {
    console.error("Error initializing push notifications:", error);
  }
};
export const sendPushNotification = async (
  title: string,
  body: string,
  data?: any,
) => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: Date.now(),
          sound: "default",
          attachments: [],
          actionTypeId: "",
          extra: data,
        },
      ],
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};
