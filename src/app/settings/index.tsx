import { Button, FieldGroup, Host, Switch, Text } from "@expo/ui";
import { DatePickerDialog, TimePickerDialog } from "@expo/ui/jetpack-compose";
import { DatePicker } from "@expo/ui/swift-ui";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { Alert, AppState, Platform } from "react-native";

const notificationId = "example-local-reminder";
const channelId = "reminders";

export default function SettingsScreen() {
  const [enabled, setEnabled] = useState(false);
  const [date, setDate] = useState(() => new Date(Date.now() + 3600000));
  const [busy, setBusy] = useState(true);
  const [picker, setPicker] = useState<"date" | "time" | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [permission, scheduled] = await Promise.all([
        Notifications.getPermissionsAsync(),
        Notifications.getAllScheduledNotificationsAsync(),
      ]);
      const reminder = scheduled.find(
        (item) => item.identifier === notificationId,
      );
      const timestamp = reminder?.content.data?.scheduledAt;
      setEnabled(permission.granted && !!reminder);
      if (typeof timestamp === "number") setDate(new Date(timestamp));
    } catch {
      Alert.alert("Notifications", "Could not load notification settings.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refresh);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  const schedule = async (next: Date) => {
    if (next.getTime() <= Date.now()) {
      Alert.alert(
        "Choose a future time",
        "The notification time must be in the future.",
      );
      return;
    }
    await Notifications.scheduleNotificationAsync({
      identifier: notificationId,
      content: {
        title: "Reminder",
        body: "Your scheduled reminder is here.",
        data: { scheduledAt: next.getTime() },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: next,
        channelId,
      },
    });
    setDate(next);
    setEnabled(true);
  };

  const toggle = async (value: boolean) => {
    setBusy(true);
    try {
      if (!value) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        setEnabled(false);
      } else {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync(channelId, {
            name: "Reminders",
            importance: 3,
          });
        }
        let permission = await Notifications.getPermissionsAsync();
        if (!permission.granted && permission.canAskAgain)
          permission = await Notifications.requestPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Notifications disabled",
            "Allow notifications in system settings to schedule a reminder.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Settings",
                onPress: () => {
                  void Linking.openSettings();
                },
              },
            ],
          );
          return;
        }
        await schedule(
          date.getTime() > Date.now() ? date : new Date(Date.now() + 3600000),
        );
      }
    } catch {
      Alert.alert(
        "Notifications",
        "Could not update the reminder. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const updateDate = async (next: Date) => {
    setPicker(null);
    setBusy(true);
    try {
      await schedule(next);
    } catch {
      Alert.alert(
        "Notifications",
        "Could not update the reminder. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section title="Notifications">
          <Switch
            label="Reminder"
            value={enabled}
            onValueChange={toggle}
            disabled={busy}
          />
          {enabled &&
            (Platform.OS === "ios" ? (
              <DatePicker
                title="Reminder time"
                selection={date}
                displayedComponents={["date", "hourAndMinute"]}
                range={{ start: new Date() }}
                onDateChange={(next) => void updateDate(next)}
              />
            ) : (
              <>
                <Button
                  label={`Date: ${date.toLocaleDateString()}`}
                  onPress={() => setPicker("date")}
                />
                <Button
                  label={`Time: ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`}
                  onPress={() => setPicker("time")}
                />
                {picker === "date" && (
                  <DatePickerDialog
                    initialDate={new Date(
                      Date.UTC(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                      ),
                    ).toISOString()}
                    selectableDates={{ start: new Date() }}
                    onDateSelected={(selected) => {
                      const next = new Date(date);
                      next.setFullYear(
                        selected.getUTCFullYear(),
                        selected.getUTCMonth(),
                        selected.getUTCDate(),
                      );
                      void updateDate(next);
                    }}
                    onDismissRequest={() => setPicker(null)}
                  />
                )}
                {picker === "time" && (
                  <TimePickerDialog
                    initialDate={date.toISOString()}
                    onDateSelected={(next) => void updateDate(next)}
                    onDismissRequest={() => setPicker(null)}
                  />
                )}
              </>
            ))}
        </FieldGroup.Section>
        <FieldGroup.Section title="About">
          <Text>Version 1.0.0</Text>
          <Button
            label="GitHub Repository"
            onPress={() =>
              Linking.openURL(
                "https://github.com/qiyangdev/minimal-expo-starter",
              )
            }
          />
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
