import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { NativeTabs } from "expo-router/native-tabs";
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!__DEV__ || Platform.OS !== "ios") return;
    const register = async () => {
      try {
        let permission = await Notifications.getPermissionsAsync();
        if (!permission.granted && permission.canAskAgain) {
          permission = await Notifications.requestPermissionsAsync();
        }
        if (!permission.granted) return;
        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ??
          Constants.easConfig?.projectId;
        if (!projectId) throw new Error("Missing EAS project ID");
        const token = await Notifications.getExpoPushTokenAsync({ projectId });
        console.log("Expo push token:", token.data);
      } catch (error) {
        console.warn("Push registration failed:", error);
      }
    };
    void register();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
