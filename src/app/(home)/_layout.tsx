import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerLargeTitleEnabled: true, title: "Home" }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Add",
          presentation: "formSheet",
          sheetAllowedDetents: [1],
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
