import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export const useNotification = () => {
  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("existingStatus", existingStatus);
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        console.log("finalStatus", finalStatus);
        return;
      }

      // Project ID can be found in app.json | app.config.js; extra > eas > projectId
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "a494ea81-a60a-4479-8d47-ef632ff19296",
        })
      ).data;
      //   token = (await Notifications.getExpoPushTokenAsync()).data;

      // The token should be sent to the server so that it can be used to send push notifications to the device
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        showBadge: true,
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FE9018",
      });
    }

    return token;
  }

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Test title",
      body: "Test body",
      data: { testData: "test data" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  return { registerForPushNotificationsAsync, sendPushNotification };
};

