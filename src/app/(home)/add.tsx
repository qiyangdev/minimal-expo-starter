import { FieldGroup, Host, Text } from "@expo/ui";
import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";

export default function AddScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon={
            Platform.OS === "ios"
              ? "xmark"
              : require("../../../assets/images/toolbar-close.png")
          }
          accessibilityLabel="Close"
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/")
          }
        />
      </Stack.Toolbar>
      <Host style={{ flex: 1 }}>
        <FieldGroup>
          <FieldGroup.Section>
            <Text>This is an example sheet.</Text>
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </>
  );
}
