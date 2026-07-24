import { Host, List, ListItem } from "@expo/ui";

export default function HomeScreen() {
  return (
    <Host style={{ flex: 1 }}>
      <List>
        <ListItem>Hello, World!</ListItem>
      </List>
    </Host>
  );
}
