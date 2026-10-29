import { FieldGroup, Host, Icon, ListItem } from "@expo/ui";
import { scrollEdgeEffectStyle } from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";

const CHEVRON = Icon.select({
  ios: "chevron.right",
  android: require("@expo/material-symbols/chevron_right.xml"),
});

export default function FeaturesScreen() {
  const router = useRouter();

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup modifiers={[scrollEdgeEffectStyle("soft")]}>
        <ListItem
          onPress={() => router.push("/features/arrangement-view")}
          trailing={<Icon name={CHEVRON} size={14} color="gray" />}
        >
          ArrangementView
        </ListItem>
      </FieldGroup>
    </Host>
  );
}
