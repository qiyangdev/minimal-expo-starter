import { Button, FieldGroup, Host, Switch, Text } from "@expo/ui";
import { scrollEdgeEffectStyle } from "@expo/ui/swift-ui/modifiers";
import * as Linking from "expo-linking";
import { useState } from "react";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
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
          <Button label="GitHub Repository" onPress={() => Linking.openURL("https://github.com/qiyangdev/minimal-expo-starter")} />
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
