import { Stack } from "expo-router";

export default function FeaturesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitleEnabled: true,
          title: "Features",
        }}
      />
      <Stack.Screen
        name="arrangement-view"
        options={{ headerLargeTitleEnabled: true, title: "ArrangementView" }}
      />
    </Stack>
  );
}
