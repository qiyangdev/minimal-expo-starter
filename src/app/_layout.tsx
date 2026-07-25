import "@/polyfills";

import { OnDeviceAISettingsProvider } from "@/lib/on-device-ai-settings";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <OnDeviceAISettingsProvider>
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <NativeTabs.Trigger.Label>AI</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="sparkles" md="auto_awesome" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Icon sf="gear" md="settings" />
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </OnDeviceAISettingsProvider>
  );
}
