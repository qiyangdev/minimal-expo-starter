import { FieldGroup, Host, Switch, Text } from "@expo/ui";
import { scrollEdgeEffectStyle } from "@expo/ui/swift-ui/modifiers";
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
        </FieldGroup.Section>

        <FieldGroup.Section title="About">
          <Text>Version 1.0.0</Text>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
