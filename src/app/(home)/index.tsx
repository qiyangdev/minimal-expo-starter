import { Button, FieldGroup, Host, Text } from "@expo/ui";
import type { ModalBottomSheetRef } from "@expo/ui/jetpack-compose";
import {
  Column,
  Host as ComposeHost,
  ModalBottomSheet,
} from "@expo/ui/jetpack-compose";
import { paddingAll } from "@expo/ui/jetpack-compose/modifiers";
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Platform } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [isPresented, setIsPresented] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  const closeSheet = async () => {
    await sheetRef.current?.hide();
    setIsPresented(false);
  };

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={
            Platform.OS === "ios"
              ? "plus"
              : require("../../../assets/images/toolbar-add.png")
          }
          accessibilityLabel="Add"
          onPress={() => {
            if (Platform.OS === "android") setIsPresented(true);
            else router.push("/(home)/add");
          }}
        />
      </Stack.Toolbar>
      <Host style={{ flex: 1 }}>
        <FieldGroup>
          <Text>Hello, World!</Text>
        </FieldGroup>
      </Host>
      {Platform.OS === "android" && isPresented && (
        <ComposeHost matchContents>
          <ModalBottomSheet
            ref={sheetRef}
            onDismissRequest={() => setIsPresented(false)}
          >
            <Column
              verticalArrangement={{ spacedBy: 12 }}
              modifiers={[paddingAll(24)]}
            >
              <Text>This is an example sheet.</Text>
              <Button label="Close" onPress={closeSheet} />
            </Column>
          </ModalBottomSheet>
        </ComposeHost>
      )}
    </>
  );
}
