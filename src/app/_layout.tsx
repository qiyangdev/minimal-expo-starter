import "@/polyfills";

import { OnDeviceAISettingsProvider } from "@/lib/on-device-ai-settings";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";

export const unstable_settings = { anchor: "index" };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <OnDeviceAISettingsProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "On-device AI" }} />
          <Stack.Screen
            name="settings"
            options={{
              title: "Settings",
              presentation: "formSheet",
              sheetAllowedDetents: [1],
              sheetGrabberVisible: true,
            }}
          />
        </Stack>
      </ThemeProvider>
    </OnDeviceAISettingsProvider>
  );
}
