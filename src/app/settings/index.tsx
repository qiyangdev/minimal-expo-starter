import { FieldGroup, Host, Switch, Text } from "@expo/ui";
import { useState } from "react";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
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
