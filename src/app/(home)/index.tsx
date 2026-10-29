import { FieldGroup, Host, ListItem } from "@expo/ui";
import { scrollEdgeEffectStyle } from "@expo/ui/swift-ui/modifiers";

export default function HomeScreen() {
  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup modifiers={[scrollEdgeEffectStyle("soft")]}>
        <ListItem>Hello, World!</ListItem>
      </FieldGroup>
    </Host>
  );
}
