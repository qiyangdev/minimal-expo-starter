import { FieldGroup, Host, Switch, Text } from "@expo/ui";
import { scrollEdgeEffectStyle } from "@expo/ui/swift-ui/modifiers";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={Platform.OS === "ios" ? "link" : require("../../../assets/images/toolbar-link.png")}
          accessibilityLabel="GitHub Repository"
          onPress={() => Linking.openURL("https://github.com/qiyangdev/minimal-expo-starter")}
        />
      </Stack.Toolbar>
      <Host style={{ flex: 1 }}>
        <FieldGroup modifiers={[scrollEdgeEffectStyle("soft")]}>
        <FieldGroup.Section title="Notifications">
          <Switch
            label="Push"
            value={notifications}
            onValueChange={setNotifications}
          />
          <Switch
            label="Email"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
          <FieldGroup.SectionFooter><Text>These settings are examples and are not saved.</Text></FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section title="About">
          <Text>Version 1.0.0</Text>
        </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </>
  );
}
